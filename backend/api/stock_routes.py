from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
from backend.core.models import get_session, Stock, StockPrice
from ml_and_db.scrapers.stock_scraper import (
    fetch_current_price,
    fetch_stock_details,
    fetch_stock_history,
    fetch_market_movers,
    fetch_market_overview,
    fetch_technical_indicators,
    STOCKS,
)

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
            # Get latest price using subquery
            latest = session.query(StockPrice).filter(
                StockPrice.symbol == stock.symbol
            ).order_by(StockPrice.timestamp.desc()).first()

            # Debug — print what we find
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

@router.get("/{symbol}/technical")
def get_technical_indicators(symbol: str):

    data = fetch_technical_indicators(symbol)

    if not data:
        raise HTTPException(
            status_code=404,
            detail="Technical indicators not found"
        )

    return data

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

@router.get("/market-overview")
def get_market_overview():
    return fetch_market_overview()



@router.get("/{symbol}")
def get_stock(symbol: str):
    """Get a single stock with its price history"""
    session = get_session()
    try:
        stock = session.query(Stock).filter_by(symbol=symbol).first()
        if not stock:
            raise HTTPException(status_code=404, detail="Stock not found")

        # Get last 24 hours of prices
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
