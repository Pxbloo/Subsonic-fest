import os
import logging
from pathlib import Path
from typing import Optional

import firebase_admin
from firebase_admin import credentials, firestore, get_app
from google.cloud.firestore import Client
from firebase_admin import auth

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
    
    def verify_token(self, token: str):
        """
        // TODO hacer asíncrona
        Se comunica con los servidores de Google para validar el ID Token.
        Retorna un diccionario con la información del usuario (uid, email, etc.)
        """
        try:
            decoded_token = auth.verify_id_token(token, clock_skew_seconds=3)
            return decoded_token
        except Exception as e:
            print(f"Error al verificar el token de OAuth: {e}")
            return None