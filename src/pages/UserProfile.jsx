import React, {useMemo} from 'react';
import AvatarPicker from '../components/AvatarPicker';
import ProfileForm from "@/components/ProfileForm.jsx";
import RecentPurchases from "@/components/RecentPurchases.jsx";

const UserProfile = () => {

    const [profile, setProfile] = React.useState({
        name: "Usuario",
        phone: "",
        avatar: "",
        address: "",
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
        // Later: llamada de API.
    };

    const handlePasswordChange = ({ currentPassword, newPassword }) => {
        // Later: llamada API
        console.log("Password change requested", {
            currentPassword: currentPassword ? "[provided]" : "[missing]",
            newPassword: newPassword ? "[provided]" : "[missing]",
        });
    };

    return (
        <section className="max-w-6xl mx-auto">
            <header className="mb-6">
                <h1 className="text-3xl md:text-4xl font-black text-subsonic-text uppercase tracking-tight">
                    Perfil de usuario
                </h1>
                <p className="text-subsonic-text/80 mt-2">
                    Edita tu información y revisa tus compras recientes.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: user data */}
                <div className="lg:col-span-8">
                    <div className="bg-subsonic-navfooter border border-subsonic-border rounded-2xl p-6">
                        <div className="flex items-start gap-5">
                            <AvatarPicker
                                value={profile.avatarUrl}
                                onChange={handleAvatarChange}
                                size={72}
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
                                    onSave={handleProfileSave}
                                    onChangePassword={handlePasswordChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: recent purchases */}
                <aside className="lg:col-span-4">
                    <div className="bg-subsonic-navfooter border border-subsonic-border rounded-2xl p-6">
                        <RecentPurchases purchases={purchases} />
                    </div>
                </aside>
            </div>

            {/* If you want purchases on the LEFT instead:
          - swap the two blocks above, or
          - use Tailwind order classes (e.g., lg:order-2 / lg:order-1). */}
        </section>
    );
};

export default UserProfile;