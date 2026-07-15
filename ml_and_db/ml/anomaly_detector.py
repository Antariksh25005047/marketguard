<<<<<<< HEAD
import numpy as np
from datetime import datetime, timedelta
from backend.core.models import get_session, Stock, StockPrice, NewsArticle, Alert
from ml_and_db.ml.sentiment import get_stock_sentiment


WEIGHTS = {
    "price_anomaly":  0.35,
    "volume_anomaly": 0.30,
    "news_sentiment": 0.20,
    "pump_language":  0.15,
}


THRESHOLDS = {
    "LOW":      (0,  35),
    "MEDIUM":   (35, 60),
    "HIGH":     (60, 80),
    "CRITICAL": (80, 100),
}


def detect_price_anomaly(symbol: str, lookback: int = 20) -> dict:
    """Detect unusual price movement using Z-score"""
    session = get_session()
    try:
        prices = session.query(StockPrice).filter_by(
            symbol=symbol
        ).order_by(StockPrice.timestamp.desc()).limit(lookback).all()

        if len(prices) < 3:
            return {"score": 0, "pct_change": 0, "z_score": 0}

        closes = [p.close for p in prices]
        closes.reverse()  # oldest first

        # Percentage changes
        pct_changes = []
        for i in range(1, len(closes)):
            change = (closes[i] - closes[i-1]) / closes[i-1] * 100
            pct_changes.append(change)

        if not pct_changes:
            return {"score": 0, "pct_change": 0, "z_score": 0}

        mean    = np.mean(pct_changes)
        std     = np.std(pct_changes)
        latest  = pct_changes[-1]

        if std == 0:
            return {"score": 0, "pct_change": round(latest, 2), "z_score": 0}

        z_score = abs((latest - mean) / std)
        score   = min(100, (z_score / 5.0) * 100)

        return {
            "score":      round(score, 1),
            "pct_change": round(latest, 2),
            "z_score":    round(z_score, 2),
        }

    finally:
        session.close()


def detect_volume_anomaly(symbol: str, lookback: int = 20) -> dict:
    """Detect unusual volume spike"""
    session = get_session()
    try:
        prices = session.query(StockPrice).filter_by(
            symbol=symbol
        ).order_by(StockPrice.timestamp.desc()).limit(lookback).all()

        if len(prices) < 3:
            return {"score": 0, "volume_ratio": 1.0}

        volumes = [p.volume for p in prices]
        current = volumes[0]
        avg_vol = np.mean(volumes[1:])

        if avg_vol == 0:
            return {"score": 0, "volume_ratio": 1.0}

        ratio = current / avg_vol
        score = min(100, max(0, (ratio - 1) / 4 * 100))

        return {
            "score":        round(score, 1),
            "volume_ratio": round(ratio, 2),
            "current_vol":  int(current),
            "avg_vol":      int(avg_vol),
        }

    finally:
        session.close()


def detect_news_pump(symbol: str, hours: int = 24) -> dict:
    """Detect pump language in recent news"""
    session = get_session()
    try:
        cutoff   = datetime.utcnow() - timedelta(hours=hours)
        articles = session.query(NewsArticle).filter(
            NewsArticle.symbol == symbol,
            NewsArticle.published_at >= cutoff
        ).all()

        if not articles:
            return {"score": 0, "article_count": 0, "avg_pump_score": 0}

        avg_pump = sum(a.pump_score for a in articles) / len(articles)
        score    = min(100, avg_pump)

        return {
            "score":          round(score, 1),
            "article_count":  len(articles),
            "avg_pump_score": round(avg_pump, 1),
        }

    finally:
        session.close()


def get_risk_level(score: float) -> str:
    """Convert score to risk level"""
    for level, (low, high) in THRESHOLDS.items():
        if low <= score < high:
            return level
    return "CRITICAL"


def compute_risk_score(symbol: str) -> dict:
    """
    Compute comprehensive manipulation risk score for a stock.
    Combines price anomaly, volume anomaly, sentiment and pump language.
    """
    print(f"Computing risk score for {symbol}...")

    # Get all component scores
    price_data   = detect_price_anomaly(symbol)
    volume_data  = detect_volume_anomaly(symbol)
    sentiment    = get_stock_sentiment(symbol)
    pump_data    = detect_news_pump(symbol)

   
    sentiment_score = 0
    if sentiment["avg_sentiment"] > 0.5:
        sentiment_score = 80
    elif sentiment["avg_sentiment"] > 0.3:
        sentiment_score = 50
    elif sentiment["avg_sentiment"] > 0.1:
        sentiment_score = 20
    else:
        sentiment_score = 0

  
    total = (
        price_data["score"]  * WEIGHTS["price_anomaly"]  +
        volume_data["score"] * WEIGHTS["volume_anomaly"] +
        sentiment_score      * WEIGHTS["news_sentiment"] +
        pump_data["score"]   * WEIGHTS["pump_language"]
    )

    total      = round(min(100, total), 1)
    risk_level = get_risk_level(total)

    result = {
        "symbol":     symbol,
        "risk_score": total,
        "risk_level": risk_level,
        "components": {
            "price_anomaly":  price_data,
            "volume_anomaly": volume_data,
            "sentiment":      sentiment,
            "pump_language":  pump_data,
        }
    }

    print(f"  Score: {total} | Level: {risk_level}")
    return result


def scan_all_stocks() -> list:
    """Compute risk scores for all active stocks"""
    session = get_session()
    try:
        stocks = session.query(Stock).filter_by(is_active=True).all()
    finally:
        session.close()

    results = []
    for stock in stocks:
        try:
            risk = compute_risk_score(stock.symbol)
            results.append(risk)

            # Save alert if HIGH or CRITICAL
            if risk["risk_level"] in ("HIGH", "CRITICAL"):
                save_alert(risk)

        except Exception as e:
            print(f"❌ Error scanning {stock.symbol}: {e}")

    results.sort(key=lambda x: x["risk_score"], reverse=True)
    return results


def save_alert(risk_data: dict):
    """Save a manipulation alert to database"""
    session = get_session()
    try:
        
        cutoff = datetime.utcnow() - timedelta(hours=1)
        existing = session.query(Alert).filter(
            Alert.symbol     == risk_data["symbol"],
            Alert.created_at >= cutoff
        ).first()

        if existing:
            return

        alert = Alert(
            symbol      = risk_data["symbol"],
            risk_score  = risk_data["risk_score"],
            risk_level  = risk_data["risk_level"],
            pattern     = "anomaly_detected",
            description = (
                f"Price anomaly: {risk_data['components']['price_anomaly']['score']:.0f}/100 | "
                f"Volume anomaly: {risk_data['components']['volume_anomaly']['score']:.0f}/100 | "
                f"Pump language: {risk_data['components']['pump_language']['score']:.0f}/100"
            ),
        )
        session.add(alert)
        session.commit()
        print(f"Alert saved for {risk_data['symbol']} — {risk_data['risk_level']}")

    except Exception as e:
        session.rollback()
        print(f" Error saving alert: {e}")
    finally:
        session.close()


if __name__ == "__main__":
    print(" Scanning all stocks for manipulation...\n")
    results = scan_all_stocks()

    print(f"\n{'Symbol':<20} {'Score':>6} {'Level'}")
    print("-" * 40)
    for r in results:
=======
import numpy as np
from datetime import datetime, timedelta
from backend.core.models import get_session, Stock, StockPrice, NewsArticle, Alert
from ml_and_db.ml.sentiment import get_stock_sentiment


WEIGHTS = {
    "price_anomaly":  0.35,
    "volume_anomaly": 0.30,
    "news_sentiment": 0.20,
    "pump_language":  0.15,
}


THRESHOLDS = {
    "LOW":      (0,  35),
    "MEDIUM":   (35, 60),
    "HIGH":     (60, 80),
    "CRITICAL": (80, 100),
}


def detect_price_anomaly(symbol: str, lookback: int = 20) -> dict:
    """Detect unusual price movement using Z-score"""
    session = get_session()
    try:
        prices = session.query(StockPrice).filter_by(
            symbol=symbol
        ).order_by(StockPrice.timestamp.desc()).limit(lookback).all()

        if len(prices) < 3:
            return {"score": 0, "pct_change": 0, "z_score": 0}

        closes = [p.close for p in prices]
        closes.reverse()  # oldest first

        # Percentage changes
        pct_changes = []
        for i in range(1, len(closes)):
            change = (closes[i] - closes[i-1]) / closes[i-1] * 100
            pct_changes.append(change)

        if not pct_changes:
            return {"score": 0, "pct_change": 0, "z_score": 0}

        mean    = np.mean(pct_changes)
        std     = np.std(pct_changes)
        latest  = pct_changes[-1]

        if std == 0:
            return {"score": 0, "pct_change": round(latest, 2), "z_score": 0}

        z_score = abs((latest - mean) / std)
        score   = min(100, (z_score / 5.0) * 100)

        return {
            "score":      round(score, 1),
            "pct_change": round(latest, 2),
            "z_score":    round(z_score, 2),
        }

    finally:
        session.close()


def detect_volume_anomaly(symbol: str, lookback: int = 20) -> dict:
    """Detect unusual volume spike"""
    session = get_session()
    try:
        prices = session.query(StockPrice).filter_by(
            symbol=symbol
        ).order_by(StockPrice.timestamp.desc()).limit(lookback).all()

        if len(prices) < 3:
            return {"score": 0, "volume_ratio": 1.0}

        volumes = [p.volume for p in prices]
        current = volumes[0]
        avg_vol = np.mean(volumes[1:])

        if avg_vol == 0:
            return {"score": 0, "volume_ratio": 1.0}

        ratio = current / avg_vol
        score = min(100, max(0, (ratio - 1) / 4 * 100))

        return {
            "score":        round(score, 1),
            "volume_ratio": round(ratio, 2),
            "current_vol":  int(current),
            "avg_vol":      int(avg_vol),
        }

    finally:
        session.close()


def detect_news_pump(symbol: str, hours: int = 24) -> dict:
    """Detect pump language in recent news"""
    session = get_session()
    try:
        cutoff   = datetime.utcnow() - timedelta(hours=hours)
        articles = session.query(NewsArticle).filter(
            NewsArticle.symbol == symbol,
            NewsArticle.published_at >= cutoff
        ).all()

        if not articles:
            return {"score": 0, "article_count": 0, "avg_pump_score": 0}

        avg_pump = sum(a.pump_score for a in articles) / len(articles)
        score    = min(100, avg_pump)

        return {
            "score":          round(score, 1),
            "article_count":  len(articles),
            "avg_pump_score": round(avg_pump, 1),
        }

    finally:
        session.close()


def get_risk_level(score: float) -> str:
    """Convert score to risk level"""
    for level, (low, high) in THRESHOLDS.items():
        if low <= score < high:
            return level
    return "CRITICAL"


def compute_risk_score(symbol: str) -> dict:
    """
    Compute comprehensive manipulation risk score for a stock.
    Combines price anomaly, volume anomaly, sentiment and pump language.
    """
    print(f"Computing risk score for {symbol}...")

    # Get all component scores
    price_data   = detect_price_anomaly(symbol)
    volume_data  = detect_volume_anomaly(symbol)
    sentiment    = get_stock_sentiment(symbol)
    pump_data    = detect_news_pump(symbol)

   
    sentiment_score = 0
    if sentiment["avg_sentiment"] > 0.5:
        sentiment_score = 80
    elif sentiment["avg_sentiment"] > 0.3:
        sentiment_score = 50
    elif sentiment["avg_sentiment"] > 0.1:
        sentiment_score = 20
    else:
        sentiment_score = 0

  
    total = (
        price_data["score"]  * WEIGHTS["price_anomaly"]  +
        volume_data["score"] * WEIGHTS["volume_anomaly"] +
        sentiment_score      * WEIGHTS["news_sentiment"] +
        pump_data["score"]   * WEIGHTS["pump_language"]
    )

    total      = round(min(100, total), 1)
    risk_level = get_risk_level(total)

    result = {
        "symbol":     symbol,
        "risk_score": total,
        "risk_level": risk_level,
        "components": {
            "price_anomaly":  price_data,
            "volume_anomaly": volume_data,
            "sentiment":      sentiment,
            "pump_language":  pump_data,
        }
    }

    print(f"  Score: {total} | Level: {risk_level}")
    return result


def scan_all_stocks() -> list:
    """Compute risk scores for all active stocks"""
    session = get_session()
    try:
        stocks = session.query(Stock).filter_by(is_active=True).all()
    finally:
        session.close()

    results = []
    for stock in stocks:
        try:
            risk = compute_risk_score(stock.symbol)
            results.append(risk)

            # Save alert if HIGH or CRITICAL
            if risk["risk_level"] in ("HIGH", "CRITICAL"):
                save_alert(risk)

        except Exception as e:
            print(f"❌ Error scanning {stock.symbol}: {e}")

    results.sort(key=lambda x: x["risk_score"], reverse=True)
    return results


def save_alert(risk_data: dict):
    """Save a manipulation alert to database"""
    session = get_session()
    try:
        
        cutoff = datetime.utcnow() - timedelta(hours=1)
        existing = session.query(Alert).filter(
            Alert.symbol     == risk_data["symbol"],
            Alert.created_at >= cutoff
        ).first()

        if existing:
            return

        alert = Alert(
            symbol      = risk_data["symbol"],
            risk_score  = risk_data["risk_score"],
            risk_level  = risk_data["risk_level"],
            pattern     = "anomaly_detected",
            description = (
                f"Price anomaly: {risk_data['components']['price_anomaly']['score']:.0f}/100 | "
                f"Volume anomaly: {risk_data['components']['volume_anomaly']['score']:.0f}/100 | "
                f"Pump language: {risk_data['components']['pump_language']['score']:.0f}/100"
            ),
        )
        session.add(alert)
        session.commit()
        print(f"Alert saved for {risk_data['symbol']} — {risk_data['risk_level']}")

    except Exception as e:
        session.rollback()
        print(f" Error saving alert: {e}")
    finally:
        session.close()


if __name__ == "__main__":
    print(" Scanning all stocks for manipulation...\n")
    results = scan_all_stocks()

    print(f"\n{'Symbol':<20} {'Score':>6} {'Level'}")
    print("-" * 40)
    for r in results:
>>>>>>> a87d154 (Fix search, dashboard, scheduler and news integration)
        print(f"{r['symbol']:<20} {r['risk_score']:>6.1f} {r['risk_level']}")