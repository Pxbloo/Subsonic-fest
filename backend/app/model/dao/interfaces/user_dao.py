from abc import ABC, abstractmethod
from typing import List, Optional

from app.model.dto.UserDTO import UserDTO

class UserDAO(ABC):
    """Interfaz que define las operaciones de persistencia para la entidad Usuario."""

    @abstractmethod
    def get_all(self) -> List[UserDTO]:
        """Recupera todos los usuarios registrados."""
        pass

    @abstractmethod
    def get_by_id(self, user_id: str) -> Optional[UserDTO]:
        """Recupera un usuario por su ID único. Devuelve None si no se encuentra."""
        pass

    @abstractmethod
    def create(self, user: UserDTO) -> bool:
        """Crea un nuevo usuario. Devuelve True si la operación fue exitosa."""
        pass

    @abstractmethod
    def update(self, user_id: str, user: UserDTO) -> bool:
        """Actualiza un usuario existente. Devuelve True si se realizó el cambio."""
        pass

    @abstractmethod
    def delete(self, user_id: str) -> bool:
        """Elimina un usuario por su ID. Devuelve True si se borró correctamente."""
        pass
