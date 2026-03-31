from pydantic import BaseModel
from typing import Optional

class AddressDTO(BaseModel):
    """Representación de una dirección postal o ubicación geográfica."""
    country: str
    city: str
    street: str
    postalCode: str

class ArtistDTO(BaseModel):
    """Objeto de transferencia de datos para la entidad Artista."""
    id: str
    name: str
    genre: str
    email: Optional[str] = None
    phone: Optional[str] = None
    description: Optional[str] = None
    spotifyId: Optional[str] = None
    address: Optional[AddressDTO] = None

    class Config:
        from_attributes = True