
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime

scheduler = BackgroundScheduler()


def fetch_stock_prices():
    """Fetch and save latest prices for all stocks"""
    print(f"\n [{datetime.now().strftime('%H:%M:%S')}] Fetching stock prices...")
    try:
        from ml_and_db.scrapers.stock_scraper import fetch_all_stocks
        from backend.api.stock_routes import save_price
        results = fetch_all_stocks()
        for r in results:
            save_price(r)
        print(f"   {len(results)} stock prices saved")
    except Exception as e:
        print(f" Error: {e}")


def fetch_latest_news():
    """Fetch and save latest news"""
    print(f"\n [{datetime.now().strftime('%H:%M:%S')}] Fetching news...")
    try:
        from ml_and_db.scrapers.news_scraper import fetch_rss_news
        from ml_and_db.scrapers.social_scraper import fetch_all_stock_news
        from backend.api.news_routes import save_articles
        rss     = fetch_rss_news()
        google  = fetch_all_stock_news()
        saved   = save_articles(rss) + save_articles(google)
        print(f"   {saved} new articles saved")
    except Exception as e:
        print(f"   Error: {e}")


def run_risk_scan():
    """Run anomaly detection on all stocks"""
    print(f"\n [{datetime.now().strftime('%H:%M:%S')}] Running risk scan...")
    try:
        from ml_and_db.ml.anomaly_detector import scan_all_stocks
        results = scan_all_stocks()
        high_risk = [r for r in results if r["risk_level"] in ("HIGH", "CRITICAL")]
        if high_risk:
            print(f"   {len(high_risk)} high risk stocks detected!")
            for r in high_risk:
                print(f"     {r['symbol']}: {r['risk_score']} ({r['risk_level']})")
        else:
            print(f"   No high risk stocks")
    except Exception as e:
        print(f"   Error: {e}")


def start_scheduler():
    """Start all scheduled jobs"""
    # Fetch stock prices every 60 seconds
    scheduler.add_job(
        fetch_stock_prices,
        "interval",
        seconds=60,
        id="stock_prices",
    )

    # Fetch news every 5 minutes
    scheduler.add_job(
        fetch_latest_news,
        "interval",
        minutes=5,
        id="news_fetch",
    )

    # Run risk scan every 5 minutes
    scheduler.add_job(
        run_risk_scan,
        "interval",
        minutes=5,
        id="risk_scan",
    )

    scheduler.start()
    print(" Scheduler started:")
    print("   Stock prices → every 60 seconds")
    print("   News fetch   → every 5 minutes")
    print("   Risk scan    → every 5 minutes")


def stop_scheduler():
    """Stop the scheduler"""
    scheduler.shutdown()
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime

scheduler = BackgroundScheduler()


def fetch_stock_prices():
    """Fetch and save latest prices for all stocks"""
    print(f"\n [{datetime.now().strftime('%H:%M:%S')}] Fetching stock prices...")
    try:
        from ml_and_db.scrapers.stock_scraper import fetch_all_stocks
        from backend.api.stock_routes import save_price
        results = fetch_all_stocks()
        for r in results:
            save_price(r)
        print(f"   {len(results)} stock prices saved")
    except Exception as e:
        print(f" Error: {e}")


def fetch_latest_news():
    """Fetch and save latest news"""
    print(f"\n [{datetime.now().strftime('%H:%M:%S')}] Fetching news...")
    try:
        from ml_and_db.scrapers.news_scraper import fetch_rss_news
        from ml_and_db.scrapers.social_scraper import fetch_all_stock_news
        from backend.api.news_routes import save_articles
        rss     = fetch_rss_news()
        google  = fetch_all_stock_news()
        saved   = save_articles(rss) + save_articles(google)
        print(f"   {saved} new articles saved")
    except Exception as e:
        print(f"   Error: {e}")


def run_risk_scan():
    """Run anomaly detection on all stocks"""
    print(f"\n [{datetime.now().strftime('%H:%M:%S')}] Running risk scan...")
    try:
        from ml_and_db.ml.anomaly_detector import scan_all_stocks
        results = scan_all_stocks()
        high_risk = [r for r in results if r["risk_level"] in ("HIGH", "CRITICAL")]
        if high_risk:
            print(f"   {len(high_risk)} high risk stocks detected!")
            for r in high_risk:
                print(f"     {r['symbol']}: {r['risk_score']} ({r['risk_level']})")
        else:
            print(f"   No high risk stocks")
    except Exception as e:
        print(f"   Error: {e}")


def start_scheduler():
    """Start all scheduled jobs"""
    # Fetch stock prices every 60 seconds
    scheduler.add_job(
        fetch_stock_prices,
        "interval",
        seconds=60,
        id="stock_prices",
    )

    # Fetch news every 5 minutes
    scheduler.add_job(
        fetch_latest_news,
        "interval",
        minutes=5,
        id="news_fetch",
    )

    # Run risk scan every 5 minutes
    scheduler.add_job(
        run_risk_scan,
        "interval",
        minutes=5,
        id="risk_scan",
    )

    scheduler.start()
    print(" Scheduler started:")
    print("   Stock prices → every 60 seconds")
    print("   News fetch   → every 5 minutes")
    print("   Risk scan    → every 5 minutes")


def stop_scheduler():
    """Stop the scheduler"""
    scheduler.shutdown()
    print("Scheduler stopped")