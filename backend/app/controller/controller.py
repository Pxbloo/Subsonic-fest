import os
from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4

import stripe
from fastapi import APIRouter, Depends, Header, HTTPException, Request
from pydantic import BaseModel, Field

from ..model.dto.ArtistDTO import ArtistDTO
from ..model.dto.BlogPostDTO import BlogPostDTO
from ..model.dto.FestivalDTO import FestivalDTO
from ..model.dto.GroundDTO import GroundDTO
from ..model.dto.MerchandisingDTO import MerchandisingDTO
from ..model.dto.OrderItemDTO import OrderItemDTO
from ..model.dto.TicketTemplateDTO import TicketTemplateDTO
from ..model.dto.UserDTO import UserDTO
from ..model.model import SubsonicModel


router = APIRouter()
model = SubsonicModel()

FRONTEND_URL = os.getenv("FRONTEND_URL", "").rstrip("/")


class StripeCheckoutRequest(BaseModel):
	order_id: str = Field(min_length=1)
	total_amount: Optional[float] = Field(default=None, gt=0)
	user_id: Optional[str] = None
	source: str = "checkout"
	action: str = "create"


def _now_iso() -> str:
	return datetime.now(timezone.utc).isoformat()


def _build_order_payload(payload: StripeCheckoutRequest, status: str) -> OrderItemDTO:
	return OrderItemDTO(
		id=payload.order_id,
		user_id=payload.user_id,
		title="Pedido en Subsonic Festival",
		amount=float(payload.total_amount or 0),
		status=status,
		payment_method="stripe_test",
		source=payload.source,
		created_at=_now_iso(),
		updated_at=_now_iso(),
		currency="EUR",
	)


def _resolve_frontend_url(request: Request) -> str:
	if FRONTEND_URL:
		return FRONTEND_URL

	forwarded_proto = request.headers.get("x-forwarded-proto")
	forwarded_host = request.headers.get("x-forwarded-host")

	if forwarded_host:
		scheme = forwarded_proto or request.url.scheme
		return f"{scheme}://{forwarded_host}".rstrip("/")

	return str(request.base_url).rstrip("/")


def _ensure_admin(current_user: UserDTO) -> None:
	if current_user.role != "admin":
		raise HTTPException(status_code=403, detail="Permiso denegado")


async def get_current_user(authorization: Optional[str] = Header(None)) -> UserDTO:
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


@router.get("/api/auth/verify")
async def verify_user(authorization: Optional[str] = Header(None)):
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


@router.get("/api/artists")
async def get_artists():
	return model.listar_artistas()


@router.post("/api/artists")
async def create_artist(artist: ArtistDTO, current_user: UserDTO = Depends(get_current_user)):
	if current_user.role != "admin":
		raise HTTPException(status_code=403, detail="Permiso denegado")

	artist.id = str(uuid4())

	success = model.crear_artista(artist)
	if not success:
		raise HTTPException(status_code=400, detail="Error al crear el artista")
	return artist


@router.put("/api/artists/{artist_id}")
async def update_artist(artist_id: str, artist: ArtistDTO, current_user: UserDTO = Depends(get_current_user)):
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


@router.delete("/api/artists/{artist_id}")
async def delete_artist(artist_id: str, current_user: UserDTO = Depends(get_current_user)):
	if current_user.role != "admin":
		raise HTTPException(status_code=403, detail="Permiso denegado")

	existing_artist = model.listar_artista_por_id(artist_id)
	if not existing_artist:
		raise HTTPException(status_code=404, detail="Artista no encontrado")

	success = model.eliminar_artista(artist_id)
	if not success:
		raise HTTPException(status_code=400, detail="Error al eliminar el artista")
	return {"detail": "Artista eliminado exitosamente"}


@router.get("/api/artists/{artist_id}")
async def get_artist(artist_id: str):
	artist = model.listar_artista_por_id(artist_id)
	if not artist:
		raise HTTPException(status_code=404, detail="Artista no encontrado")
	return artist


@router.get("/api/artists/{artist_id}/festivals")
async def get_artist_festivals(artist_id: str):
	festivals = model.listar_festivales_por_artista(artist_id)
	if festivals is None:
		raise HTTPException(status_code=404, detail="Artista no encontrado")
	return festivals


@router.post("/api/users")
async def create_user(user: UserDTO):
	existing_user = model.listar_usuario_por_email(user.email)
	if existing_user:
		raise HTTPException(status_code=409, detail="Existe un usuario registrado con este correo")

	success = model.crear_usuario(user)
	if not success:
		raise HTTPException(status_code=400, detail="Error al crear el usuario")
	return user


@router.get("/api/users")
async def get_users():
	return model.listar_usuarios()


@router.get("/api/users/{user_id}")
async def get_user(user_id: str):
	user = model.listar_usuario_por_id(user_id)
	if not user:
		raise HTTPException(status_code=404, detail="Usuario no encontrado")
	return user


@router.put("/api/users/{user_id}")
async def update_user(user_id: str, user: UserDTO, current_user: UserDTO = Depends(get_current_user)):
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


@router.put("/api/users/admin-password-reset/{user_id}")
async def update_user_password(user_id: str, payload: dict, current_user: UserDTO = Depends(get_current_user)):
	if current_user.role != "admin":
		raise HTTPException(status_code=403, detail="Permiso denegado")

	existing_user = model.listar_usuario_por_id(user_id)
	if not existing_user:
		raise HTTPException(status_code=404, detail="Usuario no encontrado")

	new_password = payload.get("new_password")
	if not new_password:
		raise HTTPException(status_code=422, detail="new_password is required")

	from firebase_admin import auth

	try:
		auth.update_user(user_id, password=new_password)
	except Exception as exc:
		raise HTTPException(status_code=400, detail=f"Error updating Auth password: {str(exc)}")

	return {"detail": "Password updated successfully"}


@router.delete("/api/users/{user_id}")
async def delete_user(user_id: str):
	existing_user = model.listar_usuario_por_id(user_id)
	if not existing_user:
		raise HTTPException(status_code=404, detail="Usuario no encontrado")

	success = model.eliminar_usuario(user_id)
	if not success:
		raise HTTPException(status_code=400, detail="Error al eliminar el usuario")
	return {"detail": "Usuario eliminado exitosamente"}


@router.get("/api/festivals")
async def get_festivals():
	return model.listar_festivales()


@router.get("/api/festivals/{festival_id}")
async def get_festival(festival_id: str):
	festival = model.listar_festival_por_id(festival_id)
	if not festival:
		raise HTTPException(status_code=404, detail="Festival no encontrado")
	return festival


@router.post("/api/festivals")
async def create_festival(festival: FestivalDTO, current_user: UserDTO = Depends(get_current_user)):
	if current_user.role != "admin":
		raise HTTPException(status_code=403, detail="Permiso denegado")

	festival.id = str(uuid4())

	success = model.crear_festival(festival)
	if not success:
		raise HTTPException(status_code=400, detail="Error al crear el festival")
	return festival


@router.put("/api/festivals/{festival_id}")
async def update_festival(festival_id: str, festival: FestivalDTO, current_user: UserDTO = Depends(get_current_user)):
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


@router.delete("/api/festivals/{festival_id}")
async def delete_festival(festival_id: str, current_user: UserDTO = Depends(get_current_user)):
	if current_user.role != "admin":
		raise HTTPException(status_code=403, detail="Permiso denegado")

	existing_festival = model.listar_festival_por_id(festival_id)
	if not existing_festival:
		raise HTTPException(status_code=404, detail="Festival no encontrado")

	success = model.eliminar_festival(festival_id)
	if not success:
		raise HTTPException(status_code=400, detail="Error al eliminar el festival")
	return {"detail": "Festival eliminado exitosamente"}


@router.get("/api/festivals/{festival_id}/artists")
async def get_festival_artists(festival_id: str):
	festival = model.listar_festival_por_id(festival_id)
	if not festival:
		raise HTTPException(status_code=404, detail="Festival no encontrado")
	return model.listar_artistas_por_festival(festival_id)


@router.get("/api/ticketTemplates")
async def get_ticket_templates():
	return model.listar_ticket_templates()


@router.post("/api/ticketTemplates")
async def create_ticket_template(template: TicketTemplateDTO, current_user: UserDTO = Depends(get_current_user)):
	_ensure_admin(current_user)
	template.id = str(uuid4())
	success = model.crear_ticket_template(template)
	if not success:
		raise HTTPException(status_code=400, detail="Error al crear plantilla de entrada")
	return template


@router.put("/api/ticketTemplates/{template_id}")
async def update_ticket_template(template_id: str, template: TicketTemplateDTO, current_user: UserDTO = Depends(get_current_user)):
	_ensure_admin(current_user)
	existing_template = model.listar_ticket_template_por_id(template_id)
	if not existing_template:
		raise HTTPException(status_code=404, detail="Plantilla de entrada no encontrada")

	template.id = template_id
	success = model.actualizar_ticket_template(template)
	if not success:
		raise HTTPException(status_code=400, detail="Error al actualizar plantilla de entrada")
	return template


@router.delete("/api/ticketTemplates/{template_id}")
async def delete_ticket_template(template_id: str, current_user: UserDTO = Depends(get_current_user)):
	_ensure_admin(current_user)
	existing_template = model.listar_ticket_template_por_id(template_id)
	if not existing_template:
		raise HTTPException(status_code=404, detail="Plantilla de entrada no encontrada")

	success = model.eliminar_ticket_template(template_id)
	if not success:
		raise HTTPException(status_code=400, detail="Error al eliminar plantilla de entrada")
	return {"detail": "Plantilla eliminada"}


@router.get("/api/grounds")
async def get_grounds():
	return model.listar_grounds()


@router.post("/api/grounds")
async def create_ground(ground: GroundDTO, current_user: UserDTO = Depends(get_current_user)):
	if current_user.role not in ["admin", "provider"]:
		raise HTTPException(status_code=403, detail="Solo administradores o proveedores pueden crear recintos")

	ground.id = str(uuid4())

	model.crear_recinto(ground)
	return ground


@router.put("/api/grounds/{ground_id}")
async def update_ground(ground_id: str, ground: GroundDTO, current_user: UserDTO = Depends(get_current_user)):
	if current_user.role not in ["admin", "provider"]:
		raise HTTPException(status_code=403, detail="Solo administradores o proveedores pueden actualizar recintos")

	ground.id = ground_id
	success = model.actualizar_recinto(ground)
	if not success:
		raise HTTPException(status_code=404, detail="Recinto no encontrado")
	return ground


@router.delete("/api/grounds/{ground_id}")
async def delete_ground(ground_id: str, current_user: UserDTO = Depends(get_current_user)):
	if current_user.role not in ["admin", "provider"]:
		raise HTTPException(status_code=403, detail="Solo administradores o proveedores pueden eliminar recintos")
	model.eliminar_recinto(ground_id)
	return {"detail": "Recinto eliminado"}


@router.get("/api/blogPosts")
async def get_blog_posts():
	return model.listar_blog_posts()


@router.get("/api/blogPosts/{post_id}")
async def get_blog_post(post_id: str):
	post = model.listar_blog_post_por_id(post_id)
	if not post:
		raise HTTPException(status_code=404, detail="Entrada del blog no encontrada")
	return post


@router.post("/api/blogPosts")
async def create_blog_post(post: BlogPostDTO, current_user: UserDTO = Depends(get_current_user)):
	if current_user.role != "admin":
		raise HTTPException(status_code=403, detail="Permiso denegado")

	success = model.crear_blog_post(post)
	if not success:
		raise HTTPException(status_code=400, detail="Error al crear la entrada del blog")
	return post


@router.put("/api/blogPosts/{post_id}")
async def update_blog_post(post_id: str, post: BlogPostDTO, current_user: UserDTO = Depends(get_current_user)):
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


@router.delete("/api/blogPosts/{post_id}")
async def delete_blog_post(post_id: str, current_user: UserDTO = Depends(get_current_user)):
	if current_user.role != "admin":
		raise HTTPException(status_code=403, detail="Permiso denegado")
	model.eliminar_blog_post(post_id)
	return {"detail": "Entrada de blog eliminada"}


@router.get("/api/history")
async def get_history(current_user: UserDTO = Depends(get_current_user)):
	return model.listar_historial_por_usuario(current_user.id)


@router.get("/api/orderItems")
async def get_order_items(user_id: Optional[str] = None):
	if user_id:
		return model.listar_pedidos_por_usuario(user_id)
	return model.listar_pedidos()


@router.post("/api/checkout-stripe")
async def checkout_stripe(payload: StripeCheckoutRequest, request: Request):
	action = payload.action.lower()

	if action == "confirm":
		existing_order = model.listar_pedido_por_id(payload.order_id)
		if not existing_order:
			raise HTTPException(status_code=404, detail="Pedido no encontrado")

		existing_order.status = "paid_test"
		existing_order.payment_method = "stripe_test"
		existing_order.updated_at = _now_iso()
		model.actualizar_pedido(existing_order)
		return existing_order

	if payload.total_amount is None:
		raise HTTPException(status_code=422, detail="total_amount is required")

	if payload.total_amount <= 0:
		raise HTTPException(status_code=400, detail="El importe debe ser mayor que cero")

	if not stripe.api_key:
		raise HTTPException(status_code=500, detail="STRIPE_SECRET_KEY no configurada")

	order = model.listar_pedido_por_id(payload.order_id)
	if order:
		order.amount = float(payload.total_amount)
		order.user_id = payload.user_id
		order.source = payload.source
		order.status = "pending_test"
		order.payment_method = "stripe_test"
		order.updated_at = _now_iso()
	else:
		order = _build_order_payload(payload, "pending_test")

	if not model.listar_pedido_por_id(order.id):
		model.crear_pedido(order)
	else:
		model.actualizar_pedido(order)

	frontend_url = _resolve_frontend_url(request)

	session = stripe.checkout.Session.create(
		mode="payment",
		line_items=[
			{
				"price_data": {
					"currency": "eur",
					"product_data": {"name": "Pedido en Subsonic Festival"},
					"unit_amount": int(round(float(payload.total_amount) * 100)),
				},
				"quantity": 1,
			}
		],
		metadata={"order_id": order.id, "user_id": payload.user_id or ""},
		success_url=f"{frontend_url}/checkout/success?order_id={order.id}",
		cancel_url=f"{frontend_url}/checkout/cancel?order_id={order.id}",
	)

	order.checkout_session_id = session.id
	order.updated_at = _now_iso()
	model.actualizar_pedido(order)

	return {"checkoutUrl": session.url}


@router.get("/api/merchandising")
async def get_merchandising():
	return model.listar_merchandising()


@router.get("/api/merchandising/{product_id}")
async def get_merchandising_by_id(product_id: str):
	product = model.listar_merchandising_por_id(product_id)
	if not product:
		raise HTTPException(status_code=404, detail="Producto de merchandising no encontrado")
	return product


@router.post("/api/merchandising")
async def create_merchandising(product: MerchandisingDTO, current_user: UserDTO = Depends(get_current_user)):
	if current_user.role != "admin":
		raise HTTPException(status_code=403, detail="Permiso denegado")

	product.id = str(uuid4())

	success = model.crear_merchandising(product)
	if not success:
		raise HTTPException(status_code=400, detail="Error al crear el producto de merchandising")
	return product


@router.put("/api/merchandising/{product_id}")
async def update_merchandising(product_id: str, product: MerchandisingDTO, current_user: UserDTO = Depends(get_current_user)):
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


@router.delete("/api/merchandising/{product_id}")
async def delete_merchandising(product_id: str, current_user: UserDTO = Depends(get_current_user)):
	if current_user.role != "admin":
		raise HTTPException(status_code=403, detail="Permiso denegado")
	model.eliminar_merchandising(product_id)
	return {"detail": "Producto eliminado"}


@router.get("/api/favorites")
async def get_favorites(current_user: UserDTO = Depends(get_current_user)):
	return model.obtener_favoritos_usuario(current_user.id)


@router.post("/api/favorites/artists/{artist_id}")
async def add_favorite_artist(artist_id: str, current_user: UserDTO = Depends(get_current_user)):
	success = model.agregar_artista_favorito(current_user.id, artist_id)
	if not success:
		raise HTTPException(status_code=400, detail="Error al agregar artista a favoritos")
	return {"detail": "Artista agregado a favoritos"}


@router.delete("/api/favorites/artists/{artist_id}")
async def remove_favorite_artist(artist_id: str, current_user: UserDTO = Depends(get_current_user)):
	success = model.eliminar_artista_favorito(current_user.id, artist_id)
	if not success:
		raise HTTPException(status_code=400, detail="Error al eliminar artista de favoritos")
	return {"detail": "Artista eliminado de favoritos"}


@router.post("/api/favorites/festivals/{festival_id}")
async def add_favorite_festival(festival_id: str, current_user: UserDTO = Depends(get_current_user)):
	success = model.agregar_festival_favorito(current_user.id, festival_id)
	if not success:
		raise HTTPException(status_code=400, detail="Error al agregar festival a favoritos")
	return {"detail": "Festival agregado a favoritos"}


@router.delete("/api/favorites/festivals/{festival_id}")
async def remove_favorite_festival(festival_id: str, current_user: UserDTO = Depends(get_current_user)):
	success = model.eliminar_festival_favorito(current_user.id, festival_id)
	if not success:
		raise HTTPException(status_code=400, detail="Error al eliminar festival de favoritos")
	return {"detail": "Festival eliminado de favoritos"}


@router.post("/api/favorites/products/{product_id}")
async def add_favorite_product(product_id: str, current_user: UserDTO = Depends(get_current_user)):
	success = model.agregar_producto_favorito(current_user.id, product_id)
	if not success:
		raise HTTPException(status_code=400, detail="Error al agregar producto a favoritos")
	return {"detail": "Producto agregado a favoritos"}


@router.delete("/api/favorites/products/{product_id}")
async def remove_favorite_product(product_id: str, current_user: UserDTO = Depends(get_current_user)):
	success = model.eliminar_producto_favorito(current_user.id, product_id)
	if not success:
		raise HTTPException(status_code=400, detail="Error al eliminar producto de favoritos")
	return {"detail": "Producto eliminado de favoritos"}


@router.get("/api/favorites/artists/{artist_id}/check")
async def check_favorite_artist(artist_id: str, current_user: UserDTO = Depends(get_current_user)):
	return {"is_favorite": model.es_artista_favorito(current_user.id, artist_id)}


@router.get("/api/favorites/festivals/{festival_id}/check")
async def check_favorite_festival(festival_id: str, current_user: UserDTO = Depends(get_current_user)):
	return {"is_favorite": model.es_festival_favorito(current_user.id, festival_id)}


@router.get("/api/favorites/products/{product_id}/check")
async def check_favorite_product(product_id: str, current_user: UserDTO = Depends(get_current_user)):
	return {"is_favorite": model.es_producto_favorito(current_user.id, product_id)}
