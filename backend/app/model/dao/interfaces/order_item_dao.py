from abc import ABC, abstractmethod
from typing import List, Optional
from ...dto.OrderItemDTO import OrderItemDTO


class OrderItemDAO(ABC):
    """Interfaz para gestionar pedidos generados por Stripe."""

    @abstractmethod
    def get_all(self) -> List[OrderItemDTO]:
        pass

    @abstractmethod
    def get_by_id(self, order_id: str) -> Optional[OrderItemDTO]:
        pass

    @abstractmethod
    def get_by_user_id(self, user_id: str) -> List[OrderItemDTO]:
        pass

    @abstractmethod
    def create(self, order_item: OrderItemDTO) -> bool:
        pass

    @abstractmethod
    def update(self, order_id: str, order_item: OrderItemDTO) -> bool:
        pass
