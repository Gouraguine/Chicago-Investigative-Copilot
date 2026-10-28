from fastapi import APIRouter

from app.database import get_connection


router = APIRouter(
    prefix="/summary",
    tags=["Summary"]
)


@router.get("")
def get_summary():

    conn = get_connection()

    try:

        rows = conn.execute(
            """
            SELECT metric, value
            FROM crime_summary
            """
        ).fetchall()

        return {
            row["metric"]: row["value"]
            for row in rows
        }

    finally:
        conn.close()