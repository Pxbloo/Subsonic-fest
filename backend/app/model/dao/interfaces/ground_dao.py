from abc import ABC, abstractmethod
from typing import List, Optional
from ...dto.GroundDTO import GroundDTO

class GroundDAO(ABC):
    """Interfaz para la gestión de los recintos de los festivales."""   

    @abstractmethod
    def get_all(self) -> List[GroundDTO]:
        """Recupera todos los recintos disponibles."""
        pass

    @abstractmethod
    def get_by_id(self, ground_id: str) -> Optional[GroundDTO]:
        """Recupera un recinto específico por su ID."""
        pass

    @abstractmethod
    def create(self, ground: GroundDTO) -> bool:
        """Crea un nuevo recinto con los datos proporcionados por el objeto GroundDTO."""
        pass

    @abstractmethod
    def update(self, ground_id: str, ground: GroundDTO) -> bool:
        """Actualiza un recinto existente identificado por su ID con los nuevos datos proporcionados por el objeto GroundDTO."""
        pass

    @abstractmethod
    def delete(self, ground_id: str) -> bool:
        """Elimina permanentemente el recinto especificado por su ID."""
        pass