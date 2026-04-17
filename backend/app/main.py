from fastapi import FastAPI
from .model.model import SubsonicModel
from .model.dto.UserDTO import UserDTO
from .model.dto.ArtistDTO import ArtistDTO
from .model.dto.FestivalDTO import FestivalDTO
from .model.dto.GroundDTO import GroundDTO
from .model.dto.BlogPostDTO import BlogPostDTO
from .model.dto.MerchandisingDTO import MerchandisingDTO
from .model.dto.HistoryDTO import HistoryDTO
from fastapi import Depends, Header, HTTPException
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware

import firebase_admin
from firebase_admin import credentials, auth

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = SubsonicModel()


async def get_current_user(authorization: Optional[str] = Header(None)) -> UserDTO:
    """Dependencia reutilizable para obtener el usuario autenticado.

    Valida el header Authorization: Bearer <token> usando el modelo de dominio.
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Token no encontrado.")

    try:
        scheme, token = authorization.split(" ", 1)
    except ValueError:
        raise HTTPException(status_code=401, detail="Formato de cabecera Authorization inválido")

    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=401, detail="Formato de token inválido")

    user = await model.verificar_token_oauth(token)
    if not user:
        raise HTTPException(status_code=401, detail="Token inválido o usuario no encontrado")

    return user

@app.get("/api/auth/verify")
async def verify_user(authorization: Optional[str] = Header(None)):
    """
    Endpoint para verificar la identidad del usuario mediante OAuth.
    Espera un token en la cabecera: 'Authorization: Bearer <token>'
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="No se proporcionó token de autorización")

    try:
        token = authorization.split(" ")[1]
    except IndexError:
        raise HTTPException(status_code=401, detail="Formato de token inválido")
    user = await model.verificar_token_oauth(token)

    if not user:
        raise HTTPException(status_code=401, detail="Token inválido o usuario no encontrado")

    return user

# Endpoints de artistas
@app.get("/api/artists")
async def get_artists():
    """Endpoint público para obtener todos los artistas."""
    artists = model.listar_artistas()
    return artists

@app.post("/api/artists")
async def create_artist(artist: ArtistDTO, current_user: UserDTO = Depends(get_current_user)):
    """Endpoint protegido para crear un nuevo artista."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Permiso denegado")

    success = model.crear_artista(artist)
    if not success:
        raise HTTPException(status_code=400, detail="Error al crear el artista")
    return artist

@app.put("/api/artists/{artist_id}")
async def update_artist(artist_id: str, artist: ArtistDTO, current_user: UserDTO = Depends(get_current_user)):
    """Endpoint protegido para actualizar un artista específico."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Permiso denegado")

    existing_artist = model.listar_artista_por_id(artist_id)
    if not existing_artist:
        raise HTTPException(status_code=404, detail="Artista no encontrado")

    artist.id = artist_id 
    success = model.actualizar_artista(artist)
    if not success:
        raise HTTPException(status_code=400, detail="Error al actualizar el artista")
    return artist

@app.delete("/api/artists/{artist_id}")
async def delete_artist(artist_id: str, current_user: UserDTO = Depends(get_current_user)):
    """Endpoint protegido para eliminar un artista específico."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Permiso denegado")

    existing_artist = model.listar_artista_por_id(artist_id)
    if not existing_artist:
        raise HTTPException(status_code=404, detail="Artista no encontrado")

    success = model.eliminar_artista(artist_id)
    if not success:
        raise HTTPException(status_code=400, detail="Error al eliminar el artista")
    return {"detail": "Artista eliminado exitosamente"}

@app.get("/api/artists/{artist_id}")
async def get_artist(artist_id: str):
    """Endpoint público para obtener un artista específico."""
    artist = model.listar_artista_por_id(artist_id)
    if not artist:
        raise HTTPException(status_code=404, detail="Artista no encontrado")
    return artist

# Endpoints de usuarios
@app.post("/api/users") 
async def create_user(user: UserDTO):
    success = model.crear_usuario(user)
    if not success:
        raise HTTPException(status_code=400, detail="Error al crear el usuario")
    return user

@app.get("/api/users")
async def get_users():
    """Endpoint público para obtener todos los usuarios."""
    users = model.listar_usuarios()
    return users

@app.get("/api/users/{user_id}")
async def get_user(user_id: str):
    """Endpoint público para obtener un usuario específico."""
    user = model.listar_usuario_por_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

@app.put("/api/users/{user_id}")
async def update_user(user_id: str, user: UserDTO, current_user: UserDTO = Depends(get_current_user)):
    """Endpoint protegido para actualizar un usuario específico."""
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Permiso denegado")
    existing_user = model.listar_usuario_por_id(user_id)
    if not existing_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    user.id = user_id 
    success = model.actualizar_usuario(user)
    if not success:
        raise HTTPException(status_code=400, detail="Error al actualizar el usuario")
    return user

@app.put("/api/users/admin-password-reset/{user_id}")
async def update_user_password(user_id: str, payload: dict, current_user: UserDTO = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Permiso denegado")

    existing_user = model.listar_usuario_por_id(user_id)
    if not existing_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    new_password = payload.get("new_password")
    if not new_password:
        raise HTTPException(status_code=422, detail="new_password is required")

    try:
        auth.update_user(user_id, password=new_password)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error updating Auth password: {str(e)}")

    return {"detail": "Password updated successfully"}


@app.delete("/api/users/{user_id}")
async def delete_user(user_id: str):
    """Endpoint protegido para eliminar un usuario específico."""
    existing_user = model.listar_usuario_por_id(user_id)
    if not existing_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    success = model.eliminar_usuario(user_id)
    if not success:
        raise HTTPException(status_code=400, detail="Error al eliminar el usuario")
    return {"detail": "Usuario eliminado exitosamente"}

# Endpoints de festivales
@app.get("/api/festivals")
async def get_festivals():
    festivales = model.listar_festivales()
    return festivales 

@app.get("/api/festivals/{festival_id}")
async def get_festival(festival_id: str):
    """Endpoint público para obtener un festiva l específico."""
    festival = model.listar_festival_por_id(festival_id)
    if not festival:
        raise HTTPException(status_code=404, detail="Festival no encontrado")
    return festival

@app.post("/api/festivals")
async def create_festival(festival: FestivalDTO, current_user: UserDTO = Depends(get_current_user)):
    """Endpoint protegido para crear un nuevo festival."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Permiso denegado")

    success = model.crear_festival(festival)
    if not success:
        raise HTTPException(status_code=400, detail="Error al crear el festival")
    return festival

@app.put("/api/festivals/{festival_id}")
async def update_festival(festival_id: str, festival: FestivalDTO, current_user: UserDTO = Depends(get_current_user)):
    """Endpoint protegido para actualizar un festival específico."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Permiso denegado")

    existing_festival = model.listar_festival_por_id(festival_id)
    if not existing_festival:
        raise HTTPException(status_code=404, detail="Festival no encontrado")

    festival.id = festival_id 
    success = model.actualizar_festival(festival)
    if not success:
        raise HTTPException(status_code=400, detail="Error al actualizar el festival")
    return festival

@app.delete("/api/festivals/{festival_id}")
async def delete_festival(festival_id: str, current_user: UserDTO = Depends(get_current_user)): 
    """Endpoint protegido para eliminar un festival específico."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Permiso denegado")

    existing_festival = model.listar_festival_por_id(festival_id)
    if not existing_festival:
        raise HTTPException(status_code=404, detail="Festival no encontrado")

    success = model.eliminar_festival(festival_id)
    if not success:
        raise HTTPException(status_code=400, detail="Error al eliminar el festival")
    return {"detail": "Festival eliminado exitosamente"}

@app.get("/api/festivals/{festival_id}/artists")
async def get_festival_artists(festival_id: str):
    """Endpoint público para obtener los artistas de un festival específico."""
    festival = model.listar_festival_por_id(festival_id)
    if not festival:
        raise HTTPException(status_code=404, detail="Festival no encontrado")
    artists = model.listar_artistas_por_festival(festival_id)
    return artists

# Endpoints de recintos (grounds)
@app.get("/api/grounds")
async def get_grounds():
    """Endpoint público para obtener todos los recintos (grounds)."""
    grounds = model.listar_grounds()
    return grounds

@app.post("/api/grounds")
async def create_ground(ground: GroundDTO, current_user: UserDTO = Depends(get_current_user)):
    if current_user.role not in ["admin", "provider"]:
        raise HTTPException(status_code=403, detail="Solo administradores o proveedores pueden crear recintos")
    success = model.crear_recinto(ground)
    return ground

@app.delete("/api/grounds/{ground_id}")
async def delete_ground(ground_id: str, current_user: UserDTO = Depends(get_current_user)):
    if current_user.role not in ["admin", "provider"]:
        raise HTTPException(status_code=403, detail="Solo administradores o proveedores pueden eliminar recintos")
    model.eliminar_recinto(ground_id)
    return {"detail": "Recinto eliminado"}

# Endpoints de blogs
@app.get("/api/blogPosts")
async def get_blog_posts():
    """Endpoint público para obtener todas las entradas del blog."""
    posts = model.listar_blog_posts()
    return posts

@app.get("/api/blogPosts/{post_id}")
async def get_blog_post(post_id: str):
    """Endpoint público para obtener una entrada del blog específica."""
    post = model.listar_blog_post_por_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Entrada del blog no encontrada")
    return post

@app.post("/api/blogPosts")
async def create_blog_post(post: BlogPostDTO, current_user: UserDTO = Depends(get_current_user)):
    """Endpoint protegido para crear una nueva entrada del blog."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Permiso denegado")

    success = model.crear_blog_post(post)
    if not success:
        raise HTTPException(status_code=400, detail="Error al crear la entrada del blog")
    return post

@app.put("/api/blogPosts/{post_id}")
async def update_blog_post(post_id: str, post: BlogPostDTO, current_user: UserDTO = Depends(get_current_user)):
    """Endpoint protegido para actualizar una entrada del blog específica."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Permiso denegado")

    existing_post = model.listar_blog_post_por_id(post_id)
    if not existing_post:
        raise HTTPException(status_code=404, detail="Entrada del blog no encontrada")

    post.id = post_id 
    success = model.actualizar_blog_post(post)
    if not success:
        raise HTTPException(status_code=400, detail="Error al actualizar la entrada del blog")
    return post

@app.delete("/api/blogPosts/{post_id}")
async def delete_blog_post(post_id: str, current_user: UserDTO = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Permiso denegado")
    model.eliminar_blog_post(post_id)
    return {"detail": "Entrada de blog eliminada"}

# Endpoints de historial
@app.get("/api/history")
async def get_history(current_user: UserDTO = Depends(get_current_user)):
    """Endpoint protegido que devuelve el historial del usuario autenticado."""
    history_items = model.listar_historial_por_usuario(current_user.id)
    return history_items

# Endpoints de merchandising
@app.get("/api/merchandising")  
async def get_merchandising():
    """Endpoint público para obtener todos los productos de merchandising."""
    products = model.listar_merchandising()
    return products

@app.post("/api/merchandising")
async def create_merchandising(product: MerchandisingDTO, current_user: UserDTO = Depends(get_current_user)):
    """Endpoint protegido para crear un nuevo producto de merchandising."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Permiso denegado")

    success = model.crear_merchandising(product)
    if not success:
        raise HTTPException(status_code=400, detail="Error al crear el producto de merchandising")
    return product

@app.put("/api/merchandising/{product_id}")
async def update_merchandising(product_id: str, product: MerchandisingDTO, current_user: UserDTO = Depends(get_current_user)):
    """Endpoint protegido para actualizar un producto de merchandising específico."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Permiso denegado")

    existing_product = model.listar_merchandising_por_id(product_id)
    if not existing_product:
        raise HTTPException(status_code=404, detail="Producto de merchandising no encontrado")

    product.id = product_id 
    success = model.actualizar_merchandising(product)
    if not success:
        raise HTTPException(status_code=400, detail="Error al actualizar el producto de merchandising")
    return product

@app.delete("/api/merchandising/{product_id}")
async def delete_merchandising(product_id: str, current_user: UserDTO = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Permiso denegado")
    model.eliminar_merchandising(product_id)
    return {"detail": "Producto eliminado"}