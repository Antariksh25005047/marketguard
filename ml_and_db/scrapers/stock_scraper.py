import yfinance as yf
import pandas as pd
from datetime import datetime

import feedparser
from bs4 import BeautifulSoup
from urllib.parse import quote


STOCKS= [
    {"symbol": "RELIANCE.NS", "name": "Reliance Industries"},
    {"symbol": "TCS.NS", "name": "Tata Consultancy"},
    {"symbol": "HDFCBANK.NS", "name": "HDFC Bank"},
    {"symbol": "SUZLON.NS", "name": "Suzlon Energy"},
    {"symbol": "RPOWER.NS", "name": "Reliance Power"},
    {"symbol": "YESBANK.NS", "name": "Yes Bank"},
    {"symbol": "ETERNAL.NS",    "name": "Zomato"},
    {"symbol": "ADANIENT.NS", "name": "Adani Enterprises"},
    {"symbol": "TATAMOTORS.NS", "name": "Tata Motors"},
    {"symbol": "IRFC.NS", "name": "IRFC"},
]

def fetch_current_price(symbol: str)-> dict:
    try:
        ticker = yf.Ticker(symbol)
        hist=ticker.history(period="1d", interval="1m")
        if hist.empty:
            print(f"No data for {symbol}")
            return None
        latest= hist.iloc[-1]
        return {
            "symbol": symbol,
            "timestamp": hist.index[-1].to_pydatetime(),
            "open": float(latest["Open"]),
            "high": float(latest["High"]),
            "low": float(latest["Low"]),
            "close": float(latest["Close"]),
            "volume": float(latest["Volume"])
        }
    except Exception as e:
        print(f"Error fetching {symbol}: {e}")
        return None


def fetch_all_stocks()-> list:
    results = []
    for stock in STOCKS:
        print(f"Fetching {stock['name']}...")
        data = fetch_current_price(stock['symbol'])
        if data:
            results.append(data)
            print(f"  {data['close']:.2f} | Vol: {data['volume']:,.0f}")
    return results

def fetch_stock_details(symbol: str):
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info


        current_price = info.get("currentPrice")
        previous_close = info.get("previousClose")

        if current_price and previous_close:
            change = round(
                ((current_price - previous_close) / previous_close) * 100,
                2
            )
        else:
            change = 0

        volume = info.get("volume")
        avg_volume = info.get("averageVolume")

        # news = fetch_stock_news(info.get("longName", symbol))

        news = fetch_stock_news(info.get("longName", symbol))
        
        analysis = generate_spike_reason(
            change,
            volume,
            avg_volume,
            news["reason"]
        )

        return {
            "symbol": symbol,
            "companyName": info.get("longName"),
            "price": info.get("currentPrice"),
            "currency": info.get("currency"),      # <-- ADD THIS
            "previousClose": info.get("previousClose"),
            "marketCap": info.get("marketCap"),
            "volume": info.get("volume"),
            "high52w": info.get("fiftyTwoWeekHigh"),
            "low52w": info.get("fiftyTwoWeekLow"),
            "peRatio": info.get("trailingPE"),
            "eps": info.get("trailingEps"),
            "beta": info.get("beta"),
            "spikeAnalysis": {
                "direction": "High Spike" if change > 0 else "High Dip",
                "confidence": analysis["confidence"],
                "reasons": analysis["reasons"],
                "headline": news["reason"],
                "source": news["source"],
                "url": news["url"],
                },
            }

    except Exception as e:
        print(f"Error fetching stock details: {e}")
        return None
    
def fetch_stock_history(symbol: str, period="6mo"):
    try:
        ticker = yf.Ticker(symbol)


        INTERVAL_MAP = {
            "1d": "5m",
            "5d": "30m",
            "1mo": "1d",
            "6mo": "1d",
            "1y": "1d",
            "5y": "1wk",
        }

        interval = INTERVAL_MAP.get(period, "1d")

        hist = ticker.history(
            period=period,
            interval=interval
        )

        if hist.empty:
            return None
        
        hist = hist.dropna()

        history = []

        for date, row in hist.iterrows():

            if pd.isna(row["Open"]) or pd.isna(row["Close"]):
               continue

            history.append({
                "date": date.isoformat(),
                "open": float(row["Open"]),
                "high": float(row["High"]),
                "low": float(row["Low"]),
                "close": float(row["Close"]),
                "volume": int(row["Volume"]),
            })

        return history

    except Exception as e:
        print(f"Error fetching stock history: {e}")
        return None
    
import requests
import os
from dotenv import load_dotenv

load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")


def fetch_stock_news(company_name):
    try:
        query = quote(company_name)

        url = (
            f"https://news.google.com/rss/search?q={query}+stock&hl=en-IN&gl=IN&ceid=IN:en"
        )

        print(url)

        feed = feedparser.parse(url)

        print("Entries:", len(feed.entries))

        if feed.entries:
            article = feed.entries[0]
            print(article.title)

            title = BeautifulSoup(article.title, "html.parser").text

            return {
                "reason": title,
                "source": article.source.title if hasattr(article, "source") else "Google News",
                "url": article.link
            }

    except Exception as e:
        print(f"News Error: {e}")

    return {
        "reason": "No recent news found.",
        "source": "Google News",
        "url": ""
    }

def generate_spike_reason(change, volume, avg_volume, news_title):
    reasons = []
    confidence = 50

    title = news_title.lower()

    positive_keywords = [
        "profit", "earnings", "order", "contract",
        "approval", "acquisition", "investment",
        "buyback", "upgrade", "record", "surge"
    ]

    negative_keywords = [
        "loss", "fraud", "downgrade", "warning",
        "investigation", "penalty", "decline",
        "lawsuit", "miss", "fall", "drop"
    ]

    # News analysis
    if any(word in title for word in positive_keywords):
        reasons.append("Positive company news is driving buying interest.")
        confidence += 15

    if any(word in title for word in negative_keywords):
        reasons.append("Negative news has increased selling pressure.")
        confidence += 15

    # Price movement
    if change >= 5:
        reasons.append("Strong upward momentum detected.")
        confidence += 15
    elif change <= -5:
        reasons.append("Sharp downward momentum detected.")
        confidence += 15

    # Volume analysis
    if avg_volume and volume:
        if volume > avg_volume * 2:
            reasons.append("Trading volume is more than twice the average.")
            confidence += 20

    if not reasons:
        reasons.append("No major catalyst detected. Normal market movement.")

    confidence = min(confidence, 100)

    return {
        "reasons": reasons,
        "confidence": confidence
    }
    
def fetch_market_movers():
    movers = []

    for stock in STOCKS:
        try:
            ticker = yf.Ticker(stock["symbol"])
            info = ticker.info

            current_price = info.get("currentPrice")
            volume = info.get("volume")
            avg_volume = info.get("averageVolume")
            news = fetch_stock_news(stock["name"])
            previous_close = info.get("previousClose")

            if current_price is None or previous_close is None:
                continue

            change = round(
                ((current_price - previous_close) / previous_close) * 100,
                2
            )

            analysis = generate_spike_reason(
                change,
                volume,
                avg_volume,
                news["reason"]
            )

            movers.append({
                "symbol": stock["symbol"],
                "companyName": stock["name"],
                "price": current_price,
                "change": change,
                # "reason": [
                #     "Higher trading activity today",
                #     "Price movement detected",
                #     "Further analysis required"
                # ]

                "reason": news["reason"],
                "source": news["source"],
                "aiReasons": analysis["reasons"],
                "confidence": analysis["confidence"],   
            })

        except Exception as e:
            print(f"Error fetching {stock['symbol']}: {e}")

    gainers = sorted(
        movers,
        key=lambda x: x["change"],
        reverse=True
    )[:4]

    losers = sorted(
        movers,
        key=lambda x: x["change"]
    )[:4]

    return {
        "gainers": gainers,
        "losers": losers
    }

if __name__ == "__main__":
    print(" Fetching stock prices...\n")
    results=fetch_all_stocks()
    print(f"\n Fetched {len(results)} stocks successfully")
    