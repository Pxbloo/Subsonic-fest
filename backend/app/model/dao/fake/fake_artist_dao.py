import json
from pathlib import Path
from typing import List, Optional
from model.dto.ArtistDTO import ArtistDTO
from model.dao.interfaces.artist_dao import ArtistDAO

PROJECT_ROOT = Path(__file__).resolve().parents[5]
DEFAULT_DB_PATH = PROJECT_ROOT / "frontend" / "src" / "data" / "db.json"

class FakeArtistDAO(ArtistDAO):
    def __init__(self, db_path: Optional[str] = None):
        self.db_path = Path(db_path) if db_path is not None else DEFAULT_DB_PATH

    def _load_raw_data(self) -> dict:
        try:
            if not self.db_path.exists(): return {"artists": []}
            with open(self.db_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {"artists": []}

    def _save_raw_data(self, data: dict):
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.db_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

    def get_all(self) -> List[ArtistDTO]:
        raw_data = self._load_raw_data()
        return [ArtistDTO.model_validate(a) for a in raw_data.get("artists", [])]

    def get_by_id(self, artist_id: str) -> Optional[ArtistDTO]:
        artists = self.get_all()
        return next((a for a in artists if str(a.id) == str(artist_id)), None)

    def create(self, artist: ArtistDTO) -> ArtistDTO:
        data = self._load_raw_data()
        data.setdefault("artists", []).append(artist.model_dump())
        self._save_raw_data(data)
        return artist