from abc import ABC, abstractmethod
from typing import List
from ...dto.HistoryDTO import HistoryDTO

class HistoryDAO(ABC):
    """Interfaz para consultar el historial de asistencia."""

    @abstractmethod
    def get_all(self) -> List[HistoryDTO]:
        """Recupera todos los eventos a los que ha asistido cualquier usuario."""
        pass

    @abstractmethod
    def get_by_user_id(self, user_id: str) -> List[HistoryDTO]:
        """Recupera todos los eventos a los que ha asistido un usuario concreto."""
        pass