from fastapi import APIRouter

from app.database import get_connection


router = APIRouter(
    prefix="/forecasts",
    tags=["Forecasts"]
)


@router.get("/crime-types")
def get_crime_type_forecast():

    conn = get_connection()

    try:

        rows = conn.execute(
            """
            SELECT
                rank,
                week,
                primary_type,
                predicted_crimes

            FROM crime_type_forecast

            ORDER BY rank
            """
        ).fetchall()

        return [
            dict(row)
            for row in rows
        ]

    finally:
        conn.close()