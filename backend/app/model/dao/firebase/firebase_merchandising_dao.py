from typing import List, Optional
from app.model.dao.interfaces.merchandising_dao import MerchandisingDAO
from app.model.dto.MerchandisingDTO import MerchandisingDTO
from .firebase_connector import FirebaseConnector

class FirebaseMerchandisingDAO(MerchandisingDAO):

    def __init__(self):
        """Inicializa la conexión a Firebase Firestore y establece la referencia a la colección 'merchandising'."""
        self.db = FirebaseConnector().get_db()
        self.collection = self.db.collection("merchandising")

    def get_all(self) -> List[MerchandisingDTO]:
        """Recupera todos los documentos de la colección 'merchandising' y los convierte en una lista de objetos MerchandisingDTO."""
        docs = self.collection.stream()
        return [MerchandisingDTO.model_validate(doc.to_dict()) for doc in docs]

    def get_by_id(self, merchandising_id: str) -> Optional[MerchandisingDTO]:
        """Recupera un documento específico por su ID único."""
        doc = self.collection.document(str(merchandising_id)).get()
        if doc.exists:
            return MerchandisingDTO.model_validate(doc.to_dict())
        return None

    def create(self, merchandising_item: MerchandisingDTO) -> bool:
        """Crea un nuevo documento en la colección 'merchandising' con los datos proporcionados por el objeto MerchandisingDTO."""
        self.collection.document(str(merchandising_item.id)).set(merchandising_item.model_dump())
        return True

    def update(self, merchandising_id: str, merchandising_item: MerchandisingDTO) -> bool:
        """Actualiza un documento existente identificado por su ID con los nuevos datos proporcionados por el objeto MerchandisingDTO."""
        doc_ref = self.collection.document(merchandising_id)
        doc = doc_ref.get()
        if not doc.exists:
            return False

        doc_ref.update(merchandising_item.model_dump())
        return True

    def delete(self, merchandising_id: str) -> bool:
        """Elimina permanentemente el documento de la tienda especificado por su ID."""
        doc_ref = self.collection.document(merchandising_id)
        doc = doc_ref.get()
        if not doc.exists:
            return False

        doc_ref.delete()
        return True