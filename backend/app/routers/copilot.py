import json

from fastapi import (
    APIRouter,
    HTTPException,
)

from pydantic import (
    BaseModel,
    Field,
)

from app.database import get_connection
from app.services.copilot_service import ask_groq


router = APIRouter(
    prefix="/copilot",
    tags=["Copilot"],
)


class CopilotRequest(BaseModel):
    question: str = Field(
        min_length=2,
        max_length=500,
    )


class IntelligenceAnswer(BaseModel):
    title: str
    summary: str
    findings: list[str]
    conclusion: str


class CopilotResponse(BaseModel):
    answer: IntelligenceAnswer
    context_type: str


def rows_to_dicts(rows):

    return [
        dict(row)
        for row in rows
    ]


def get_intelligence_context():

    conn = get_connection()

    try:

        # ---------------------------------
        # GENERAL DATASET SUMMARY
        # ---------------------------------

        summary_rows = conn.execute(
            """
            SELECT
                metric,
                value
            FROM crime_summary
            """
        ).fetchall()

        summary = {
            row["metric"]: row["value"]
            for row in summary_rows
        }


        # ---------------------------------
        # TOP HISTORICAL CRIME TYPES
        # ---------------------------------

        crime_types = conn.execute(
            """
            SELECT
                primary_type,
                crime_count,
                arrests,
                percentage
            FROM crime_types
            ORDER BY crime_count DESC
            LIMIT 10
            """
        ).fetchall()


        # ---------------------------------
        # HISTORICAL MONTHLY ACTIVITY
        # ---------------------------------

        monthly_crimes = conn.execute(
            """
            SELECT
                year_month,
                crime_count
            FROM monthly_crimes
            ORDER BY year_month ASC
            """
        ).fetchall()


        # ---------------------------------
        # PEAK HISTORICAL MONTH
        # ---------------------------------

        peak_month = conn.execute(
            """
            SELECT
                year_month,
                crime_count
            FROM monthly_crimes
            ORDER BY crime_count DESC
            LIMIT 1
            """
        ).fetchone()


        # ---------------------------------
        # RISK DISTRIBUTION
        # ---------------------------------

        risk_distribution = conn.execute(
            """
            SELECT
                risk_level,
                COUNT(*) AS area_count
            FROM area_risk
            GROUP BY risk_level
            ORDER BY area_count DESC
            """
        ).fetchall()


        # ---------------------------------
        # TOP RISK AREAS
        # ---------------------------------

        top_risk_areas = conn.execute(
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
            ORDER BY risk_rank ASC
            LIMIT 10
            """
        ).fetchall()


        # ---------------------------------
        # FUTURE HOTSPOTS
        # ---------------------------------

        future_hotspots = conn.execute(
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
            ORDER BY hotspot_rank ASC
            LIMIT 10
            """
        ).fetchall()


        # ---------------------------------
        # ACTIVE FORECAST WEEK
        # ---------------------------------

        forecast_week_row = conn.execute(
            """
            SELECT week
            FROM future_hotspots
            ORDER BY hotspot_rank ASC
            LIMIT 1
            """
        ).fetchone()


        forecast_week = (
            forecast_week_row["week"]
            if forecast_week_row
            else None
        )


        # ---------------------------------
        # BUILD SAFE ANALYTICAL CONTEXT
        # ---------------------------------

        context = {

            "dataset_summary": summary,

            "historical_crime_types": (
                rows_to_dicts(crime_types)
            ),

            "monthly_crime_activity": (
                rows_to_dicts(monthly_crimes)
            ),

            "peak_historical_month": (
                dict(peak_month)
                if peak_month
                else None
            ),

            "risk_distribution": (
                rows_to_dicts(
                    risk_distribution
                )
            ),

            "highest_risk_areas": (
                rows_to_dicts(
                    top_risk_areas
                )
            ),

            "future_hotspots": (
                rows_to_dicts(
                    future_hotspots
                )
            ),

            "active_forecast_week": (
                forecast_week
            ),
        }


        return context

    finally:

        conn.close()


@router.post(
    "/query",
    response_model=CopilotResponse,
)
def query_copilot(
    request: CopilotRequest,
):

    try:

        context = get_intelligence_context()


        context_text = json.dumps(
            context,
            indent=2,
            default=str,
        )


        answer = ask_groq(
            question=request.question,
            context=context_text,
        )


        return CopilotResponse(
            answer=answer,
            context_type=(
                "crime_intelligence"
            ),
        )


    except Exception as exc:

        print(
            "COPILOT ERROR TYPE:",
            type(exc).__name__,
        )

        print(
            "COPILOT ERROR:",
            str(exc),
        )


        raise HTTPException(
            status_code=500,
            detail=(
                "Crime Copilot could not "
                "process the request."
            ),
        )