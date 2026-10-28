from pydantic import BaseModel


class MonthlyCrimeResponse(BaseModel):
    year_month: str
    crime_count: int