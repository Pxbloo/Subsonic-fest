from pydantic import BaseModel
from typing import Optional


class OrderItemDTO(BaseModel):
    """Objeto de transferencia de datos para un pedido gestionado por Stripe."""

    id: str
    user_id: Optional[str] = None
    title: str
    amount: float
    status: str
    payment_method: str
    source: str
    created_at: str
    updated_at: Optional[str] = None
    currency: str = "EUR"
    checkout_session_id: Optional[str] = None

    class Config:
        from_attributes = True
