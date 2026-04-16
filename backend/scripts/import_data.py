import json
import firebase_admin
from firebase_admin import credentials, firestore
from pathlib import Path

# Inicializar Firebase
script_dir = Path(__file__).parent
cred = credentials.Certificate(script_dir.parent / "serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Cargar el db.json del frontend
db_path = script_dir.parent.parent / "frontend" / "src" / "data" / "db.json"
with open(db_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# Subir cada colección
for collection_name, documents in data.items():
    print(f"Subiendo {collection_name}...")
    for doc in documents:
        doc_id = str(doc.get("id", doc.get("_id")))
        db.collection(collection_name).document(doc_id).set(doc)
    print(f"✓ {len(documents)} documentos subidos a '{collection_name}'")

print("¡Importación completada!")