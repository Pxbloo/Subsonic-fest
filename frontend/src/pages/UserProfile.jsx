import React, {useEffect, useMemo, useState} from 'react';
import { Link } from 'react-router-dom';
import AvatarPicker from '../components/ui/AvatarPicker.jsx';
import ProfileForm from "@/components/ui/ProfileForm.jsx";
import RecentPurchases from "@/components/ui/RecentPurchases.jsx";
import BaseCard from "@/components/ui/BaseCard.jsx";
import API_BASE_URL from '@/config/api';
import {getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider} from "firebase/auth";
import { useFavorites } from '@/hooks/useFavorites';
import FavoriteButton from '@/components/ui/FavoriteButton';

const UserProfile = ({user}) => {

    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orderItems, setOrderItems] = useState([]);
    const { favorites, loadFavorites } = useFavorites();
    const [favoriteData, setFavoriteData] = useState({
        artists: [],
        festivals: [],
        products: []
    });
    const [loadingFavorites, setLoadingFavorites] = useState(false);

    useEffect(() => {
        if (user) {
            setProfile({
                id: user.id,
                fullName: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                avatarUrl: user.avatar || "",
                address: user.address || {
                    country: "",
                    city: "",
                    street: "",
                    postalCode: "",
                },
            });
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        const fetchOrderItems = async () => {
            try {
                const query = user?.id ? `?user_id=${encodeURIComponent(user.id)}` : '';
                const response = await fetch(`${API_BASE_URL}/orderItems${query}`);
                if (!response.ok) throw new Error('Error al cargar pedidos');
                const data = await response.json();
                setOrderItems(data || []);
            } catch (error) {
                console.error('Error fetching order items:', error);
                setOrderItems([]);
            }
        };

        fetchOrderItems();
    }, [user?.id]);

    useEffect(() => {
        const loadFavoriteDetails = async () => {
            if (!favorites || (!favorites.favorite_artists?.length && !favorites.favorite_festivals?.length && !favorites.favorite_products?.length)) {
                return;
            }

            setLoadingFavorites(true);
            try {
                const artists = [];
                const festivals = [];
                const products = [];

                for (const artistId of favorites.favorite_artists || []) {
                    try {
                        const res = await fetch(`${API_BASE_URL}/artists/${artistId}`);
                        if (res.ok) {
                            const data = await res.json();
                            artists.push(data);
                        }
                    } catch (err) {
                        console.error(`Error loading artist ${artistId}:`, err);
                    }
                }

                for (const festivalId of favorites.favorite_festivals || []) {
                    try {
                        const res = await fetch(`${API_BASE_URL}/festivals/${festivalId}`);
                        if (res.ok) {
                            const data = await res.json();
                            festivals.push(data);
                        }
                    } catch (err) {
                        console.error(`Error loading festival ${festivalId}:`, err);
                    }
                }

                for (const productId of favorites.favorite_products || []) {
                    try {
                        const res = await fetch(`${API_BASE_URL}/merchandising/${productId}`);
                        if (res.ok) {
                            const data = await res.json();
                            products.push(data);
                        }
                    } catch (err) {
                        console.error(`Error loading product ${productId}:`, err);
                    }
                }

                setFavoriteData({ artists, festivals, products });
            } catch (error) {
                console.error('Error loading favorite details:', error);
            } finally {
                setLoadingFavorites(false);
            }
        };

        loadFavoriteDetails();
    }, [favorites]);

    function validateResponse(response) {
        if (response.ok) {
            return response.json();
        } else {
            const errorText = response.text();
            console.error("Error response:", errorText);
            throw new Error("Network response was not ok.");
        }
    }

    const purchases = useMemo(() => {
        return orderItems.map((item, index) => ({
            id: item.id,
            title: item.title || item.name || "Pedido en Subsonic Festival",
            date: item.created_at ? item.created_at.slice(0, 10) : item.date || "",
            amount: item.amount ?? item.price ?? 0,
            status: item.status === "paid_test" ? "Completado" : item.status === "pending_test" ? "Pendiente" : (item.status || "Pendiente"),
            category: item.source || item.category || "Pedido Stripe",
        }));
    }, [orderItems]);

    const handleAvatarChange = (nextUrl) => {
        setProfile((prev) => ({ ...prev, avatarUrl: nextUrl }));
    };

    const handleProfileSave = async (nextProfile) => {
        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (!currentUser) {
                throw new Error("No user is currently logged in or user is not authenticated.");
            }

            const token = await currentUser.getIdToken();

            const payload = {
                id: profile.id,
                name: nextProfile.fullName,
                email: profile.email,
                role: profile.role || "user",
                phone: nextProfile.phone || "",
                avatar: nextProfile.avatarUrl || null,
                address: {
                    country: nextProfile.address?.country || "",
                    city: nextProfile.address?.city || "",
                    street: nextProfile.address?.street || "",
                    postalCode: nextProfile.address?.postalCode || "",
                },
            };

            const response = await fetch(`${API_BASE_URL}/users/${profile.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const updatedUser = await validateResponse(response);

            setProfile({
                id: updatedUser.id,
                fullName: updatedUser.name || "",
                email: updatedUser.email || "",
                phone: updatedUser.phone || "",
                avatarUrl: updatedUser.avatar || "",
                address: {
                    country: updatedUser.address.country || "",
                    city: updatedUser.address.city || "",
                    street: updatedUser.address.street || "",
                    postalCode: updatedUser.address.postalCode || "",
                },
            });

            setIsEditing(false);
        }
        catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handlePasswordChange = async ({currentPassword, newPassword}) => {

        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (!currentUser) {
                throw new Error("No user is currently logged in or user is not authenticated.");
            }

            const cred = EmailAuthProvider.credential(currentUser.email, currentPassword);

            await reauthenticateWithCredential(currentUser, cred);
            await updatePassword(currentUser, newPassword);

            alert("Contraseña cambiada correctamente");

        } catch (error) {
            console.error("Error changing password:", error);

            if (error.code === "auth/invalid-credential") {
                alert("La contraseña actual es incorrecta. Inténtalo de nuevo.");
            }
            else alert("Ocurrió un error al cambiar la contraseña. Inténtalo de nuevo.");
        }

    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    if (loading) {
        return (
            <section className="max-w-6xl mx-auto">
                <header className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-black text-subsonic-accent uppercase tracking-tight">
                        Perfil de usuario
                    </h1>
                    <p className="text-subsonic-text/80 mt-2">
                        Cargando...
                    </p>
                </header>
            </section>
        );
    }

    if (!profile) {
        console.error("Profile data is missing. Unable to render user profile.");
        return (
            <section className="max-w-6xl mx-auto">
                <header className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-black text-subsonic-accent uppercase tracking-tight">
                        Perfil de usuario
                    </h1>
                    <p className="text-subsonic-text/80 mt-2">
                        No se pudo cargar el perfil.
                    </p>
                </header>
            </section>
        );
    }

    return (
        <section className="max-w-6xl mx-auto">
            <header className="mb-6">
                <h1 className="text-3xl md:text-4xl font-black text-subsonic-accent uppercase tracking-tight">
                    Perfil de usuario
                </h1>
                <p className="text-subsonic-text/80 mt-2">
                    Edita tu información y revisa tus compras recientes.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                    <BaseCard>
                        <div className="flex items-start gap-5">
                            <AvatarPicker
                                value={profile.avatarUrl}
                                onChange={handleAvatarChange}
                                size={72}
                                disabled={!isEditing}
                            />

                            <div className="flex-1">
                                <div className="mb-4">
                                    <h2 className="text-xl font-black text-subsonic-text">
                                        {profile.fullName || "Tu nombre"}
                                    </h2>
                                    <p className="text-subsonic-text/70 text-sm">
                                        Mantén tus datos actualizados para compras y contacto.
                                    </p>
                                </div>

                                <ProfileForm
                                    value={profile}
                                    isEditing={isEditing}
                                    onEdit={() => setIsEditing(true)}
                                    onCancelEdit={handleCancelEdit}
                                    onSave={handleProfileSave}
                                    onChangePassword={handlePasswordChange}
                                />
                            </div>
                        </div>
                    </BaseCard>
                </div>

                <aside className="lg:col-span-4">
                    <BaseCard>
                        <RecentPurchases purchases={purchases} />
                    </BaseCard>
                </aside>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-black text-subsonic-accent uppercase tracking-tight mb-6">
                    Mis Favoritos
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <BaseCard>
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-subsonic-text">Artistas Favoritos</h3>
                            <p className="text-subsonic-text/70 text-sm">
                                {favoriteData.artists.length} artista{favoriteData.artists.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        {loadingFavorites ? (
                            <div className="text-center py-4">
                                <p className="text-subsonic-text/60">Cargando...</p>
                            </div>
                        ) : favoriteData.artists.length > 0 ? (
                            <div className="space-y-3">
                                {favoriteData.artists.map((artist) => (
                                    <div 
                                        key={artist.id}
                                        className="flex items-center justify-between p-3 bg-subsonic-dark-light rounded hover:bg-subsonic-accent/10 transition"
                                    >
                                        <div className="flex-1">
                                            <Link
                                                to={`/artist/${artist.id}`}
                                                className="font-semibold text-subsonic-text hover:text-subsonic-accent transition-colors"
                                            >
                                                {artist.name}
                                            </Link>
                                            <p className="text-sm text-subsonic-text/70">{artist.genre}</p>
                                        </div>
                                        <FavoriteButton 
                                            id={artist.id} 
                                            type="artist" 
                                            className="ml-2"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-subsonic-text/60 text-center py-4">
                                No tienes artistas favoritos aún
                            </p>
                        )}
                    </BaseCard>

                    <BaseCard>
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-subsonic-text">Festivales Favoritos</h3>
                            <p className="text-subsonic-text/70 text-sm">
                                {favoriteData.festivals.length} festival{favoriteData.festivals.length !== 1 ? 'es' : ''}
                            </p>
                        </div>
                        {loadingFavorites ? (
                            <div className="text-center py-4">
                                <p className="text-subsonic-text/60">Cargando...</p>
                            </div>
                        ) : favoriteData.festivals.length > 0 ? (
                            <div className="space-y-3">
                                {favoriteData.festivals.map((festival) => (
                                    <div 
                                        key={festival.id}
                                        className="flex items-center justify-between p-3 bg-subsonic-dark-light rounded hover:bg-subsonic-accent/10 transition"
                                    >
                                        <div className="flex-1">
                                            <Link
                                                to={`/festival/${festival.id}`}
                                                className="font-semibold text-subsonic-text hover:text-subsonic-accent transition-colors"
                                            >
                                                {festival.title || festival.name}
                                            </Link>
                                        </div>
                                        <FavoriteButton 
                                            id={festival.id} 
                                            type="festival"
                                            className="ml-2"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-subsonic-text/60 text-center py-4">
                                No tienes festivales favoritos aún
                            </p>
                        )}
                    </BaseCard>

                    <BaseCard>
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-subsonic-text">Productos Favoritos</h3>
                            <p className="text-subsonic-text/70 text-sm">
                                {favoriteData.products.length} producto{favoriteData.products.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        {loadingFavorites ? (
                            <div className="text-center py-4">
                                <p className="text-subsonic-text/60">Cargando...</p>
                            </div>
                        ) : favoriteData.products.length > 0 ? (
                            <div className="space-y-3">
                                {favoriteData.products.map((product) => (
                                    <div 
                                        key={product.id}
                                        className="flex items-center justify-between p-3 bg-subsonic-dark-light rounded hover:bg-subsonic-accent/10 transition"
                                    >
                                        <div className="flex-1">
                                            <Link
                                                to={`/tienda?producto=${encodeURIComponent(product.id)}`}
                                                className="font-semibold text-subsonic-text hover:text-subsonic-accent transition-colors"
                                            >
                                                {product.name}
                                            </Link>
                                        </div>
                                        <FavoriteButton 
                                            id={product.id} 
                                            type="product"
                                            className="ml-2"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-subsonic-text/60 text-center py-4">
                                No tienes productos favoritos aún
                            </p>
                        )}
                    </BaseCard>
                </div>
            </div>
        </section>
    );
};

export default UserProfile;