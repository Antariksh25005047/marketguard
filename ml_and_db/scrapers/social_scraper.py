import feedparser
import requests
from datetime import datetime, timezone

STOCKS = [
    # 🇺🇸 US Stocks
    {"symbol": "AAPL", "keyword": "Apple stock"},
    {"symbol": "TSLA", "keyword": "Tesla stock"},
    {"symbol": "NVDA", "keyword": "NVIDIA stock"},
    {"symbol": "MSFT", "keyword": "Microsoft stock"},
    {"symbol": "GOOGL", "keyword": "Google stock"},
    {"symbol": "META", "keyword": "Meta stock"},
    {"symbol": "AMZN", "keyword": "Amazon stock"},

    # 🇮🇳 Indian Stocks
    {"symbol": "RELIANCE.NS", "keyword": "Reliance Industries stock"},
    {"symbol": "TCS.NS", "keyword": "TCS stock NSE"},
    {"symbol": "SUZLON.NS", "keyword": "Suzlon Energy stock"},
    {"symbol": "RPOWER.NS", "keyword": "Reliance Power stock"},
    {"symbol": "YESBANK.NS", "keyword": "Yes Bank stock"},
    {"symbol": "ETERNAL.NS", "keyword": "Zomato stock NSE"},
    {"symbol": "ADANIENT.NS", "keyword": "Adani Enterprises stock"},
    {"symbol": "TMCV.NS", "keyword": "Tata Motors stock"},
    {"symbol": "IRFC.NS", "keyword": "IRFC stock NSE"},
    {"symbol": "HDFCBANK.NS", "keyword": "HDFC Bank stock"},
]

PUMP_WORDS = [
    "multibagger", "guaranteed", "sure shot", "must buy",
    "target 100", "rocket", "moon", "10x", "hidden gem",
    "breakout", "urgent buy", "operator", "upper circuit"
]


def detect_pump_language(text: str) -> dict:
    text_lower = text.lower()
    found = [w for w in PUMP_WORDS if w in text_lower]
    score = min(100, len(found) * 25)
    return {"score": score, "keywords": found}


def fetch_google_news(keyword: str) -> list:
    """Fetch news from Google News RSS for a keyword"""
    url = f"https://news.google.com/rss/search?q={keyword.replace(' ', '+')}&hl=en-IN&gl=IN&ceid=IN:en"
    try:
        feed = feedparser.parse(url)
        return feed.entries[:10]
    except Exception as e:
        print(f"  Error fetching {keyword}: {e}")
        return []


def fetch_all_stock_news() -> list:
    """Fetch Google News for all tracked stocks"""
    all_articles = []

    for stock in STOCKS:
        print(f"Searching news for {stock['keyword']}...")
        entries = fetch_google_news(stock["keyword"])

        for entry in entries:
            title = entry.get("title", "")
            url   = entry.get("link", "")
            pub   = entry.get("published_parsed")

            if not title:
                continue

            pump = detect_pump_language(title)

            if pub:
                pub_time = datetime(*pub[:6], tzinfo=timezone.utc)
            else:
                pub_time = datetime.now(timezone.utc)

            all_articles.append({
                "symbol":        stock["symbol"],
                "title":         title[:300],
                "url":           url,
                "published":     pub_time,
                "pump_score":    pump["score"],
                "pump_keywords": pump["keywords"],
                "source":        "Google News",
            })

        print(f"   {len(entries)} articles found")

    return all_articles


if __name__ == "__main__":
    print("🔍 Fetching Google News for tracked stocks...\n")
    articles = fetch_all_stock_news()

    print(f"\n Total articles: {len(articles)}")

    # Show pump language alerts
    pumps = [a for a in articles if a["pump_score"] > 0]
    if pumps:
        print(f"\n🚨 {len(pumps)} articles with suspicious language:")
        for a in pumps:
            print(f"  {a['symbol']}: {a['title'][:70]}")
            print(f"  Keywords: {a['pump_keywords']}")
    else:
        print("\n No pump language detected")

    # Show latest articles
    print("\n📰 Latest articles:")
    for a in articles[:5]:
        print(f"  [{a['symbol']}] {a['title'][:70]}")