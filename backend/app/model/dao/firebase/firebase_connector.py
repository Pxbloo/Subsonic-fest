import os
import logging
from pathlib import Path
from typing import Optional

import firebase_admin
from firebase_admin import credentials, firestore, get_app
from google.cloud.firestore import Client

logger = logging.getLogger(__name__)


class FirebaseConnector:
    _db: Optional[Client] = None

    @classmethod
    def get_db(cls) -> Client:
        if cls._db is None:
            cls._initialize()
        return cls._db

    @classmethod
    def _initialize(cls):
        try:
            get_app()
        except ValueError:
            cred_path = cls._resolve_cred_path()

            if not cred_path.exists():
                raise FileNotFoundError(
                    f"No se encontró credencial Firebase en {cred_path}"
                )

            cred = credentials.Certificate(str(cred_path))
            firebase_admin.initialize_app(cred)
            logger.info("Firebase inicializado")

        cls._db = firestore.client()

    @staticmethod
    def _resolve_cred_path() -> Path:
        env_path = os.getenv("FIREBASE_CREDENTIALS")
        if env_path:
            return Path(env_path)

        return Path(__file__).resolve().parents[4] / "serviceAccountKey.json"