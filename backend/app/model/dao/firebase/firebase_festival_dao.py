from typing import List, Optional

from model.dao.interfaces.festival_dao import FestivalDAO
from model.dto.FestivalDTO import FestivalDTO
from .firebase_connector import FirebaseConnector


class FirebaseFestivalDAO(FestivalDAO):
    def __init__(self):
        self.db = FirebaseConnector.get_db()
        self.collection = self.db.collection("festivals")

    def get_all(self) -> List[FestivalDTO]:
        docs = self.collection.stream()
        return [FestivalDTO.model_validate(doc.to_dict()) for doc in docs]

    def get_by_id(self, festival_id: str) -> Optional[FestivalDTO]:
        doc = self.collection.document(festival_id).get()
        if doc.exists:
            return FestivalDTO.model_validate(doc.to_dict())
        return None 
    
    def create(self, festival: FestivalDTO) -> bool:
        """Crea un nuevo documento en la colección 'festivals' con los datos proporcionados por el objeto FestivalDTO.
        El ID del documento se establece como el valor del atributo 'id' del objeto FestivalDTO."""
        doc_id = str(festival.id)
        self.collection.document(doc_id).set(festival.model_dump())
        return True
    
    def update(self, festival_id: str, festival: FestivalDTO) -> bool:
        """Actualiza un documento existente identificado por su ID con los nuevos datos proporcionados por el objeto FestivalDTO. 
        Si el documento existe, se actualiza con los nuevos datos; de lo contrario, se devuelve False."""
        doc_ref = self.collection.document(festival_id)
        doc = doc_ref.get()
        if not doc.exists:
            return False

        doc_ref.update(festival.model_dump())
        return True
    
    def delete(self, festival_id: str) -> bool:
        """Elimina permanentemente el documento del festival especificado por su ID. 
        Si el documento existe, se elimina; de lo contrario, se devuelve False."""
        doc_ref = self.collection.document(festival_id)
        doc = doc_ref.get()
        if not doc.exists:
            return False

        doc_ref.delete()
        return True