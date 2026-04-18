from .interfaceDAOFactory import InterfaceDAOFactory
from ..dao.fake.fake_festival_dao import FakeFestivalDAO
from ..dao.fake.fake_order_item_dao import FakeOrderItemDAO


class FakeDAOFactory(InterfaceDAOFactory):
    """Fábrica de DAOs falsos para pruebas y desarrollo.

    Si no se proporciona db_path, cada DAO usará su ruta por defecto
    (db.json del frontend).
    """

    def __init__(self, db_path: str | None = None):
        self.db_path = db_path

    def get_user_dao(self):
        raise NotImplementedError("Fake UserDAO no implementado")
    def get_artist_dao(self):
        raise NotImplementedError("Fake ArtistDAO no implementado")
    def get_blog_post_dao(self):
        raise NotImplementedError("Fake BlogPostDAO no implementado")
    def get_ground_dao(self):
        raise NotImplementedError("Fake GroundDAO no implementado")
    def get_history_dao(self):
        raise NotImplementedError("Fake HistoryDAO no implementado")
    def get_order_item_dao(self):
        return FakeOrderItemDAO(self.db_path)
    def get_merchandising_dao(self):
        raise NotImplementedError("Fake MerchandisingDAO no implementado")

    def get_festival_dao(self) -> FakeFestivalDAO:
        # Si self.db_path es None, FakeFestivalDAO usará su DEFAULT_DB_PATH
        return FakeFestivalDAO(self.db_path)