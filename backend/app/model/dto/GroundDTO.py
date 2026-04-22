from pydantic import BaseModel
from typing import Optional

class GroundDTO(BaseModel):
    """Objeto de transferencia de datos para las zonas o escenarios del recinto."""
    id: str
    name: str
    status: str
    capacity: int
    area: str
    image: Optional[str] = None

    class Config:
        from_attributes = True