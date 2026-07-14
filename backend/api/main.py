import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from backend.core.models import (
    init_db, get_session,
    Stock, StockPrice,
    NewsArticle, Alert
)
from backend.api.auth_routes import router as auth_router
from backend.api.stock_routes import router as stock_router, seed_stocks
from backend.api.news_routes import router as news_router
from backend.api.alert_routes import router as alert_router
from ml_and_db.scheduler import start_scheduler, stop_scheduler
from backend.api.watchlist_routes import router as watchlist_router
from backend.api.search_routes import router as search_router

app = FastAPI(title="MarketGuard AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(stock_router)
app.include_router(news_router)
app.include_router(alert_router)
app.include_router(watchlist_router)
app.include_router(search_router)


@app.on_event("startup")
def startup():
    init_db()
    seed_stocks()
    start_scheduler()
    print("MarketGuard AI started")


@app.on_event("shutdown")
def shutdown():
    stop_scheduler()
    print("MarketGuard AI stopped")


@app.get("/api/health")
def health():
    return {"status": "ok", "message": "MarketGuard AI is running"}


@app.get("/api/dashboard/summary")
def dashboard_summary():
    session = get_session()
    try:
        cutoff_24h = datetime.utcnow() - timedelta(hours=24)

        total_stocks = session.query(Stock).filter_by(is_active=True).count()
        alerts_24h   = session.query(Alert).filter(
            Alert.created_at >= cutoff_24h
        ).count()
        critical = session.query(Alert).filter(
            Alert.created_at >= cutoff_24h,
            Alert.risk_level == "CRITICAL"
        ).count()
        news_24h = session.query(NewsArticle).filter(
            NewsArticle.published_at >= cutoff_24h
        ).count()

        recent_alerts = session.query(Alert).filter(
            Alert.created_at >= cutoff_24h
        ).order_by(Alert.created_at.desc()).limit(5).all()

        stocks = session.query(Stock).filter_by(is_active=True).all()
        stock_list = []
        for stock in stocks:
            latest = session.query(StockPrice).filter_by(
                symbol=stock.symbol
            ).order_by(StockPrice.timestamp.desc()).first()
            stock_list.append({
                "symbol": stock.symbol,
                "name":   stock.name,
                "price":  latest.close if latest else None,
            })

        return {
            "total_stocks":    total_stocks,
            "alerts_24h":      alerts_24h,
            "critical_alerts": critical,
            "news_24h":        news_24h,
            "recent_alerts": [
                {
                    "symbol":     a.symbol,
                    "risk_score": a.risk_score,
                    "risk_level": a.risk_level,
                    "pattern":    a.pattern,
                    "created_at": a.created_at.isoformat(),
                }
                for a in recent_alerts
            ],
            "stocks": stock_list,
        }
    finally:
        session.close()


@app.get("/api/scheduler/status")
def scheduler_status():
    """Check what scheduled jobs are running"""
    from ml_and_db.scheduler import scheduler
    jobs = []
    for job in scheduler.get_jobs():
        jobs.append({
            "id":       job.id,
            "name":     job.name,
            "next_run": job.next_run_time.isoformat() if job.next_run_time else None,
        })
    return {
        "running": scheduler.running,
        "jobs":    jobs,
        "count":   len(jobs)
    }
@app.post("/api/reports/generate/{symbol}")
def generate_report_endpoint(symbol: str):
    """Generate a PDF report for a stock"""
    session = get_session()
    try:
        # Get stock info
        stock = session.query(Stock).filter_by(symbol=symbol).first()
        if not stock:
            raise HTTPException(status_code=404, detail="Stock not found")

        # Get latest alert
        alert = session.query(Alert).filter_by(
            symbol=symbol
        ).order_by(Alert.created_at.desc()).first()

        if not alert:
            raise HTTPException(
                status_code=404,
                detail="No alerts found for this stock — run a risk scan first"
            )


        risk_data = {
            "risk_score": alert.risk_score,
            "risk_level": alert.risk_level,
            "components": {
                "price_anomaly":  {"score": 0, "pct_change": 0, "z_score": 0},
                "volume_anomaly": {"score": 0, "volume_ratio": 1},
                "sentiment":      {"score": 0, "avg_sentiment": 0,
                                   "article_count": 0, "label": "neutral"},
                "pump_language":  {"score": 0, "article_count": 0},
            }
        }

        # Get recent news
        from datetime import timedelta
        cutoff = datetime.utcnow() - timedelta(hours=24)
        news = session.query(NewsArticle).filter(
            NewsArticle.symbol == symbol,
            NewsArticle.published_at >= cutoff
        ).limit(8).all()

        news_list = [
            {
                "title":      n.title,
                "source":     n.source,
                "pump_score": n.pump_score,
            }
            for n in news
        ]

        from ml_and_db.ml.narrative_generator import generate_narrative
        narrative = generate_narrative(symbol, stock.name, risk_data)

        # Generate PDF
        from ml_and_db.ml.report_generator import generate_report
        path = generate_report(
            symbol     = symbol,
            stock_name = stock.name,
            risk_data  = risk_data,
            narrative  = narrative,
            news       = news_list,
        )

        filename = os.path.basename(path)
        return {
            "message":  "Report generated successfully",
            "symbol":   symbol,
            "filename": filename,
            "path":     path,
        }

    finally:
        session.close()


@app.get("/api/reports/download/{filename}")
def download_report(filename: str):
    """Download a generated PDF report"""
    from fastapi.responses import FileResponse
    filepath = os.path.join("reports", filename)

    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Report not found")

    return FileResponse(
        filepath,
        media_type = "application/pdf",
        filename   = filename,
    )

# ── Search endpoint ───────────────────────────
@app.get("/api/search")
def search_stocks(q: str = ""):
    """Search stocks by symbol or name — used by HeroSearch"""
    session = get_session()
    try:
        if not q or len(q) < 1:
            stocks = session.query(Stock).filter_by(is_active=True).limit(10).all()
        else:
            stocks = session.query(Stock).filter(
                Stock.symbol.ilike(f"%{q.upper()}%") |
                Stock.name.ilike(f"%{q}%")
            ).filter_by(is_active=True).limit(10).all()

        return {
            "results": [
                {"symbol": s.symbol, "name": s.name}
                for s in stocks
            ]
        }
    finally:
        session.close()



@app.get("/api/watchlist/{user_id}")
def get_watchlist(user_id: int):
    """Get watchlist for a user — used by WatchList component"""
    session = get_session()
    try:
        stocks = session.query(Stock).filter_by(is_active=True).all()
        result = []

        for stock in stocks:
            # Latest price
            latest = session.query(StockPrice).filter_by(
                symbol=stock.symbol
            ).order_by(StockPrice.timestamp.desc()).first()

            # Previous price
            previous = session.query(StockPrice).filter_by(
                symbol=stock.symbol
            ).order_by(StockPrice.timestamp.desc()).offset(1).first()

            # Latest alert for risk
            alert = session.query(Alert).filter_by(
                symbol=stock.symbol
            ).order_by(Alert.created_at.desc()).first()

            # Latest news
            news_items = session.query(NewsArticle).filter_by(
                symbol=stock.symbol
            ).order_by(NewsArticle.published_at.desc()).limit(2).all()

            result.append({
                "symbol":        stock.symbol,
                "companyName":   stock.name,
                "price":         latest.close if latest else 0,
                "previousClose": previous.close if previous else 0,
                "recommendation": "BUY" if (alert and alert.risk_score < 35)
                                  else "SELL" if (alert and alert.risk_score > 60)
                                  else "HOLD",
                "news": [
                    {
                        "headline":  n.title[:100],
                        "source":    n.source,
                        "time":      n.published_at.strftime("%H:%M") if n.published_at else "",
                        "sentiment": "positive" if n.pump_score < 30 else "negative",
                        "confidence": 80,
                    }
                    for n in news_items
                ],
            })

        return {"watchlist": result, "count": len(result)}
    finally:
        session.close()


@app.get("/api/news/market")
def get_market_news(limit: int = 20):
    """Get latest market news — used by News component"""
    session = get_session()
    try:
        articles = session.query(NewsArticle).order_by(
            NewsArticle.published_at.desc()
        ).limit(limit).all()

        return {
            "articles": [
                {
                    "id":          a.id,
                    "title":       a.title,
                    "url":         a.url,
                    "source":      a.source,
                    "publishedAt": a.published_at.isoformat() if a.published_at else None,
                    "pump_score":  a.pump_score,
                }
                for a in articles
            ],
            "count": len(articles)
        }
    finally:
        session.close()
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.api.main:app", host="0.0.0.0", port=8000, reload=True)
