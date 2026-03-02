// src/components/profile/ProfileForm.jsx
import React, { useMemo, useState } from "react";

const ProfileForm = ({ value, onSave, onChangePassword }) => {
    const [fullName, setFullName] = useState(value?.fullName ?? "");
    const [phone, setPhone] = useState(value?.phone ?? "");
    const [address, setAddress] = useState(value?.address ?? "");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNew, setConfirmNew] = useState("");

    const canChangePassword = useMemo(() => {
        return currentPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmNew;
    }, [currentPassword, newPassword, confirmNew]);

    const handleSaveProfile = (e) => {
        e.preventDefault();
        onSave?.({ fullName, phone, address });
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (!canChangePassword) return;

        onChangePassword?.({ currentPassword, newPassword });

        // Clear fields after request
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNew("");
    };

    const inputClass =
        "w-full bg-subsonic-bg border border-subsonic-border rounded-xl px-4 py-3 text-subsonic-text " +
        "placeholder:text-subsonic-text/40 focus:outline-none focus:ring-2 focus:ring-subsonic-accent/50";

    const labelClass = "text-sm font-bold text-subsonic-text";

    return (
        <div className="space-y-6">
            <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                    <label className={labelClass}>Nombre completo</label>
                    <input
                        className={inputClass}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Tu nombre y apellido"
                        autoComplete="name"
                    />
                </div>

                <div>
                    <label className={labelClass}>Número de teléfono</label>
                    <input
                        className={inputClass}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ej: +34 600 000 000"
                        autoComplete="tel"
                    />
                </div>

                <div>
                    <label className={labelClass}>Dirección</label>
                    <textarea
                        className={`${inputClass} min-h-24 resize-y`}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Calle, número, ciudad, código postal..."
                        autoComplete="street-address"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        className="bg-subsonic-accent text-subsonic-bg font-black px-5 py-3 rounded-full uppercase text-sm hover:opacity-90 transition"
                    >
                        Guardar cambios
                    </button>
                    <span className="text-xs text-subsonic-text/60">
            (Después lo conectamos a tu backend)
          </span>
                </div>
            </form>

            <div className="border-t border-subsonic-border pt-6">
                <h3 className="text-lg font-black text-subsonic-text uppercase mb-4">
                    Cambiar contraseña
                </h3>

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className={labelClass}>Contraseña actual</label>
                        <input
                            className={inputClass}
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Nueva contraseña</label>
                            <input
                                className={inputClass}
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Mínimo 8 caracteres"
                                autoComplete="new-password"
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Confirmar nueva contraseña</label>
                            <input
                                className={inputClass}
                                type="password"
                                value={confirmNew}
                                onChange={(e) => setConfirmNew(e.target.value)}
                                placeholder="Repite la nueva contraseña"
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!canChangePassword}
                        className={[
                            "px-5 py-3 rounded-full uppercase text-sm font-black transition",
                            canChangePassword
                                ? "bg-subsonic-accent text-subsonic-bg hover:opacity-90"
                                : "bg-subsonic-border text-subsonic-text/50 cursor-not-allowed",
                        ].join(" ")}
                    >
                        Actualizar contraseña
                    </button>

                    <p className="text-xs text-subsonic-text/60">
                        Consejo: en producción, esto debe ir por API segura y con validación del servidor.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ProfileForm;