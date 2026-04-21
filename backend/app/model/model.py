import os
from typing import Optional
from .factory.fakeDAOFactory import FakeDAOFactory
from .factory.firebaseDAOFactory import FirebaseDAOFactory
from .dao.firebase.firebase_connector import FirebaseConnector
from .dto.UserDTO import UserDTO, AddressDTO
from .dto.OrderItemDTO import OrderItemDTO
from .dto.TicketTemplateDTO import TicketTemplateDTO


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

        if user_dto:
            return user_dto

        provider = user_info.get("firebase", {}).get("sign_in_provider", "")
        if provider == "google.com":
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

        return None

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

    def listar_usuario_por_email(self, email: str):
        user_dao = self.factory.get_user_dao()
        return user_dao.get_by_email(email)

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
    
    def listar_festivales_por_artista(self, artist_id: str):
        """Devuelve los festivales que contienen al artista en el lineup."""
        artist = self.listar_artista_por_id(artist_id)
        if not artist:
            return None

        artist_id_str = str(artist_id)
        return [
            festival
            for festival in self.listar_festivales()
            if any(
                str(item.get("id") if isinstance(item, dict) else getattr(item, "id", ""))
                == artist_id_str
                for item in (getattr(festival, "lineup", []) or [])
            )
        ]

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
        """Devuelve artistas asociados a un festival."""
        festival = self.listar_festival_por_id(festival_id)
        if not festival:
            return []

        lineup_ids = {
            str(item.get("id") if isinstance(item, dict) else getattr(item, "id", ""))
            for item in (getattr(festival, "lineup", []) or [])
        }

        if not lineup_ids:
            return []

        return [
            artist
            for artist in self.listar_artistas()
            if str(getattr(artist, "id", "")) in lineup_ids
        ]

    # === Ticket templates ===
    @staticmethod
    def _ticket_value(ticket, key, default=None):
        if isinstance(ticket, dict):
            return ticket.get(key, default)
        return getattr(ticket, key, default)

    @staticmethod
    def _template_signature(template: dict) -> tuple[str, float, tuple[str, ...]]:
        return (
            template["name"],
            template["price"],
            tuple(template["features"]),
        )

    @staticmethod
    def _normalize_ticket_template(raw_template: dict) -> Optional[dict]:
        if not isinstance(raw_template, dict):
            return None

        name = raw_template.get("name")
        if not name:
            return None

        raw_features = raw_template.get("features")
        features = raw_features if isinstance(raw_features, list) else []

        try:
            price = float(raw_template.get("price", 0))
        except (TypeError, ValueError):
            price = 0.0

        template_id = raw_template.get("id")
        if not template_id:
            normalized_name = str(name).strip().lower().replace(" ", "-")
            template_id = f"{normalized_name}-{price}"

        return {
            "id": str(template_id),
            "name": name,
            "features": features,
            "price": price,
        }

    def _build_ticket_templates_from_festivals(self) -> list[dict]:
        templates: dict[tuple[str, float, tuple[str, ...]], dict] = {}

        for festival in self.listar_festivales() or []:
            tickets = getattr(festival, "tickets", []) or []
            for index, ticket in enumerate(tickets):
                name = self._ticket_value(ticket, "name")
                if not name:
                    continue

                raw_price = self._ticket_value(ticket, "price", 0)
                try:
                    price = float(raw_price or 0)
                except (TypeError, ValueError):
                    price = 0.0

                raw_features = self._ticket_value(ticket, "features", [])
                features = list(raw_features) if isinstance(raw_features, list) else []

                key = (name, price, tuple(features))
                if key in templates:
                    continue

                ticket_id = self._ticket_value(ticket, "id")
                if not ticket_id:
                    normalized_name = str(name).strip().lower().replace(" ", "-")
                    ticket_id = f"{normalized_name}-{price}-{index}"

                templates[key] = {
                    "id": str(ticket_id),
                    "name": name,
                    "features": features,
                    "price": price,
                }

        return list(templates.values())

    def listar_ticket_templates(self) -> list[dict]:
        dao = self.factory.get_ticket_template_dao()
        raw_templates: list[dict] = []

        raw_templates.extend(item.model_dump() for item in dao.get_all())

        raw_templates.extend(self._build_ticket_templates_from_festivals())
        by_signature: dict[tuple[str, float, tuple[str, ...]], dict] = {}

        for item in raw_templates:
            normalized = self._normalize_ticket_template(item)
            if not normalized:
                continue
            signature = self._template_signature(normalized)
            if signature not in by_signature:
                by_signature[signature] = normalized

        return list(by_signature.values())

    def listar_ticket_template_por_id(self, template_id: str):
        dao = self.factory.get_ticket_template_dao()
        return dao.get_by_id(template_id)

    def crear_ticket_template(self, template_dto: TicketTemplateDTO):
        dao = self.factory.get_ticket_template_dao()
        return dao.create(template_dto)

    def actualizar_ticket_template(self, template_dto: TicketTemplateDTO):
        if not template_dto.id:
            return False
        dao = self.factory.get_ticket_template_dao()
        return dao.update(template_dto.id, template_dto)

    def eliminar_ticket_template(self, template_id: str):
        dao = self.factory.get_ticket_template_dao()
        return dao.delete(template_id)

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

    # === Favoritos ===
    def obtener_favoritos_usuario(self, user_id: str):
        """Devuelve los favoritos de un usuario."""
        dao = self.factory.get_favorites_dao()
        return dao.get_by_user_id(user_id)

    def agregar_artista_favorito(self, user_id: str, artist_id: str):
        """Agrega un artista a los favoritos del usuario."""
        dao = self.factory.get_favorites_dao()
        return dao.add_favorite_artist(user_id, artist_id)

    def eliminar_artista_favorito(self, user_id: str, artist_id: str):
        """Elimina un artista de los favoritos del usuario."""
        dao = self.factory.get_favorites_dao()
        return dao.remove_favorite_artist(user_id, artist_id)

    def agregar_festival_favorito(self, user_id: str, festival_id: str):
        """Agrega un festival a los favoritos del usuario."""
        dao = self.factory.get_favorites_dao()
        return dao.add_favorite_festival(user_id, festival_id)

    def eliminar_festival_favorito(self, user_id: str, festival_id: str):
        """Elimina un festival de los favoritos del usuario."""
        dao = self.factory.get_favorites_dao()
        return dao.remove_favorite_festival(user_id, festival_id)

    def agregar_producto_favorito(self, user_id: str, product_id: str):
        """Agrega un producto a los favoritos del usuario."""
        dao = self.factory.get_favorites_dao()
        return dao.add_favorite_product(user_id, product_id)

    def eliminar_producto_favorito(self, user_id: str, product_id: str):
        """Elimina un producto de los favoritos del usuario."""
        dao = self.factory.get_favorites_dao()
        return dao.remove_favorite_product(user_id, product_id)

    def es_artista_favorito(self, user_id: str, artist_id: str) -> bool:
        """Verifica si un artista está en los favoritos del usuario."""
        dao = self.factory.get_favorites_dao()
        return dao.is_artist_favorite(user_id, artist_id)

    def es_festival_favorito(self, user_id: str, festival_id: str) -> bool:
        """Verifica si un festival está en los favoritos del usuario."""
        dao = self.factory.get_favorites_dao()
        return dao.is_festival_favorite(user_id, festival_id)

    def es_producto_favorito(self, user_id: str, product_id: str) -> bool:
        """Verifica si un producto está en los favoritos del usuario."""
        dao = self.factory.get_favorites_dao()
        return dao.is_product_favorite(user_id, product_id)
