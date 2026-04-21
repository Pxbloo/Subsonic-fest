from pydantic import BaseModel, Field
from typing import List, Optional


class TicketTemplateDTO(BaseModel):
    """Objeto de transferencia de datos para plantillas de entradas."""
    id: Optional[str] = None
    name: str
    features: List[str] = Field(default_factory=list)
    price: float

    class Config:
        from_attributes = True