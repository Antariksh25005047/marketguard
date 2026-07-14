from fastapi import APIRouter
import yfinance as yf

router = APIRouter(prefix="/api/search", tags=["Search"])


@router.get("/")
def search_stocks(q: str):
    try:
        results = yf.Search(q).quotes

        stocks = []

        for item in results:
            stocks.append({
                "symbol": item.get("symbol"),
                "name": item.get("shortname") or item.get("longname"),
                "exchange": item.get("exchange")
            })

        return {"results": stocks}

    except Exception as e:
        return {
            "results": [],
            "error": str(e)
        }