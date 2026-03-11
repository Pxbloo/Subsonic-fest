// src/components/profile/ProfileForm.jsx
import React, {useEffect, useMemo, useState} from "react";
import Button from "@/components/ui/Button.jsx";

const ProfileForm = ({ value, isEditing, onEdit, onCancelEdit, onSave, onChangePassword }) => {
    const [fullName, setFullName] = useState(value?.fullName ?? "");
    const [phone, setPhone] = useState(value?.phone ?? "");
    const [address, setAddress] = useState({
        country: value?.address?.country ?? "",
        city: value?.address?.city ?? "",
        street: value?.address?.street ?? "",
        postalCode: value?.address?.postalCode ?? "",
    });

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNew, setConfirmNew] = useState("");

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFullName(value?.fullName ?? "");
        setPhone(value?.phone ?? "");
        setAddress(value?.address ?? { country: "", city: "", street: "", postalCode: ""});
    }, [value, isEditing]);

    const canChangePassword = useMemo(() => {
        return isEditing && currentPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmNew;
    }, [isEditing, currentPassword, newPassword, confirmNew]);

    const handleSaveProfile = (e) => {
        e.preventDefault();
        onSave?.({ fullName, phone, address });
    };

    const handleCancel = () => {
        setFullName(value?.fullName ?? "");
        setPhone(value?.phone ?? "");
        setAddress(value?.address ?? { country: "", city: "", street: "", postalCode: "" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNew("");
        onCancelEdit?.();
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (!canChangePassword) return;

        onChangePassword?.({ currentPassword, newPassword });

        setCurrentPassword("");
        setNewPassword("");
        setConfirmNew("");
    };

    const inputClassBase =
        "w-full bg-subsonic-bg border border-subsonic-border rounded-xl px-4 py-3 text-subsonic-text " +
        "placeholder:text-subsonic-text/40 focus:outline-none focus:ring-2 focus:ring-subsonic-accent/50";

    const inputClassReadOnly =
        "opacity-80 cursor-not-allowed focus:ring-0";

    const inputClass = (readOnly) =>
        readOnly ? `${inputClassBase} ${inputClassReadOnly}` : inputClassBase;

    const labelClass = "text-sm font-bold text-subsonic-text";

    const readOnly = !isEditing;

    return (
        <div className="space-y-6">
            {}
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-black text-subsonic-text uppercase">Datos</h3>

                {!isEditing ? (
                    <Button
                        type="button"
                        onClick={onEdit}
                        className="border border-subsonic-border text-subsonic-bg font-black px-5 py-2 rounded-full uppercase text-sm hover:border-subsonic-accent transition"
                    >
                        Editar
                    </Button>
                ) : (
                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            onClick={handleCancel}
                            className="border border-subsonic-border text-subsonic-bg font-black px-5 py-2 rounded-full uppercase text-sm hover:border-subsonic-accent transition"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            form="profile-form"
                            className="bg-subsonic-accent text-subsonic-bg font-black px-5 py-2 rounded-full uppercase text-sm hover:opacity-90 transition"
                        >
                            Guardar
                        </Button>
                    </div>
                )}
            </div>

            <form id="profile-form" onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                    <label className={labelClass}>Nombre completo</label>
                    <input
                        className={inputClass(readOnly)}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Tu nombre y apellido"
                        autoComplete="name"
                        readOnly={readOnly}
                    />
                </div>

                <div>
                    <label className={labelClass}>Número de teléfono</label>
                    <input
                        className={inputClass(readOnly)}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ej: +34 600 000 000"
                        autoComplete="tel"
                        readOnly={readOnly}
                    />
                </div>

                <div>
                    <label className={labelClass}>Dirección de facturación</label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                            <label className="text-xs font-bold text-subsonic-text/80">País</label>
                            <input
                                className={inputClass(readOnly)}
                                value={address.country}
                                onChange={(e) => setAddress((a) => ({ ...a, country: e.target.value }))}
                                placeholder="España"
                                autoComplete="country-name"
                                readOnly={readOnly}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-subsonic-text/80">Ciudad</label>
                            <input
                                className={inputClass(readOnly)}
                                value={address.city}
                                onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                                placeholder="Madrid"
                                autoComplete="address-level2"
                                readOnly={readOnly}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-subsonic-text/80">Dirección (línea 1)</label>
                            <input
                                className={inputClass(readOnly)}
                                value={address.street}
                                onChange={(e) => setAddress((a) => ({ ...a, street: e.target.value }))}
                                placeholder="Calle, número, piso, etc."
                                autoComplete="address-line1"
                                readOnly={readOnly}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-subsonic-text/80">Código postal</label>
                            <input
                                className={inputClass(readOnly)}
                                value={address.postalCode}
                                onChange={(e) => setAddress((a) => ({ ...a, postalCode: e.target.value }))}
                                placeholder="28000"
                                autoComplete="postal-code"
                                readOnly={readOnly}
                            />
                        </div>
                    </div>
                </div>
            </form>

            <div className="border-t border-subsonic-border pt-6">
                <h3 className="text-lg font-black text-subsonic-text uppercase mb-4">
                    Cambio de contraseña
                </h3>

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className={labelClass}>Contraseña actual</label>
                        <input
                            className={inputClass(!isEditing)}
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            readOnly={!isEditing}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Nueva contraseña</label>
                            <input
                                className={inputClass(!isEditing)}
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Mínimo 8 caracteres"
                                autoComplete="new-password"
                                readOnly={!isEditing}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Confirmar nueva contraseña</label>
                            <input
                                className={inputClass(!isEditing)}
                                type="password"
                                value={confirmNew}
                                onChange={(e) => setConfirmNew(e.target.value)}
                                placeholder="Repite la nueva contraseña"
                                autoComplete="new-password"
                                readOnly={!isEditing}
                            />
                        </div>
                    </div>

                    <Button
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
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ProfileForm;