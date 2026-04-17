import React, {useEffect, useMemo, useState} from 'react';
import AvatarPicker from '../components/ui/AvatarPicker.jsx';
import ProfileForm from "@/components/ui/ProfileForm.jsx";
import RecentPurchases from "@/components/ui/RecentPurchases.jsx";
import BaseCard from "@/components/ui/BaseCard.jsx";
import API_BASE_URL from '@/config/api';
import {getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider} from "firebase/auth";

const UserProfile = ({user}) => {

    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orderItems, setOrderItems] = useState([]);

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
                const response = await fetch(`${API_BASE_URL}/orderItems`);
                if (!response.ok) throw new Error('Error al cargar pedidos');
                const data = await response.json();
                setOrderItems(data || []);
            } catch (error) {
                console.error('Error fetching order items:', error);
                setOrderItems([]);
            }
        };

        fetchOrderItems();
    }, []);

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
            title: item.name,
            date: item.date,
            amount: item.price,
            status: index === 0 ? "Completado" : index === 1 ? "En progreso" : "Pendiente",
            category: item.category
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
                password: profile.password || null,
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
        </section>
    );
};

export default UserProfile;