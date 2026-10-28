from pydantic import BaseModel


class CrimeTypeResponse(BaseModel):
    primary_type: str
    crime_count: int
    arrests: int
    percentage: float