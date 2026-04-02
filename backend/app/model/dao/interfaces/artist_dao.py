from abc import ABC, abstractmethod
from typing import List, Optional

from app.model.dto.ArtistDTO import ArtistDTO

class ArtistDAO(ABC):
    """Interfaz que define las operaciones de persistencia para la entidad Artista."""

    @abstractmethod
    def get_all(self) -> List[ArtistDTO]:
        """Recupera todos los artistas registrados."""
        pass

    @abstractmethod
    def get_by_id(self, artist_id: str) -> Optional[ArtistDTO]:
        """Recupera un artista por su ID único. Devuelve None si no se encuentra."""
        pass

    @abstractmethod
    def create(self, artist: ArtistDTO) -> bool:
        """Crea un nuevo artista. Devuelve True si la operación fue exitosa."""
        pass

    @abstractmethod
    def update(self, artist_id: str, artist: ArtistDTO) -> bool:
        """Actualiza un artista existente. Devuelve True si se realizó el cambio."""
        pass

    @abstractmethod
    def delete(self, artist_id: str) -> bool:
        """Elimina un artista por su ID. Devuelve True si se borró correctamente."""
        pass