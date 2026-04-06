from pathlib import Path
from typing import Optional

import firebase_admin
from firebase_admin import credentials, firestore


class FirebaseConnector:
    """Conector centralizado para inicializar y obtener la instancia de Firestore.

    Se asegura de que firebase_admin.initialize_app() solo se llame una vez
    por proceso. Si no se pasa ruta de credenciales, intenta resolver
    backend/serviceAccountKey.json relativa a este archivo.
    """

    def __init__(self, cred_path: Optional[str] = None) -> None:
        if not firebase_admin._apps:
            if cred_path is None:
                # backend/app/model/dao/firebase/firebase_connector.py
                # parents[4] -> backend/
                backend_root = Path(__file__).resolve().parents[4]
                cred_path = backend_root / "serviceAccountKey.json"
            cred = credentials.Certificate(str(cred_path))
            firebase_admin.initialize_app(cred)

        self._db = firestore.client()

    def get_db(self):
        """Devuelve el cliente de Firestore inicializado."""
        return self._db
