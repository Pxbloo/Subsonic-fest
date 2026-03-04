import React, {useMemo, useState} from 'react';
import AvatarPicker from '../components/ui/AvatarPicker.jsx';
import ProfileForm from "@/components/ui/ProfileForm.jsx";
import RecentPurchases from "@/components/ui/RecentPurchases.jsx";

const UserProfile = () => {

    const [isEditing, setIsEditing] = useState(false);

    const [profile, setProfile] = useState({
        name: "Usuario",
        phone: "",
        avatar: "",
        address: {
            country: "",
            city: "",
            street: "",
            postalCode: "",
        },
    });

    const purchases = useMemo(
        () => [
            {
                id: 1,
                title: "Evento de Festival",
                date: "15-17 Jul 2025",
                amount: 89,
                status: "Completado",
            },
            {
                id: 2,
                title: "Experiencia de DJ",
                date: "22 Ago 2025",
                amount: 45,
                status: "En progreso",
            },
            {
                id: 3,
                title: "Paquete de Techno",
                date: "05 Sep 2025",
                amount: 60,
                status: "Pendiente",
            }
        ],
        []
    );

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
                    <div className="bg-subsonic-navfooter border border-subsonic-border rounded-2xl p-6">
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
                    </div>
                </div>

                <aside className="lg:col-span-4">
                    <div className="bg-subsonic-navfooter border border-subsonic-border rounded-2xl p-6">
                        <RecentPurchases purchases={purchases} />
                    </div>
                </aside>
            </div>
        </section>
    );
};

export default UserProfile;