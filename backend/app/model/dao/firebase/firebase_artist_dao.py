from typing import List, Optional
from app.model.dao.interfaces.artist_dao import ArtistDAO
from app.model.dto.ArtistDTO import ArtistDTO
from .firebase_connector import FirebaseConnector 

class FirebaseArtistDAO(ArtistDAO):

    def __init__(self):
        """Inicializa la conexión a Firebase Firestore y establece la referencia a la colección 'artists'."""
        self.db = FirebaseConnector().get_db()
        self.collection = self.db.collection("artists")

    def get_all(self) -> List[ArtistDTO]:
        """Recupera todos los documentos de la colección 'artists' y los convierte en una lista de objetos ArtistDTO."""
        docs = self.collection.stream()
        return [ArtistDTO.model_validate(doc.to_dict()) for doc in docs]

    def get_by_id(self, artist_id: str) -> Optional[ArtistDTO]:
        """Recupera un documento específico por su ID único. """
        doc = self.collection.document(artist_id).get()
        return ArtistDTO.model_validate(doc.to_dict()) if doc.exists else None

    def create(self, artist: ArtistDTO) -> bool:
        """Crea un nuevo documento en la colección 'artists' con los datos proporcionados por el objeto ArtistDTO."""
        self.collection.document(str(artist.id)).set(artist.model_dump())
        return True

    def update(self, artist_id: str, artist: ArtistDTO) -> bool:
        """Actualiza un documento existente identificado por su ID con los nuevos datos proporcionados por el objeto ArtistDTO."""
        self.collection.document(artist_id).update(artist.model_dump())
        return True

    def delete(self, artist_id: str) -> bool:
        """Elimina permanentemente el documento del artista especificado por su ID. """
        self.collection.document(artist_id).delete()
        return True
