from pydantic import BaseModel
from typing import Optional

class AddressDTO(BaseModel):
    """Representación de la ubicación física de un usuario."""
    country: str
    city: str
    street: str
    postalCode: str

class UserDTO(BaseModel):
    """Objeto de transferencia de datos para la gestión de usuarios y roles."""
    id: str
    name: str
    email: str
    role: str
    address: AddressDTO
    phone: str
    avatar: Optional[str] = None
    password: Optional[str] = None 

    class Config:
        from_attributes = True