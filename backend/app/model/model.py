from model.factory.fakeDAOFactory import FakeDAOFactory

class SubsonicModel:
    def __init__(self):
        # Aqui se elige que fábrica usar
        self.factory = FakeDAOFactory("db.json")

    def listar_festivales(self):
        dao = self.factory.get_festival_dao()
        return dao.get_all()

    def buscar_festival(self, id: str):
        dao = self.factory.get_festival_dao()
        return dao.get_by_id(id)