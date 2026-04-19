from abc import ABC, abstractmethod
from typing import List, Optional

from ...dto.TicketTemplateDTO import TicketTemplateDTO


class TicketTemplateDAO(ABC):
    """Interfaz de persistencia para plantillas de entradas."""

    @abstractmethod
    def get_all(self) -> List[TicketTemplateDTO]:
        pass

    @abstractmethod
    def get_by_id(self, template_id: str) -> Optional[TicketTemplateDTO]:
        pass

    @abstractmethod
    def create(self, template: TicketTemplateDTO) -> bool:
        pass

    @abstractmethod
    def update(self, template_id: str, template: TicketTemplateDTO) -> bool:
        pass

    @abstractmethod
    def delete(self, template_id: str) -> bool:
        pass