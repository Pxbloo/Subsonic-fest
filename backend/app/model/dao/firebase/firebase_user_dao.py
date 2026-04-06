from typing import List, Optional
from app.model.dao.interfaces.user_dao import UserDAO
from app.model.dto.UserDTO import UserDTO
from .firebase_connector import FirebaseConnector # Todavia no se ha implementado el conector

class FirebaseUserDAO(UserDAO):

    def __init__(self):
        """Inicializa la conexión a Firebase Firestore y establece la referencia a la colección 'users'."""
        self.db = FirebaseConnector().get_db()
        self.collection = self.db.collection("users")

    def get_all(self) -> List[UserDTO]:
        """Recupera todos los documentos de la colección 'users' y los convierte en una lista de objetos UserDTO."""
        docs = self.collection.stream()
        return [UserDTO.model_validate(doc.to_dict()) for doc in docs]

    def get_by_id(self, user_id: str) -> Optional[UserDTO]:
        """Recupera un documento específico por su ID único. 
        Si el documento existe, lo convierte en un objeto UserDTO; de lo contrario, devuelve None."""
        doc = self.collection.document(user_id).get()
        return UserDTO.model_validate(doc.to_dict()) if doc.exists else None

    def create(self, user: UserDTO) -> bool:
        """Crea un nuevo documento en la colección 'users' con los datos proporcionados por el objeto UserDTO. 
        El ID del documento se establece como el valor del atributo 'id' del objeto UserDTO."""
        self.collection.document(str(user.id)).set(user.model_dump())
        return True

    def update(self, user_id: str, user: UserDTO) -> bool:
        """Actualiza un documento existente identificado por su ID con los nuevos datos proporcionados por el objeto UserDTO. 
        Si el documento existe, se actualiza con los nuevos datos; de lo contrario, se devuelve False."""
        self.collection.document(user_id).update(user.model_dump())
        return True

    def delete(self, user_id: str) -> bool:
        """Elimina permanentemente el documento del usuario especificado por su ID. 
        Si el documento existe, se elimina; de lo contrario, se devuelve False."""
        self.collection.document(user_id).delete()
        return True