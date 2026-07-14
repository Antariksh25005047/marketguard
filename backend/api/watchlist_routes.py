from fastapi import APIRouter, HTTPException
from backend.core.models import get_session, Watchlist
from ml_and_db.scrapers.stock_scraper import fetch_stock_details

router = APIRouter(prefix="/api/watchlist", tags=["Watchlist"])


@router.post("/add")
def add_to_watchlist(user_id: int, symbol: str):
    session = get_session()

    existing = session.query(Watchlist).filter_by(
        user_id=user_id,
        stock_symbol=symbol
    ).first()

    if existing:
        session.close()
        return {"message": "Stock already in watchlist"}

    item = Watchlist(
        user_id=user_id,
        stock_symbol=symbol
    )

    session.add(item)
    session.commit()
    session.close()

    return {"message": "Stock added successfully"}


@router.get("/{user_id}")
def get_watchlist(user_id: int):
    session = get_session()

    items = session.query(Watchlist).filter_by(
        user_id=user_id
    ).all()

    session.close()

    # return {
    #     "watchlist": [
    #         {
    #             "symbol": item.stock_symbol
    #         }
    #         for item in items
    #     ]
    # }

    watchlist_data = []


    for item in items:
        stock = fetch_stock_details(item.stock_symbol)
        print(stock)


        if stock:
            watchlist_data.append({
    "symbol": stock["symbol"],
    "companyName": stock["companyName"],
    "price": stock["price"],
    "previousClose": stock["previousClose"],
    "marketCap": stock["marketCap"],
    "volume": stock["volume"],

    "changePct": round(
        ((stock["price"] - stock["previousClose"])
        / stock["previousClose"]) * 100,
        2
    ),

    "recommendation": "HOLD",

    "news": [
        {
            "headline": stock["spikeAnalysis"]["headline"],
            "source": stock["spikeAnalysis"]["source"],
            "url": stock["spikeAnalysis"]["url"],
            "time": "Latest"
        }
    ]
})

    return {
            "watchlist": watchlist_data

    }

@router.delete("/remove")
def remove_from_watchlist(user_id: int, symbol: str):
    session = get_session()

    item = session.query(Watchlist).filter_by(
        user_id=user_id,
        stock_symbol=symbol
    ).first()

    if not item:
        session.close()
        raise HTTPException(status_code=404, detail="Stock not found")

    session.delete(item)
    session.commit()
    session.close()

    return {"message": "Stock removed successfully"}