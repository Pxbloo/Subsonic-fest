from abc import ABC, abstractmethod
from typing import List, Optional
from model.dto.MerchandisingDTO import MerchandisingDTO

class MerchandisingDAO(ABC):
    """Interfaz para la gestión de productos de merchandising."""

    @abstractmethod
    def get_all(self) -> List[MerchandisingDTO]:
        pass

    @abstractmethod
    def get_by_id(self, product_id: str) -> Optional[MerchandisingDTO]:
        pass

    @abstractmethod
    def get_by_type(self, product_type: str) -> List[MerchandisingDTO]:
        """Recupera productos filtrados por tipo (ropa, accesorio, etc.)."""
        pass