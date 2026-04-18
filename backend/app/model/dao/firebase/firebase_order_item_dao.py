from typing import List, Optional
from google.cloud.firestore_v1.base_query import FieldFilter
from app.model.dao.interfaces.order_item_dao import OrderItemDAO
from app.model.dto.OrderItemDTO import OrderItemDTO
from .firebase_connector import FirebaseConnector


class FirebaseOrderItemDAO(OrderItemDAO):
    """Implementación de pedidos Stripe usando Firebase Firestore."""

    def __init__(self):
        self.db = FirebaseConnector().get_db()
        self.collection = self.db.collection("orderItems")

    def get_all(self) -> List[OrderItemDTO]:
        docs = self.collection.stream()
        return [OrderItemDTO.model_validate(doc.to_dict()) for doc in docs]

    def get_by_id(self, order_id: str) -> Optional[OrderItemDTO]:
        doc = self.collection.document(str(order_id)).get()
        if doc.exists:
            return OrderItemDTO.model_validate(doc.to_dict())
        return None

    def get_by_user_id(self, user_id: str) -> List[OrderItemDTO]:
        query = self.collection.where(filter=FieldFilter("user_id", "==", user_id)).stream()
        return [OrderItemDTO.model_validate(doc.to_dict()) for doc in query]

    def create(self, order_item: OrderItemDTO) -> bool:
        self.collection.document(str(order_item.id)).set(order_item.model_dump())
        return True

    def update(self, order_id: str, order_item: OrderItemDTO) -> bool:
        self.collection.document(str(order_id)).update(order_item.model_dump())
        return True
