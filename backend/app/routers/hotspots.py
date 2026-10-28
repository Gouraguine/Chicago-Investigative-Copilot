from fastapi import APIRouter, Query

from app.database import get_connection


router = APIRouter(
    prefix="/hotspots",
    tags=["Hotspots"]
)


@router.get("")
def get_hotspots(
    limit: int = Query(
        default=20,
        ge=1,
        le=100
    )
):

    conn = get_connection()

    try:

        rows = conn.execute(
            """
            SELECT
                hotspot_rank,
                week,
                grid_id,
                grid_lat,
                grid_lon,
                predicted_crimes,
                risk_level

            FROM future_hotspots

            ORDER BY hotspot_rank

            LIMIT ?
            """,
            (limit,)
        ).fetchall()

        return [
            dict(row)
            for row in rows
        ]

    finally:
        conn.close()