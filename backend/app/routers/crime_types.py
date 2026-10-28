from fastapi import APIRouter, Query

from app.database import get_connection
from app.schemas.crime_type import CrimeTypeResponse


router = APIRouter(
    prefix="/crime-types",
    tags=["Crime Types"]
)


@router.get(
    "",
    response_model=list[CrimeTypeResponse]
)
def get_crime_types(
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
                primary_type,
                crime_count,
                arrests,
                percentage

            FROM crime_types

            ORDER BY crime_count DESC

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