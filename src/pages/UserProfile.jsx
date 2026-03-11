import React, {useEffect, useMemo, useState} from 'react';
import AvatarPicker from '../components/ui/AvatarPicker.jsx';
import ProfileForm from "@/components/ui/ProfileForm.jsx";
import RecentPurchases from "@/components/ui/RecentPurchases.jsx";
import BaseCard from "@/components/ui/BaseCard.jsx";
import orderItems from "@/data/orderItems.json";

const UserProfile = ({user}) => {

    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setProfile({
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

    const purchases = useMemo(() => {
        return orderItems.map((item, index) => ({
            id: item.id,
            title: item.name,
            date: item.date,
            amount: item.price,
            status: index === 0 ? "Completado" : index === 1 ? "En progreso" : "Pendiente",
            category: item.category
        }));
    }, []);

    const handleAvatarChange = (nextUrl) => {
        setProfile((prev) => ({ ...prev, avatarUrl: nextUrl }));
    };

    const handleProfileSave = (nextProfile) => {
        setProfile((prev) => ({ ...prev, ...nextProfile }));
        setIsEditing(false);
        // Later: llamada de API.
    };

    const handlePasswordChange = ({ currentPassword, newPassword }) => {
        // Later: llamada API
        console.log("Password change requested", {
            currentPassword: currentPassword ? "[provided]" : "[missing]",
            newPassword: newPassword ? "[provided]" : "[missing]",
        });
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