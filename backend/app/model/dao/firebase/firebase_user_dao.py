from typing import List, Optional
from app.model.dao.interfaces.user_dao import UserDAO
from app.model.dto.UserDTO import UserDTO
from .firebase_connector import FirebaseConnector # Todavia no se ha implementado el conector

class FirebaseUserDAO(UserDAO):
    
    # Implementación de UserDAO utilizando Firebase Firestore como almacenamiento de datos.
    def __init__(self):
        self.db = FirebaseConnector().get_db()
        self.collection = self.db.collection("users")

    # Recupera todos los documentos de la colección 'users'.
    def get_all(self) -> List[UserDTO]:
        docs = self.collection.stream()
        return [UserDTO.model_validate(doc.to_dict()) for doc in docs]

    # Busca un documento específico por su ID único.
    def get_by_id(self, user_id: str) -> Optional[UserDTO]:
        doc = self.collection.document(user_id).get()
        return UserDTO.model_validate(doc.to_dict()) if doc.exists else None

    # Crea un nuevo documento en la colección 'users' con los datos proporcionados por el objeto UserDTO.
    def create(self, user: UserDTO) -> bool:
        self.collection.document(str(user.id)).set(user.model_dump())
        return True

    # Actualiza un documento existente identificado por su ID con los nuevos datos proporcionados por el objeto UserDTO.
    def update(self, user_id: str, user: UserDTO) -> bool:
        self.collection.document(user_id).update(user.model_dump())
        return True

    # Elimina permanentemente el documento del usuario especificado por su ID.
    def delete(self, user_id: str) -> bool:
        self.collection.document(user_id).delete()
        return True