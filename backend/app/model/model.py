import os
from .factory.fakeDAOFactory import FakeDAOFactory
from .factory.firebaseDAOFactory import FirebaseDAOFactory
from .dao.firebase.firebase_connector import FirebaseConnector
from .dto.UserDTO import UserDTO, AddressDTO

class SubsonicModel:
    def __init__(self):
        backend = os.getenv("DATA_BACKEND", "firebase").lower()
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

            if not user_dto:
                user_dto = UserDTO(
                    id=uid,
                    name=user_info.get("name", "Usuario de Google"),
                    email=user_info.get("email"),
                    role="user", 
                    avatar=user_info.get("picture"),
                    phone="",
                    address=AddressDTO(country="", city="", street="", postalCode=""),
                    password=None
                )
  
                user_dao.create(user_dto)
                print(f"Nuevo usuario creado mediante Google: {user_dto.email}")
            
            return user_dto
            
        return None
    
    def crear_usuario(self, user_dto: UserDTO): 
        user_dao = self.factory.get_user_dao()
        return user_dao.create(user_dto)
    
    def listar_festivales(self):  
        dao = self.factory.get_festival_dao()
        return dao.get_all()