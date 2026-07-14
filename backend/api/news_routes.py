from fastapi import APIRouter , HTTPException
from datetime import datetime, timezone
from backend.core.models import get_session, NewsArticle
from ml_and_db.scrapers.news_scrapers import fetch_rss_news
from ml_and_db.scrapers.social_scraper import fetch_all_stock_news


router = APIRouter(prefix="/api/news", tags=["news"])


def save_articles(articles: list):
    """Save news articles to DB, skip duplicates"""
    session = get_session()
    saved = 0
    try:
        for a in articles:
         if a.get("symbol") == "AAPL":
             print(a)
        for a in articles:
            url = a.get("url", "")
            if not url:
                continue
            existing = session.query(NewsArticle).filter_by(url=url).first()
            if existing:
                continue

            raw_symbols = a.get("symbols", [])
            if not raw_symbols:
                raw_symbols = [a.get("symbol", "")]
            raw_symbols = [s for s in raw_symbols if s]

            for sym in raw_symbols:
                record = NewsArticle(
                    symbol       = sym,
                    title        = a.get("title", "")[:500],
                    url          = url,
                    source       = a.get("source", ""),
                    pump_score   = a.get("pump_score", 0),
                    published_at = a.get("published") or datetime.now(timezone.utc),
                )
                session.add(record)
                saved += 1
        session.commit()
        return saved
    except Exception as e:
        session.rollback()
        print(f"Error saving articles: {e}")
        return 0
    finally:
        session.close()


@router.get("/")
def get_news(symbol: str = None, limit: int = 50):
    """Get latest news articles, optionally filtered by symbol"""
    session = get_session()
    try:
        query = session.query(NewsArticle).order_by(
            NewsArticle.published_at.desc()
        )
        if symbol:
            query = query.filter(NewsArticle.symbol == symbol)

        articles = query.limit(limit).all()
        return {
            "articles": [
                {
                    "id":          a.id,
                    "symbol":      a.symbol,
                    "title":       a.title,
                    "url":         a.url,
                    "source":      a.source,
                    "pump_score":  a.pump_score,
                    "published_at": a.published_at.isoformat() if a.published_at else None,
                }
                for a in articles
            ],
            "count": len(articles)
        }
    finally:
        session.close()

@router.get("/market")
def get_market_news():
    session = get_session()
    try:
        articles = (
            session.query(NewsArticle)
            .order_by(NewsArticle.published_at.desc())
            .limit(20)
            .all()
        )

        return {
            "articles": [
                {
                    "id": a.id,
                    "title": a.title,
                    "url": a.url,
                    "source": a.source,
                    "publishedAt": a.published_at.isoformat() if a.published_at else None,
                    "image": None,
                    "description": "",
                }
                for a in articles
            ]
        }

    finally:
        session.close()


@router.get("/refresh")
def refresh_news():
    """Fetch latest news from all sources and save to DB"""
    all_articles = []

    # RSS feeds
    try:
        rss = fetch_rss_news()
        all_articles.extend(rss)
    except Exception as e:
        print(f"RSS error: {e}")

    # Google News
    try:
        google = fetch_all_stock_news()
        all_articles.extend(google)
    except Exception as e:
        print(f"Google News error: {e}")

    saved = save_articles(all_articles)
    return {
        "fetched": len(all_articles),
        "saved":   saved,
        "message": f"Saved {saved} new articles to database"
    }


@router.get("/alerts")
def get_pump_alerts(min_score: int = 25):
    """Get articles with high pump language score"""
    session = get_session()
    try:
        
        articles = session.query(NewsArticle).filter(
            NewsArticle.pump_score >= min_score
        ).order_by(NewsArticle.pump_score.desc()).limit(20).all()

        return {
            "alerts": [
                {
                    "symbol":     a.symbol,
                    "title":      a.title,
                    "url":        a.url,
                    "pump_score": a.pump_score,
                    "published_at": a.published_at.isoformat() if a.published_at else None,
                }
                for a in articles
            ],
            "count": len(articles)
        }
    finally:
        session.close()
