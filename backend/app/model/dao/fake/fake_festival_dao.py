import json
from pathlib import Path
from typing import List, Optional
from model.dto.FestivalDTO import FestivalDTO
from model.dao.interfaces.festival_dao import FestivalDAO

## SOlo prueba con festivales, no se ha implementado el resto de DAOs, 
# pues el objetivo es pasar a firebase

# Directorio raíz del proyecto 
PROJECT_ROOT = Path(__file__).resolve().parents[5]
DEFAULT_DB_PATH = PROJECT_ROOT / "frontend" / "src" / "data" / "db.json"


class FakeFestivalDAO(FestivalDAO):
    def __init__(self, db_path: Optional[str] = None):
        self.db_path = Path(db_path) if db_path is not None else DEFAULT_DB_PATH

    def _load_data(self):
        try:
            with open(self.db_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data.get("festivals", [])
        except (FileNotFoundError, json.JSONDecodeError):
            return []

    def get_all(self) -> List[FestivalDTO]:
        raw_data = self._load_data()
        return [FestivalDTO.model_validate(f) for f in raw_data]

    def get_by_id(self, festival_id: str) -> Optional[FestivalDTO]:
        festivals = self.get_all()
        return next((f for f in festivals if f.id == festival_id), None)
    
    def create(self, festival: FestivalDTO) -> bool:
        data = self._load_raw_data()
        data.setdefault("festivals", []).append(festival.model_dump())
        self._save_raw_data(data)
        return True

    def update(self, festival_id: str, festival_dto: FestivalDTO) -> Optional[FestivalDTO]:
        data = self._load_raw_data()
        festivals = data.get("festivals", [])
        for i, f in enumerate(festivals):
            if str(f.get("id")) == str(festival_id):
                festivals[i] = festival_dto.model_dump()
                self._save_raw_data(data)
                return festival_dto
        return None

    def delete(self, festival_id: str) -> bool:
        data = self._load_raw_data()
        festivals = data.get("festivals", [])
        initial_count = len(festivals)

        data["festivals"] = [f for f in festivals if str(f.get("id")) != str(festival_id)]
        
        if len(data["festivals"]) < initial_count:
            self._save_raw_data(data)
            return True
        return False