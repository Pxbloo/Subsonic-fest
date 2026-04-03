import json
from pathlib import Path
from typing import List, Optional
from model.dto.UserDTO import UserDTO
from model.dao.interfaces.user_dao import FestivalDAO 

PROJECT_ROOT = Path(__file__).resolve().parents[5]
DEFAULT_DB_PATH = PROJECT_ROOT / "frontend" / "src" / "data" / "db.json"

class FakeUserDAO:
    def __init__(self, db_path: Optional[str] = None):
        self.db_path = Path(db_path) if db_path is not None else DEFAULT_DB_PATH

    def _load_raw_data(self) -> dict:
        """Lee el archivo completo para obtener el diccionario global."""
        try:
            if not self.db_path.exists():
                return {"users": []}
            with open(self.db_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {"users": []}

    def _save_raw_data(self, data: dict):
        """Guarda el diccionario global de vuelta al JSON."""
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.db_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

    def get_all(self) -> List[UserDTO]:
        """Obtiene la lista de todos los usuarios transformados a DTO."""
        raw_data = self._load_raw_data()
        users_list = raw_data.get("users", [])
        return [UserDTO.model_validate(u) for u in users_list]

    def get_by_id(self, user_id: str) -> Optional[UserDTO]:
        """Busca un usuario por su ID único."""
        users = self.get_all()
        return next((u for u in users if str(u.id) == str(user_id)), None)

    def get_by_email(self, email: str) -> Optional[UserDTO]:
        """Busca un usuario por su correo electrónico (útil para Auth)."""
        users = self.get_all()
        return next((u for u in users if u.email == email), None)

    def create(self, user: UserDTO) -> UserDTO:
        """Añade un nuevo usuario al JSON sin borrar los datos existentes."""
        data = self._load_raw_data()
        if "users" not in data:
            data["users"] = []

        data["users"].append(user.model_dump())
        self._save_raw_data(data)
        return user