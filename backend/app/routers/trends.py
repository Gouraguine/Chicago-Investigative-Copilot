from fastapi import APIRouter

from app.database import get_connection
from app.schemas.trend import MonthlyCrimeResponse


router = APIRouter(
    prefix="/trends",
    tags=["Trends"]
)


@router.get(
    "/monthly",
    response_model=list[MonthlyCrimeResponse]
)
def get_monthly_crimes():

    conn = get_connection()

    try:

        rows = conn.execute(
            """
            SELECT
                year_month,
                crime_count

            FROM monthly_crimes

            ORDER BY year_month
            """
        ).fetchall()

        return [
            dict(row)
            for row in rows
        ]

    finally:
        conn.close()