
from textblob import TextBlob
from datetime import datetime, timedelta


PUMP_WORDS = [
    "multibagger", "guaranteed", "sure shot", "must buy",
    "rocket", "moon", "10x", "hidden gem", "breakout",
    "urgent buy", "operator", "upper circuit", "target 100",
    "buy now", "massive upside", "explosive"
]


BEAR_WORDS = [
    "fraud", "scam", "manipulation", "investigation",
    "sebi notice", "ban", "delisted", "bankrupt",
    "loss", "decline", "crash", "sell off"
]


def analyze_sentiment(text: str) -> dict:
    """
    Analyze sentiment of a single text.
    Returns score between -1 (negative) and +1 (positive)
    """
    if not text or len(text.strip()) < 5:
        return {"score": 0.0, "label": "neutral", "confidence": 0.0}

    try:
        blob  = TextBlob(text)
        score = blob.sentiment.polarity  # -1 to +1

        # Adjust score for pump/bear words
        text_lower = text.lower()
        pump_found = [w for w in PUMP_WORDS if w in text_lower]
        bear_found = [w for w in BEAR_WORDS if w in text_lower]

        # Pump words push score up
        score += len(pump_found) * 0.1

        # Bear words push score down
        score -= len(bear_found) * 0.1

        # Clamp between -1 and 1
        score = max(-1.0, min(1.0, score))
        score = round(score, 3)

        if score > 0.05:
            label = "positive"
        elif score < -0.05:
            label = "negative"
        else:
            label = "neutral"

        return {
            "score":        score,
            "label":        label,
            "confidence":   abs(score),
            "pump_words":   pump_found,
            "bear_words":   bear_found,
        }

    except Exception as e:
        print(f"Sentiment error: {e}")
        return {"score": 0.0, "label": "neutral", "confidence": 0.0}


def analyze_batch(texts: list) -> list:
    """Analyze sentiment for a list of texts"""
    return [analyze_sentiment(t) for t in texts]


def get_stock_sentiment(symbol: str, hours: int = 24) -> dict:
    """
    Get aggregated sentiment for a stock
    from news articles in the database
    """
    from backend.core.models import get_session, NewsArticle

    session = get_session()
    try:
        cutoff = datetime.utcnow() - timedelta(hours=hours)
        articles = session.query(NewsArticle).filter(
            NewsArticle.symbol == symbol,
            NewsArticle.published_at >= cutoff
        ).all()

        if not articles:
            return {
                "symbol":        symbol,
                "article_count": 0,
                "avg_sentiment": 0.0,
                "label":         "neutral",
                "positive_count": 0,
                "negative_count": 0,
                "neutral_count":  0,
            }

       
        scores  = []
        pos     = 0
        neg     = 0
        neutral = 0

        for article in articles:
            result = analyze_sentiment(article.title)
            scores.append(result["score"])

            if result["label"] == "positive":
                pos += 1
            elif result["label"] == "negative":
                neg += 1
            else:
                neutral += 1

        avg = round(sum(scores) / len(scores), 3)

        if avg > 0.05:
            label = "positive"
        elif avg < -0.05:
            label = "negative"
        else:
            label = "neutral"

        return {
            "symbol":         symbol,
            "article_count":  len(articles),
            "avg_sentiment":  avg,
            "label":          label,
            "positive_count": pos,
            "negative_count": neg,
            "neutral_count":  neutral,
        }

    finally:
        session.close()


if __name__ == "__main__":
    print(" Testing sentiment analysis...\n")

    tests = [
        "SUZLON is going to MOON! Buy now, guaranteed 10x returns!",
        "Reliance quarterly results disappoint, stock down 5%",
        "HDFC Bank maintains stable outlook, good fundamentals",
        "SEBI investigation into Yes Bank trading manipulation",
    ]

    for text in tests:
        result = analyze_sentiment(text)
        print(f"Text:  {text[:60]}...")
        print(f"Score: {result['score']} | Label: {result['label']}")
        if result.get('pump_words'):
            print(f"Pump words: {result['pump_words']}")
from textblob import TextBlob
from datetime import datetime, timedelta


PUMP_WORDS = [
    "multibagger", "guaranteed", "sure shot", "must buy",
    "rocket", "moon", "10x", "hidden gem", "breakout",
    "urgent buy", "operator", "upper circuit", "target 100",
    "buy now", "massive upside", "explosive"
]


BEAR_WORDS = [
    "fraud", "scam", "manipulation", "investigation",
    "sebi notice", "ban", "delisted", "bankrupt",
    "loss", "decline", "crash", "sell off"
]


def analyze_sentiment(text: str) -> dict:
    """
    Analyze sentiment of a single text.
    Returns score between -1 (negative) and +1 (positive)
    """
    if not text or len(text.strip()) < 5:
        return {"score": 0.0, "label": "neutral", "confidence": 0.0}

    try:
        blob  = TextBlob(text)
        score = blob.sentiment.polarity  # -1 to +1

        # Adjust score for pump/bear words
        text_lower = text.lower()
        pump_found = [w for w in PUMP_WORDS if w in text_lower]
        bear_found = [w for w in BEAR_WORDS if w in text_lower]

        # Pump words push score up
        score += len(pump_found) * 0.1

        # Bear words push score down
        score -= len(bear_found) * 0.1

        # Clamp between -1 and 1
        score = max(-1.0, min(1.0, score))
        score = round(score, 3)

        if score > 0.05:
            label = "positive"
        elif score < -0.05:
            label = "negative"
        else:
            label = "neutral"

        return {
            "score":        score,
            "label":        label,
            "confidence":   abs(score),
            "pump_words":   pump_found,
            "bear_words":   bear_found,
        }

    except Exception as e:
        print(f"Sentiment error: {e}")
        return {"score": 0.0, "label": "neutral", "confidence": 0.0}


def analyze_batch(texts: list) -> list:
    """Analyze sentiment for a list of texts"""
    return [analyze_sentiment(t) for t in texts]


def get_stock_sentiment(symbol: str, hours: int = 24) -> dict:
    """
    Get aggregated sentiment for a stock
    from news articles in the database
    """
    from backend.core.models import get_session, NewsArticle

    session = get_session()
    try:
        cutoff = datetime.utcnow() - timedelta(hours=hours)
        articles = session.query(NewsArticle).filter(
            NewsArticle.symbol == symbol,
            NewsArticle.published_at >= cutoff
        ).all()

        if not articles:
            return {
                "symbol":        symbol,
                "article_count": 0,
                "avg_sentiment": 0.0,
                "label":         "neutral",
                "positive_count": 0,
                "negative_count": 0,
                "neutral_count":  0,
            }

       
        scores  = []
        pos     = 0
        neg     = 0
        neutral = 0

        for article in articles:
            result = analyze_sentiment(article.title)
            scores.append(result["score"])

            if result["label"] == "positive":
                pos += 1
            elif result["label"] == "negative":
                neg += 1
            else:
                neutral += 1

        avg = round(sum(scores) / len(scores), 3)

        if avg > 0.05:
            label = "positive"
        elif avg < -0.05:
            label = "negative"
        else:
            label = "neutral"

        return {
            "symbol":         symbol,
            "article_count":  len(articles),
            "avg_sentiment":  avg,
            "label":          label,
            "positive_count": pos,
            "negative_count": neg,
            "neutral_count":  neutral,
        }

    finally:
        session.close()


if __name__ == "__main__":
    print(" Testing sentiment analysis...\n")

    tests = [
        "SUZLON is going to MOON! Buy now, guaranteed 10x returns!",
        "Reliance quarterly results disappoint, stock down 5%",
        "HDFC Bank maintains stable outlook, good fundamentals",
        "SEBI investigation into Yes Bank trading manipulation",
    ]

    for text in tests:
        result = analyze_sentiment(text)
        print(f"Text:  {text[:60]}...")
        print(f"Score: {result['score']} | Label: {result['label']}")
        if result.get('pump_words'):
            print(f"Pump words: {result['pump_words']}")
        print()