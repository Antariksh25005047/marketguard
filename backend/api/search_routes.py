from fastapi import APIRouter
# import yfinance as yf
import requests

router = APIRouter(prefix="/api/search", tags=["Search"])


@router.get("/")
def search_stocks(q: str):
    print("NEW SEARCH ROUTE")
    try:
        url = "https://query1.finance.yahoo.com/v1/finance/search"

        response = requests.get(
            url,
            params={
                "q": q,
                "quotesCount": 10,
                "newsCount": 0
            },
            timeout=10
        )

        response.raise_for_status()
        print("STATUS:", response.status_code)
        print(response.json())

        data = response.json()

        stocks = []

        for item in data.get("quotes", []):

            if item.get("quoteType") != "EQUITY":
                continue

            stocks.append({
                "symbol": item.get("symbol"),
                "name": item.get("shortname") or item.get("longname"),
                "exchange": item.get("exchange")
            })
            print(stocks)

        return {"results": stocks}

    except Exception as e:
        return {
            "results": [],
            "error": str(e)
        }