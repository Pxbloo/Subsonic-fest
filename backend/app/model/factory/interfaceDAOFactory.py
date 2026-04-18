from abc import ABC, abstractmethod
from ..dao.interfaces.user_dao import UserDAO
from ..dao.interfaces.artist_dao import ArtistDAO
from ..dao.interfaces.blog_post_dao import BlogPostDAO
from ..dao.interfaces.festival_dao import FestivalDAO
from ..dao.interfaces.ground_dao import GroundDAO
from ..dao.interfaces.history_dao import HistoryDAO
from ..dao.interfaces.order_item_dao import OrderItemDAO
from ..dao.interfaces.merchandising_dao import MerchandisingDAO

class InterfaceDAOFactory(ABC):
    """Fábrica de interfaces DAO para la gestión de datos en la aplicación."""

    @abstractmethod
    def get_user_dao(self) -> UserDAO:
        pass

    @abstractmethod
    def get_artist_dao(self) -> ArtistDAO:
        pass

    @abstractmethod
    def get_blog_post_dao(self) -> BlogPostDAO:
        pass

    @abstractmethod
    def get_festival_dao(self) -> FestivalDAO:
        pass

    @abstractmethod
    def get_ground_dao(self) -> GroundDAO:
        pass

    @abstractmethod
    def get_history_dao(self) -> HistoryDAO:
        pass

    @abstractmethod
    def get_order_item_dao(self) -> OrderItemDAO:
        pass

    @abstractmethod
    def get_merchandising_dao(self) -> MerchandisingDAO:
        pass