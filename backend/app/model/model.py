import os
from .factory.fakeDAOFactory import FakeDAOFactory
from .factory.firebaseDAOFactory import FirebaseDAOFactory
from .dao.firebase.firebase_connector import FirebaseConnector

class SubsonicModel:
    def __init__(self):
        backend = os.getenv("DATA_BACKEND", "fake").lower()
        if backend == "firebase":
            self.factory = FirebaseDAOFactory()
            self.connector = FirebaseConnector()
        else:
            self.factory = FakeDAOFactory()
            self.connector = None

    def verificar_token_oauth(self, token: str):
        """
        Servicio que valida el token recibido del frontend.
        Si es válido, busca al usuario en la base de datos.
        """
        if not self.connector:
            return None

        user_info = self.connector.verify_token(token)
        
        if user_info:
            uid = user_info.get("uid")

            user_dao = self.factory.get_user_dao()
            user_dto = user_dao.get_by_id(uid)
            
            return user_dto
            
        return None