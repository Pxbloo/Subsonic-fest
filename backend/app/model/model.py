import os
from .factory.fakeDAOFactory import FakeDAOFactory
from .factory.firebaseDAOFactory import FirebaseDAOFactory
from .dao.firebase.firebase_connector import FirebaseConnector
from .dto.UserDTO import UserDTO, AddressDTO
from .dto.OrderItemDTO import OrderItemDTO


class SubsonicModel:
    def __init__(self):
        backend = os.getenv("DATA_BACKEND", "firebase").lower()
        if backend == "firebase":
            self.factory = FirebaseDAOFactory()
            self.connector = FirebaseConnector()
        else:
            self.factory = FakeDAOFactory()
            self.connector = None

    # === Autenticación / Sesión ===
    async def verificar_token_oauth(self, token: str):
        """Valida el token recibido del frontend y devuelve un UserDTO.

        Si el usuario no existe en la base de datos, lo crea con rol "user".
        """
        if not self.connector:
            return None

        user_info = await self.connector.verify_token(token)

        if not user_info:
            return None

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
            )

            user_dao.create(user_dto)
            print(f"Nuevo usuario creado mediante Google: {user_dto.email}")

        return user_dto

    # === Usuarios ===
    def crear_usuario(self, user_dto: UserDTO):
        user_dao = self.factory.get_user_dao()
        return user_dao.create(user_dto)

    def listar_usuarios(self):
        user_dao = self.factory.get_user_dao()
        return user_dao.get_all()

    def listar_usuario_por_id(self, user_id: str):
        user_dao = self.factory.get_user_dao()
        return user_dao.get_by_id(user_id)

    def actualizar_usuario(self, user_dto: UserDTO):
        user_dao = self.factory.get_user_dao()
        return user_dao.update(user_dto.id, user_dto)

    def eliminar_usuario(self, user_id: str):
        user_dao = self.factory.get_user_dao()
        return user_dao.delete(user_id)

    # === Artistas ===
    def listar_artistas(self):
        dao = self.factory.get_artist_dao()
        return dao.get_all()

    def listar_artista_por_id(self, artist_id: str):
        dao = self.factory.get_artist_dao()
        return dao.get_by_id(artist_id)

    def crear_artista(self, artist_dto):
        dao = self.factory.get_artist_dao()
        return dao.create(artist_dto)

    def actualizar_artista(self, artist_dto):
        dao = self.factory.get_artist_dao()
        return dao.update(artist_dto.id, artist_dto)

    def eliminar_artista(self, artist_id: str):
        dao = self.factory.get_artist_dao()
        return dao.delete(artist_id)

    # === Festivales ===
    def listar_festivales(self):
        dao = self.factory.get_festival_dao()
        return dao.get_all()

    def listar_festival_por_id(self, festival_id: str):
        dao = self.factory.get_festival_dao()
        return dao.get_by_id(festival_id)

    def crear_festival(self, festival_dto):
        dao = self.factory.get_festival_dao()
        return dao.create(festival_dto)

    def actualizar_festival(self, festival_dto):
        dao = self.factory.get_festival_dao()
        return dao.update(festival_dto.id, festival_dto)

    def eliminar_festival(self, festival_id: str):
        dao = self.factory.get_festival_dao()
        return dao.delete(festival_id)

    def listar_artistas_por_festival(self, festival_id: str):
        """Devuelve artistas asociados a un festival.

        De momento es un placeholder que devuelve todos los artistas.
        """
        dao = self.factory.get_artist_dao()
        return dao.get_all()

    # === Grounds / Recintos ===
    def listar_grounds(self):
        """Devuelve todos los recintos/zonas disponibles."""
        dao = self.factory.get_ground_dao()
        return dao.get_all()

    # === Blog ===
    def listar_blog_posts(self):
        """Devuelve todas las entradas del blog."""
        dao = self.factory.get_blog_post_dao()
        return dao.get_all()

    def listar_blog_post_por_id(self, post_id: str):
        dao = self.factory.get_blog_post_dao()
        return dao.get_by_id(post_id)

    def crear_blog_post(self, post_dto):
        dao = self.factory.get_blog_post_dao()
        return dao.create(post_dto)

    def actualizar_blog_post(self, post_dto):
        dao = self.factory.get_blog_post_dao()
        return dao.update(post_dto.id, post_dto)

    # === Historial ===
    def listar_historial_por_usuario(self, user_id: str):
        """Devuelve el historial de eventos asistidos por un usuario."""
        dao = self.factory.get_history_dao()
        return dao.get_by_user_id(user_id)

    # === Pedidos / Stripe ===
    def listar_pedidos(self):
        dao = self.factory.get_order_item_dao()
        return dao.get_all()

    def listar_pedido_por_id(self, order_id: str):
        dao = self.factory.get_order_item_dao()
        return dao.get_by_id(order_id)

    def listar_pedidos_por_usuario(self, user_id: str):
        dao = self.factory.get_order_item_dao()
        return dao.get_by_user_id(user_id)

    def crear_pedido(self, order_dto: OrderItemDTO):
        dao = self.factory.get_order_item_dao()
        return dao.create(order_dto)

    def actualizar_pedido(self, order_dto: OrderItemDTO):
        dao = self.factory.get_order_item_dao()
        return dao.update(order_dto.id, order_dto)

    # === Merchandising ===
    def listar_merchandising(self):
        dao = self.factory.get_merchandising_dao()
        return dao.get_all()

    def listar_merchandising_por_id(self, product_id: str):
        dao = self.factory.get_merchandising_dao()
        return dao.get_by_id(product_id)

    def crear_merchandising(self, product_dto):
        dao = self.factory.get_merchandising_dao()
        return dao.create(product_dto)

    def actualizar_merchandising(self, product_dto):
        dao = self.factory.get_merchandising_dao()
        return dao.update(product_dto.id, product_dto)
