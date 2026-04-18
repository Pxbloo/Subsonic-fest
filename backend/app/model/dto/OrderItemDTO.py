from pydantic import BaseModel

class OrderItemsDTO(BaseModel):
    """Objeto de transferencia de datos para los artículos añadidos al carrito."""
    id: str
    name: str
    price: float
    quantity: int

    class Config:
        from_attributes = True