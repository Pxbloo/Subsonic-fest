from pydantic import BaseModel

class GroundDTO(BaseModel):
    """Objeto de transferencia de datos para las zonas o escenarios del recinto."""
    id: str
    name: str
    status: str
    capacity: int
    area: str

    class Config:
        from_attributes = True