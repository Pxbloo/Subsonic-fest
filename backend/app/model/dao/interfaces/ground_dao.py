from abc import ABC, abstractmethod
from typing import List, Optional
from model.dto.GroundDTO import GroundDTO

class GroundDAO(ABC):
    """Interfaz para la gestión de zonas y escenarios del recinto."""

    @abstractmethod
    def get_all(self) -> List[GroundDTO]:
        pass

    @abstractmethod
    def get_by_id(self, ground_id: str) -> Optional[GroundDTO]:
        pass

    @abstractmethod
    def update_status(self, ground_id: str, new_status: str) -> bool:
        """Método específico para cambiar el estado (Operativo/En montaje) de una zona."""
        pass