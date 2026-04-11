from abc import ABC, abstractmethod
from typing import List, Optional
from ...dto.MerchandisingDTO import MerchandisingDTO

class MerchandisingDAO(ABC):
    """Interfaz para la gestión de productos de merchandising."""

    @abstractmethod
    def get_all(self) -> List[MerchandisingDTO]:
        """Recupera todos los productos de merchandising disponibles."""
        pass

    @abstractmethod
    def get_by_id(self, product_id: str) -> Optional[MerchandisingDTO]:
        """Recupera un producto de merchandising específico por su ID."""
        pass

    @abstractmethod
    def get_by_type(self, product_type: str) -> List[MerchandisingDTO]:
        """Recupera productos filtrados por tipo (ropa, accesorio, etc.)."""
        pass