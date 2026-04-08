from .interfaceDAOFactory import InterfaceDAOFactory
from ..dao.firebase.firebase_festival_dao import FirebaseFestivalDAO
from ..dao.firebase.firebase_user_dao import FirebaseUserDAO
from ..dao.firebase.firebase_artist_dao import FirebaseArtistDAO
from ..dao.firebase.firebase_blog_dao import FirebaseBlogDAO
from ..dao.firebase.firebase_grounds_dao import FirebaseGroundDAO
from ..dao.firebase.firebase_history_dao import FirebaseHistoryDAO
from ..dao.firebase.firebase_merchandising_dao import FirebaseMerchansidingDAO


class FirebaseDAOFactory(InterfaceDAOFactory):

    def get_festival_dao(self) -> FirebaseFestivalDAO:
        return FirebaseFestivalDAO()

    def get_user_dao(self) -> FirebaseUserDAO:
        return FirebaseUserDAO()

    def get_artist_dao(self) -> FirebaseArtistDAO:
        return FirebaseArtistDAO()

    def get_blog_post_dao(self) -> FirebaseBlogDAO:
        return FirebaseBlogDAO()

    def get_ground_dao(self) -> FirebaseGroundDAO:
        return FirebaseGroundDAO()

    def get_history_dao(self) -> FirebaseHistoryDAO:
        return FirebaseHistoryDAO()

    def get_merchandising_dao(self):
        return FirebaseMerchansidingDAO()