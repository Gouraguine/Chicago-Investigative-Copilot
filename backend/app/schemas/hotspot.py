from pydantic import BaseModel


class HotspotResponse(BaseModel):
    hotspot_rank: int
    week: str
    grid_id: str
    grid_lat: float
    grid_lon: float
    predicted_crimes: float
    risk_level: str