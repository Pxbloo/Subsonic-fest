from pydantic import BaseModel

class MerchandisingDTO(BaseModel):
    """Objeto de transferencia de datos para los artículos de la tienda oficial."""
    id: str
    name: str
    type: str
    price: float
    description: str

    class Config:
        from_attributes = True