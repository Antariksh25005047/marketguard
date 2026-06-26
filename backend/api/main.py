from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.models import init_db
from backend.api.auth_routes import router as auth_router
app=FastAPI(title="MarketGuard AI", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"], 
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)
app.include_router(auth_router)
@app.on_event("startup")
def startup():
    init_db()
    print("MarketGuard AI started")
@app.get("/api/health")
def health():
    return {"status": "ok", "message": "MarketGuard AI is running"}
if __name__ ==  "__main__":
    import uvicorn
    uvicorn.run("backend.api.main:app", host="0.0.0.0", port=8000, reload=True)
