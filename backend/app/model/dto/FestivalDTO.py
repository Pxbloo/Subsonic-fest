from pydantic import BaseModel, Field
from typing import List, Optional

class TicketDTO(BaseModel):
    """Objeto de transferencia de datos para una categoría de entrada."""
    name: str
    price: float
    features: List[str]

class LineupItemDTO(BaseModel):
    """Representación simplificada de un artista dentro del cartel de un festival."""
    id: str
    name: str
    genre: str

class FestivalDTO(BaseModel):
    """Objeto de transferencia de datos principal para la entidad Festival."""
    id: str
    title: str
    date: str
    startDate: str
    location: str
    price: Optional[float] = None
    description: str
    tickets: List[TicketDTO]
    lineup: List[LineupItemDTO]

    class Config:
        from_attributes = True