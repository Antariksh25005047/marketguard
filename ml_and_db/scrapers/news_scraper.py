import feedparser
import requests
from datetime import datetime, timezone
from bs4 import BeautifulSoup


RSS_FEEDS=[
    {"name": "Economic Times Markets", "url": "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms"},
    {"name": "Moneycontrol",           "url": "https://www.moneycontrol.com/rss/marketreports.xml"},
    {"name": "Business Standard",      "url": "https://www.business-standard.com/rss/markets-106.rss"},
]


KEYWORDS = [
    "Reliance", "TCS", "HDFC", "Suzlon", "Zomato",
    "Adani", "Yes Bank", "IRFC", "Tata Motors", "RPOWER",
    "NSE", "BSE", "SEBI", "stock", "shares", "market"
]


PUMP_WORDS = [
     "guaranteed returns", "sure shot", "multibagger",
    "100x", "must buy", "urgent buy", "hidden gem",
    "breakout", "rocket", "moon", "10x"
]

def extract_symbols(text: str) -> list:
    """Find which stocks are mentioned in the text"""
    found = []
    text_upper = text.upper()
    symbol_map = {
        "RELIANCE": "RELIANCE.NS",
        "TCS": "TCS.NS",
        "HDFC": "HDFCBANK.NS",
        "SUZLON": "SUZLON.NS",
        "ZOMATO": "543320.BO",
        "ADANI": "ADANIENT.NS",
        "YES BANK": "YESBANK.NS",
        "IRFC": "IRFC.NS",
        "TATA MOTORS": "TATAMOTOR.NS",
        "RPOWER": "RPOWER.NS",
    }
    for keyword, symbol in symbol_map.items():
        if keyword in text_upper:
            found.append(symbol)
    return list(set(found))


def detect_pump_language(text: str) -> dict:
    """Check if article contains pump and dump language"""
    text_lower = text.lower()
    found = [w for w in PUMP_WORDS if w in text_lower]
    score = min(100, len(found) * 25)
    return {"score": score, "keywords": found}


def fetch_rss_news() -> list:
    """Fetch news from all RSS feeds"""
    articles = []

    for feed_info in RSS_FEEDS:
        print(f"Fetching {feed_info['name']}...")
        try:
            feed = feedparser.parse(feed_info["url"])

            for entry in feed.entries[:20]:
                title = entry.get("title", "")
                desc  = entry.get("summary", "")
                url   = entry.get("link", "")
                pub   = entry.get("published_parsed")

                if not title:
                    continue

                full_text = f"{title} {desc}"
                symbols   = extract_symbols(full_text)
                pump      = detect_pump_language(full_text)

                # Parse publish time
                if pub:
                    pub_time = datetime(*pub[:6], tzinfo=timezone.utc)
                else:
                    pub_time = datetime.now(timezone.utc)

                articles.append({
                    "source":    feed_info["name"],
                    "title":     title[:300],
                    "desc":      desc[:500],
                    "url":       url,
                    "symbols":   symbols,
                    "pump_score": pump["score"],
                    "pump_keywords": pump["keywords"],
                    "published": pub_time,
                })

            print(f"  {len(feed.entries)} articles fetched")

        except Exception as e:
            print(f"   Error: {e}")

    return articles


if __name__ == "__main__":
    print(" Fetching financial news...\n")
    articles = fetch_rss_news()

    print(f"\n Total articles: {len(articles)}")

    # Show relevant articles only
    relevant = [a for a in articles if a["symbols"]]
    print(f" Relevant to tracked stocks: {len(relevant)}\n")

    for a in relevant[:5]:
        print(f"Source:  {a['source']}")
        print(f"Title:   {a['title'][:80]}")
        print(f"Stocks:  {a['symbols']}")
        if a['pump_score'] > 0:
            print(f"  Pump score: {a['pump_score']} — keywords: {a['pump_keywords']}")
        print()
