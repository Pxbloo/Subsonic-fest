from pydantic import BaseModel
from typing import List


class BlogPostDTO(BaseModel):
    """Objeto de transferencia de datos para las entradas del blog de noticias."""
    id: str
    title: str
    summary: str
    content: str
    category: str
    tags: List[str]
    date: str
    author: str
    image: str
    url: str

    class Config:
        from_attributes = True