from typing import List, Optional
from app.model.dao.interfaces.history_dao import HistoryDAO
from app.model.dto.HistoryDTO import HistoryDTO
from .firebase_connector import FirebaseConnector

class FirebaseHistoryDAO(HistoryDAO):
    """
    Implementación del DAO para el Historial utilizando Firebase Firestore.
    """

    def __init__(self):
        """Inicializa la conexión a Firebase Firestore y establece la referencia a la colección 'history'."""
        self.db = FirebaseConnector().get_db()
        self.collection = self.db.collection("history")

    def get_all(self) -> List[HistoryDTO]:
        """Recupera todos los documentos de la colección 'history' y los convierte en una lista de objetos HistoryDTO."""
        docs = self.collection.stream()
        return [HistoryDTO.model_validate(doc.to_dict()) for doc in docs]

    def get_by_id(self, history_id: str) -> Optional[HistoryDTO]:
        """Recupera un documento específico por su ID único."""
        doc = self.collection.document(str(history_id)).get()
        if doc.exists:
            return HistoryDTO.model_validate(doc.to_dict())
        return None

    def get_by_user_id(self, user_id: str) -> List[HistoryDTO]:
        """Recupera todos los documentos de la colección 'history' que correspondan a un ID de usuario específico."""
        query = self.collection.where("user_id", "==", user_id).stream()
        return [HistoryDTO.model_validate(doc.to_dict()) for doc in query]

    def create(self, history_item: HistoryDTO) -> bool:
        """Crea un nuevo documento en la colección 'history' con los datos proporcionados por el objeto HistoryDTO."""
        self.collection.document(str(history_item.id)).set(history_item.model_dump())
        return True

    def update(self, history_id: str, history_item: HistoryDTO) -> bool:
        """Actualiza un documento existente identificado por su ID con los nuevos datos proporcionados por el objeto HistoryDTO."""
        self.collection.document(str(history_id)).update(history_item.model_dump())
        return True

    def delete(self, history_id: str) -> bool:
        """Elimina permanentemente el documento del historial especificado por su ID."""
        self.collection.document(str(history_id)).delete()
        return True