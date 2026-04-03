from model.factory.interfaceDAOFactory import InterfaceDAOFacrtory
from model.dao.fake.fake_festival_dao import FakeFestivalDAO

class FakeDAoFactory(InterfaceDAOFacrtory):
    """Fábrica de DAOs falsos para pruebas y desarrollo."""

    def __init__(self, db_path: str = "../../../../frontend/src/data/db.json"):
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
    def get_merchandising_dao(self):
        raise NotImplementedError("Fake MerchandisingDAO no implementado")

    def get_festival_dao(self) -> FakeFestivalDAO:
        return FakeFestivalDAO(self.db_path)