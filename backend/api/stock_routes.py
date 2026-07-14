from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
<<<<<<< HEAD
from backend.core.models import get_session, Stock, StockPrice, NewsArticle, Alert
from ml_and_db.scrapers.stock_scraper import fetch_current_price, STOCKS

=======
from backend.core.models import get_session, Stock, StockPrice
from ml_and_db.scrapers.stock_scraper import (
    fetch_current_price,
    fetch_stock_details,
    fetch_stock_history,
    fetch_market_movers,
    STOCKS,
)
>>>>>>> d45b9f1 (Update backend APIs and frontend fixes)

router = APIRouter(prefix="/api/stocks", tags=["stocks"])

@router.get("/movers")
def get_market_movers():
    """Get top gainers and losers — must be before /{symbol} route"""
    try:
        from ml_and_db.scrapers.stock_scraper import fetch_all_stocks
        live_prices = fetch_all_stocks()

        if not live_prices:
            return {"gainers": [], "losers": []}

        session = get_session()
        gainers = []
        losers  = []

        for price_data in live_prices:
            symbol = price_data["symbol"]
            stock  = session.query(Stock).filter_by(symbol=symbol).first()
            name   = stock.name if stock else symbol

            current = price_data["close"]
            open_p  = price_data["open"]
            change  = round((current - open_p) / open_p * 100, 2) if open_p else 0.0

            news = session.query(NewsArticle).filter_by(
                symbol=symbol
            ).order_by(NewsArticle.published_at.desc()).first()

            item = {
                "symbol":      symbol,
                "companyName": name,
                "price":       round(current, 2),
                "change":      change,
                "reason":      news.title[:100] if news else "Active trading detected",
                "source":      news.source if news else "MarketGuard AI",
            }

            if change >= 0:
                gainers.append(item)
            else:
                losers.append(item)

        session.close()
        gainers.sort(key=lambda x: x["change"], reverse=True)
        losers.sort(key=lambda x: x["change"])

        return {"gainers": gainers[:4], "losers": losers[:4]}

    except Exception as e:
        return {"gainers": [], "losers": [], "error": str(e)}

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

def generate_ai_analysis(data):
    score = 0
    summary = []

    pe = data.get("peRatio")
    eps = data.get("eps")
    beta = data.get("beta")
    market_cap = data.get("marketCap")
    current_price = data.get("price") or 0

    # PE Ratio
    if pe:
        if pe < 20:
            score += 2
            summary.append("Healthy P/E Ratio indicates attractive valuation.")
        elif pe < 35:
            score += 1
            summary.append("Fair valuation compared to peers.")
        else:
            summary.append("Stock appears relatively expensive.")

    # EPS
    if eps:
        if eps > 0:
            score += 2
            summary.append("Positive earnings per share.")
        else:
            summary.append("Negative EPS is a concern.")

    # Market Cap
    if market_cap:
        if market_cap > 1_000_000_000_000:
            score += 2
            summary.append("Large-cap company with stable business.")
        else:
            score += 1
            summary.append("Mid/Small-cap company.")

    # Beta & Risk
    if beta:
        if beta < 1:
            score += 2
            risk = "Low"
        elif beta < 1.5:
            score += 1
            risk = "Medium"
        else:
            risk = "High"
    else:
        risk = "Medium"

    # Recommendation
    # AI Score (0-100)
    aiScore = round((score / 8) * 100)
    aiScore = max(35, min(aiScore, 95))

    if aiScore >= 80:
        recommendation = "BUY"
    elif aiScore >= 60:
        recommendation = "HOLD"
    else:
        recommendation = "SELL"

    # Target Price
    if recommendation == "BUY":
        target = current_price * 1.12
    elif recommendation == "HOLD":
        target = current_price * 1.03
    else:
        target = current_price * 0.90

    # Colors
    if recommendation == "BUY":
        color = "#22C55E"
        colorDim = "rgba(34,197,94,0.15)"
        colorBorder = "rgba(34,197,94,0.35)"
        glow = "rgba(34,197,94,0.40)"

    elif recommendation == "HOLD":
        color = "#FACC15"
        colorDim = "rgba(250,204,21,0.15)"
        colorBorder = "rgba(250,204,21,0.35)"
        glow = "rgba(250,204,21,0.40)"

    else:
        color = "#EF4444"
        colorDim = "rgba(239,68,68,0.15)"
        colorBorder = "rgba(239,68,68,0.35)"
        glow = "rgba(239,68,68,0.40)"

    return {
        "recommendation": recommendation,
        "aiScore": aiScore,
        "risk": risk,
        "summary": summary,
        "reasoning": (
            f"AI analyzed PE Ratio ({pe}), EPS ({eps}), "
            f"Beta ({beta}) and Market Capitalization."
        ),
        "currentPrice": current_price,
        "targetPrice": round(target, 2),
        "color": color,
        "colorDim": colorDim,
        "colorBorder": colorBorder,
        "glow": glow,
    }



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
<<<<<<< HEAD
=======
@router.get("/{symbol}/details")
def get_stock_details(symbol: str):
    data = fetch_stock_details(symbol)

    if not data:
        raise HTTPException(status_code=404, detail="Stock not found")

    data["aiAnalysis"] = generate_ai_analysis(data)

    return data

@router.get("/{symbol}/history")
def get_stock_history(symbol: str, period: str="6mo"):
    data = fetch_stock_history(symbol, period)

    if not data:
        raise HTTPException(status_code=404, detail="Stock history not found")

    return data
>>>>>>> d45b9f1 (Update backend APIs and frontend fixes)

@router.get("/compare")
def compare_stocks(stock1: str, stock2: str):
    data1 = fetch_stock_details(stock1)
    data2 = fetch_stock_details(stock2)

    if not data1 or not data2:
        raise HTTPException(status_code=404, detail="One or both stocks not found")

    score1 = 0
    score2 = 0

    # Lower PE is better
    if data1["peRatio"] and data2["peRatio"]:
        if data1["peRatio"] < data2["peRatio"]:
            score1 += 1
        else:
            score2 += 1

    # Higher EPS is better
    if data1["eps"] and data2["eps"]:
        if data1["eps"] > data2["eps"]:
            score1 += 1
        else:
            score2 += 1

    # Higher Market Cap is better
    if data1["marketCap"] and data2["marketCap"]:
        if data1["marketCap"] > data2["marketCap"]:
            score1 += 1
        else:
            score2 += 1

    # Lower Beta is safer
    if data1["beta"] and data2["beta"]:
        if data1["beta"] < data2["beta"]:
            score1 += 1
        else:
            score2 += 1

    winner = stock1 if score1 >= score2 else stock2

    # Confidence
    max_score = max(score1, score2)
    total_score = score1 + score2

    if total_score == 0:
      confidence = 50
    else:
      confidence = round((max_score / total_score) * 100)

# Recommendation
    recommendation = "BUY" if confidence >= 75 else "HOLD"

# Winner stock data
    winner_data = data1 if winner == stock1 else data2

# Risk
    beta = winner_data.get("beta") or 1.0

    if beta < 1:
        risk = "Low"
    elif beta < 1.5:
        risk = "Medium"
    else:
        risk = "High"

# AI Summary
    summary = [
        f"{data1['companyName']} and {data2['companyName']} are fundamentally strong companies.",
        f"{winner_data['companyName']} currently has stronger fundamentals.",
        "Always do your own research before investing."
    ]

# Reasons
    reasons = [
        f"Higher comparison score ({max(score1, score2)}).",
        "Better valuation and financial strength.",
        "Lower overall investment risk."
    ]

# Comparison bars
    bars = [
        {
            "label": "Fundamentals",
            "a": score1 * 25,
            "b": score2 * 25,
        },
        {
            "label": "Valuation",
            "a": 100 - min((data1.get("peRatio") or 100), 100),
            "b": 100 - min((data2.get("peRatio") or 100), 100),
        },
        {
            "label": "Growth",
            "a": min((data1.get("eps") or 0) * 10, 100),
            "b": min((data2.get("eps") or 0) * 10, 100),
        },
        {
            "label": "Technical Strength",
            "a": min((data1.get("volume") or 0) / 2_000_000, 100),
            "b": min((data2.get("volume") or 0) / 2_000_000, 100),
        },
    ]

    return {
        "stock1": data1,
        "stock2": data2,
        "winner": winner,
        "score1": score1,
        "score2": score2,
        "winnerConf": confidence,
        "recommendation": recommendation,
        "risk": risk,
        "summary": summary,
        "reasons": reasons,
        "bars": bars,
    }

@router.get("/movers")
def get_market_movers():
    return fetch_market_movers()

@router.get("/{symbol}")
def get_stock(symbol: str):
    """Get a single stock with its price history"""

    # Prevent conflict with named routes
    if symbol.lower() in ("movers", "watchlist", "scan", "refresh", "all"):
        raise HTTPException(status_code=404, detail="Not found")

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
