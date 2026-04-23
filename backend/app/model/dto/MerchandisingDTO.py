from typing import List, Optional
from pydantic import BaseModel
from typing import Optional

class PurchaseOptionDTO(BaseModel):
    name: str
    label: str
    values: List[str]

class MerchandisingDTO(BaseModel):
    """Objeto de transferencia de datos para los artículos de la tienda oficial."""
    id: Optional[str] = None
    name: str
    type: str
    price: float
    stock: int
    description: str
    purchaseOptions: Optional[List[PurchaseOptionDTO]] = []

    class Config:
        from_attributes = True