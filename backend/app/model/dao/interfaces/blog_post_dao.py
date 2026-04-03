from abc import ABC, abstractmethod
from typing import List, Optional
from model.dto.BlogPostDTO import BlogPostDTO

class BlogPostDAO(ABC):
    """Interfaz para la gestión de artículos del blog."""

    @abstractmethod
    def get_all(self) -> List[BlogPostDTO]:
        pass

    @abstractmethod
    def get_by_id(self, post_id: str) -> Optional[BlogPostDTO]:
        pass

    @abstractmethod
    def get_by_category(self, category: str) -> List[BlogPostDTO]:
        pass