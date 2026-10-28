from pydantic import BaseModel


class CrimeTypeForecastResponse(BaseModel):
    rank: int
    week: str
    primary_type: str
    predicted_crimes: float