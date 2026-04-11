from abc import ABC, abstractmethod
from typing import List, Optional
from ...dto.BlogPostDTO import BlogPostDTO

class BlogPostDAO(ABC):
    """Interfaz para la gestión de artículos del blog."""

    @abstractmethod
    def get_all(self) -> List[BlogPostDTO]:
        """Recupera todos los artículos del blog disponibles."""
        pass

    @abstractmethod
    def get_by_id(self, post_id: str) -> Optional[BlogPostDTO]:
        """Recupera un artículo del blog específico por su ID."""
        pass

    @abstractmethod
    def get_by_category(self, category: str) -> List[BlogPostDTO]:
        """Recupera artículos del blog filtrados por categoría."""
        pass