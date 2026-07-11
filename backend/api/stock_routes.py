from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
from backend.core.models import get_session, Stock, StockPrice, NewsArticle, Alert
from ml_and_db.scrapers.stock_scraper import fetch_current_price, STOCKS


router = APIRouter(prefix="/api/stocks", tags=["stocks"])



def seed_stocks():
    session = get_session()
    try:
        for s in STOCKS:
            existing = session.query(Stock).filter_by(symbol=s["symbol"]).first()
            if not existing:
                stock = Stock(symbol=s["symbol"], name=s["name"])
                session.add(stock)
        session.commit()
        print(" Stocks seeded into database")
    except Exception as e:
        session.rollback()
        print(f" Error seeding stocks: {e}")
    finally:
        session.close()



def save_price(data: dict):
    session = get_session()
    try:
        record = StockPrice(
            symbol    = data["symbol"],
            open      = data["open"],
            high      = data["high"],
            low       = data["low"],
            close     = data["close"],
            volume    = data["volume"],
            timestamp = data["timestamp"],
        )
        session.add(record)
        session.commit()
    except Exception as e:
        session.rollback()
        print(f" Error saving price: {e}")
    finally:
        session.close()



@router.get("/")
def get_all_stocks():
    """Get all monitored stocks with latest price"""
    session = get_session()
    try:
        stocks = session.query(Stock).filter_by(is_active=True).all()
        result = []
        for stock in stocks:
          
            latest = session.query(StockPrice).filter(
                StockPrice.symbol == stock.symbol
            ).order_by(StockPrice.timestamp.desc()).first()

           
            print(f"{stock.symbol} → latest price: {latest}")

            result.append({
                "symbol":    stock.symbol,
                "name":      stock.name,
                "price":     round(latest.close, 2) if latest else None,
                "volume":    latest.volume if latest else None,
                "timestamp": latest.timestamp.isoformat() if latest else None,
            })

        return {"stocks": result, "count": len(result)}
    finally:
        session.close()


@router.get("/{symbol}")
def get_stock(symbol: str):
    """Get a single stock with its price history"""
    session = get_session()
    try:
        stock = session.query(Stock).filter_by(symbol=symbol).first()
        if not stock:
            raise HTTPException(status_code=404, detail="Stock not found")

       
        cutoff = datetime.utcnow() - timedelta(hours=24)
        prices = session.query(StockPrice).filter(
            StockPrice.symbol == symbol,
            StockPrice.timestamp >= cutoff
        ).order_by(StockPrice.timestamp.asc()).all()

        return {
            "symbol": stock.symbol,
            "name":   stock.name,
            "prices": [
                {
                    "open":      p.open,
                    "high":      p.high,
                    "low":       p.low,
                    "close":     p.close,
                    "volume":    p.volume,
                    "timestamp": p.timestamp.isoformat(),
                }
                for p in prices
            ]
        }
    finally:
        session.close()


@router.get("/{symbol}/refresh")
def refresh_stock_price(symbol: str):
    """Fetch latest price for a stock and save to DB"""
    data = fetch_current_price(symbol)
    if not data:
        raise HTTPException(status_code=404, detail="Could not fetch price")

    save_price(data)
    return {
        "symbol": symbol,
        "price":  data["close"],
        "volume": data["volume"],
        "time":   data["timestamp"].isoformat(),
    }
@router.get("/refresh/all")
def refresh_all_stocks():
    """Fetch and save latest prices for all stocks"""
    results = []
    failed = []
    errors_detail = []

    for stock in STOCKS:
        try:
            data = fetch_current_price(stock["symbol"])
            if data:
                save_price(data)
                results.append({
                    "symbol": data["symbol"],
                    "price":  data["close"],
                })
            else:
                failed.append(stock["symbol"])
                errors_detail.append(f"{stock['symbol']}: returned None")
        except Exception as e:
            failed.append(stock["symbol"])
            errors_detail.append(f"{stock['symbol']}: {str(e)}")

    return {
        "success": len(results),
        "failed":  len(failed),
        "stocks":  results,
        "errors":  failed,
        "details": errors_detail,
    }


@router.get("/{symbol}/risk")
def get_stock_risk(symbol: str):
    """Get basic risk score for a stock based on price and news data"""
    session = get_session()
    try:
      
        stock = session.query(Stock).filter_by(symbol=symbol).first()
        if not stock:
            raise HTTPException(status_code=404, detail="Stock not found")

   
        prices = session.query(StockPrice).filter_by(
            symbol=symbol
        ).order_by(StockPrice.timestamp.desc()).limit(20).all()

        # Get recent news pump score
        cutoff = datetime.utcnow() - timedelta(hours=24)
        news = session.query(NewsArticle).filter(
            NewsArticle.symbol == symbol,
            NewsArticle.published_at >= cutoff
        ).all()

   
        price_score = 0
        if len(prices) >= 2:
            latest  = prices[0].close
            average = sum(p.close for p in prices) / len(prices)
            change  = abs(latest - average) / average * 100
            price_score = min(100, change * 10)

    
        news_score = 0
        if news:
            avg_pump = sum(n.pump_score for n in news) / len(news)
            news_score = avg_pump

     
        total_score = (price_score * 0.6) + (news_score * 0.4)
        total_score = round(min(100, total_score), 1)

        
        if total_score >= 80:
            risk_level = "CRITICAL"
        elif total_score >= 60:
            risk_level = "HIGH"
        elif total_score >= 35:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        return {
            "symbol":      symbol,
            "risk_score":  total_score,
            "risk_level":  risk_level,
            "price_score": round(price_score, 1),
            "news_score":  round(news_score, 1),
            "prices_used": len(prices),
            "news_used":   len(news),
        }
    finally:
        session.close()


@router.get("/watchlist/all")
def get_watchlist():
    """Get all stocks with price and risk score — for frontend watchlist"""
    session = get_session()
    try:
        stocks  = session.query(Stock).filter_by(is_active=True).all()
        result  = []

        for stock in stocks:
            # Latest price
            latest = session.query(StockPrice).filter_by(
                symbol=stock.symbol
            ).order_by(StockPrice.timestamp.desc()).first()

            # Latest alert
            alert = session.query(Alert).filter_by(
                symbol=stock.symbol
            ).order_by(Alert.created_at.desc()).first()

            result.append({
                "symbol":     stock.symbol,
                "name":       stock.name,
                "price":      latest.close if latest else None,
                "volume":     latest.volume if latest else None,
                "risk_score": alert.risk_score if alert else 0,
                "risk_level": alert.risk_level if alert else "LOW",
                "pattern":    alert.pattern if alert else "none",
            })

      
        result.sort(key=lambda x: x["risk_score"], reverse=True)

        return {"stocks": result, "count": len(result)}
    finally:
        session.close()


@router.get("/scan/all")
def scan_all():
    """Run risk scan on all stocks and return results"""
    from ml_and_db.ml.anomaly_detector import scan_all_stocks
    results = scan_all_stocks()
    return {
        "scanned":  len(results),
        "results":  results,
        "scan_time": datetime.utcnow().isoformat(),
    }


@router.get("/{symbol}/scan")
def scan_stock(symbol: str):
    """Run risk scan on a single stock"""
    from ml_and_db.ml.anomaly_detector import compute_risk_score
    result = compute_risk_score(symbol)
    return result
