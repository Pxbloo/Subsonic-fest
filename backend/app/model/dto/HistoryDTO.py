from pydantic import BaseModel

class HistoryDTO(BaseModel):
    """Objeto de transferencia de datos para el historial de eventos asistidos."""
    id: str
    title: str
    date: str
    location: str
    image: str
    status: str
    rating: float

    class Config:
        from_attributes = True