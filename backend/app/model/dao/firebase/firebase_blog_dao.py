from typing import List, Optional
from app.model.dao.interfaces.history_dao import HistoryDAO
from app.model.dto.HistoryDTO import HistoryDTO
from .firebase_connector import FirebaseConnector

class FirebaseBlogDAO(HistoryDAO):
    """
    Implementación del DAO para el Blog utilizando Firebase Firestore.
    """

    def __init__(self):
        """Inicializa la conexión a Firebase Firestore y establece la referencia a la colección 'blog'."""
        self.db = FirebaseConnector().get_db()
        self.collection = self.db.collection("blog")

    def get_all(self) -> List[HistoryDTO]:
        """Recupera todos los documentos de la colección 'blog' y los convierte en una lista de objetos HistoryDTO."""
        docs = self.collection.stream()
        return [HistoryDTO.model_validate(doc.to_dict()) for doc in docs]

    def get_by_id(self, history_id: str) -> Optional[HistoryDTO]:
        """Recupera un documento específico por su ID único."""
        doc = self.collection.document(str(history_id)).get()
        if doc.exists:
            return HistoryDTO.model_validate(doc.to_dict())
        return None

    def create(self, history_item: HistoryDTO) -> bool:
        """Crea un nuevo documento en la colección 'blog' con los datos proporcionados por el objeto HistoryDTO."""
        self.collection.document(str(history_item.id)).set(history_item.model_dump())
        return True

    def update(self, history_id: str, history_item: HistoryDTO) -> bool:
        """Actualiza un documento existente identificado por su ID con los nuevos datos proporcionados por el objeto HistoryDTO."""
        self.collection.document(str(history_id)).update(history_item.model_dump())
        return True

    def delete(self, history_id: str) -> bool:
        """Elimina permanentemente el documento del blog especificado por su ID."""
        self.collection.document(str(history_id)).delete()
        return True