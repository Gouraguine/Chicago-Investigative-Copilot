from fastapi import APIRouter, Query

from app.database import get_connection


router = APIRouter(
    prefix="/risk",
    tags=["Risk"]
)



@router.get("/areas")
def get_area_risk(
    level: str | None = Query(default=None)
):

    conn = get_connection()

    try:

        if level:

            level = level.upper()

            rows = conn.execute(
                """
                SELECT
                    week,
                    grid_id,
                    grid_lat,
                    grid_lon,
                    predicted_crimes,
                    risk_level,
                    risk_rank
                FROM area_risk
                WHERE risk_level = ?
                ORDER BY predicted_crimes DESC
                """,
                (level,)
            ).fetchall()

        else:

            rows = conn.execute(
                """
                SELECT
                    week,
                    grid_id,
                    grid_lat,
                    grid_lon,
                    predicted_crimes,
                    risk_level,
                    risk_rank
                FROM area_risk
                ORDER BY predicted_crimes DESC
                """
            ).fetchall()

        return [
            dict(row)
            for row in rows
        ]

    finally:
        conn.close()
@router.get("/areas/top")
def get_top_risk_areas(
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
                week,
                grid_id,
                grid_lat,
                grid_lon,
                predicted_crimes,
                risk_level,
                risk_rank

            FROM area_risk

            ORDER BY predicted_crimes DESC

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
@router.get("/distribution")
def get_risk_distribution():

    conn = get_connection()

    try:
        rows = conn.execute(
            """
            SELECT
                risk_level,
                COUNT(*) AS area_count
            FROM area_risk
            GROUP BY risk_level
            ORDER BY
                CASE risk_level
                    WHEN 'HIGH' THEN 1
                    WHEN 'MEDIUM' THEN 2
                    WHEN 'LOW' THEN 3
                    ELSE 4
                END
            """
        ).fetchall()

        return [
            dict(row)
            for row in rows
        ]

    finally:
        conn.close()