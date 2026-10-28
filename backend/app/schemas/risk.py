from pydantic import BaseModel


class RiskAreaResponse(BaseModel):
    week: str
    grid_id: str
    grid_lat: float
    grid_lon: float
    predicted_crimes: float
    risk_level: str
    risk_rank: int


class RiskDistributionResponse(BaseModel):
    risk_level: str
    area_count: int