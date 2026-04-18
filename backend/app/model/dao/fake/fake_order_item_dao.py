import json
from pathlib import Path
from typing import List, Optional

from app.model.dao.interfaces.order_item_dao import OrderItemDAO
from app.model.dto.OrderItemDTO import OrderItemDTO


class FakeOrderItemDAO(OrderItemDAO):
    """Persistencia local de pedidos Stripe para el modo fake."""

    def __init__(self, db_path: str | None = None):
        default_path = Path(__file__).resolve().parents[3] / "data" / "order_items.json"
        self.db_path = Path(db_path) if db_path else default_path
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        if not self.db_path.exists():
            self.db_path.write_text("[]", encoding="utf-8")

    def _read_all(self) -> List[dict]:
        try:
            raw_data = self.db_path.read_text(encoding="utf-8")
            return json.loads(raw_data) if raw_data.strip() else []
        except (FileNotFoundError, json.JSONDecodeError):
            return []

    def _write_all(self, rows: List[dict]) -> None:
        self.db_path.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")

    def get_all(self) -> List[OrderItemDTO]:
        return [OrderItemDTO.model_validate(row) for row in self._read_all()]

    def get_by_id(self, order_id: str) -> Optional[OrderItemDTO]:
        for row in self._read_all():
            if str(row.get("id")) == str(order_id):
                return OrderItemDTO.model_validate(row)
        return None

    def get_by_user_id(self, user_id: str) -> List[OrderItemDTO]:
        return [
            OrderItemDTO.model_validate(row)
            for row in self._read_all()
            if str(row.get("user_id")) == str(user_id)
        ]

    def create(self, order_item: OrderItemDTO) -> bool:
        rows = self._read_all()
        rows = [row for row in rows if str(row.get("id")) != str(order_item.id)]
        rows.append(order_item.model_dump())
        self._write_all(rows)
        return True

    def update(self, order_id: str, order_item: OrderItemDTO) -> bool:
        rows = self._read_all()
        updated_rows = []
        replaced = False

        for row in rows:
            if str(row.get("id")) == str(order_id):
                updated_rows.append(order_item.model_dump())
                replaced = True
            else:
                updated_rows.append(row)

        if not replaced:
            updated_rows.append(order_item.model_dump())

        self._write_all(updated_rows)
        return True