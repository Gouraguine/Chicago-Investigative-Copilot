import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import (
    summary,
    hotspots,
    risk,
    forecasts,
    trends,
    crime_types,
    copilot
)


app = FastAPI(
    title="Crime Copilot API",
    version="1.0.0"
)

frontend_url = os.getenv(
    "FRONTEND_URL"
)


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


if frontend_url:
    origins.append(
        frontend_url.rstrip("/")
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    summary.router
)

app.include_router(
    hotspots.router
)

app.include_router(
    risk.router
)

app.include_router(
    forecasts.router
)

app.include_router(
    trends.router
)

app.include_router(
    crime_types.router
)

app.include_router(copilot.router)

@app.get("/")
def root():

    return {
        "name": "Crime Copilot API",
        "status": "online"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }