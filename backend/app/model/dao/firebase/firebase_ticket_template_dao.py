from typing import List, Optional

from ..interfaces.ticket_template_dao import TicketTemplateDAO
from ...dto.TicketTemplateDTO import TicketTemplateDTO
from .firebase_connector import FirebaseConnector


class FirebaseTicketTemplateDAO(TicketTemplateDAO):
    def __init__(self):
        self.db = FirebaseConnector().get_db()
        self.collection = self.db.collection("ticketTemplates")

    def get_all(self) -> List[TicketTemplateDTO]:
        docs = self.collection.stream()
        return [TicketTemplateDTO.model_validate(doc.to_dict()) for doc in docs]

    def get_by_id(self, template_id: str) -> Optional[TicketTemplateDTO]:
        doc = self.collection.document(str(template_id)).get()
        if doc.exists:
            return TicketTemplateDTO.model_validate(doc.to_dict())
        return None

    def create(self, template: TicketTemplateDTO) -> bool:
        if not template.id:
            return False
        self.collection.document(str(template.id)).set(template.model_dump())
        return True

    def update(self, template_id: str, template: TicketTemplateDTO) -> bool:
        doc_ref = self.collection.document(str(template_id))
        if not doc_ref.get().exists:
            return False
        doc_ref.set(template.model_dump())
        return True

    def delete(self, template_id: str) -> bool:
        doc_ref = self.collection.document(str(template_id))
        if not doc_ref.get().exists:
            return False
        doc_ref.delete()
        return True