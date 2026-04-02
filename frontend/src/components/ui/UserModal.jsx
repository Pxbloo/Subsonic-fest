import React, {useEffect, useState} from 'react';
import Input from "@/components/ui/Input.jsx";
import Button from "@/components/ui/Button.jsx";

const UserModal = ({isOpen, onClose, onSave, user}) => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'client',
        avatar: '',
        address: {
            country: '',
            city: '',
            street: '',
            postalCode: ''
        }
    });

    useEffect(() => {
        if (user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUserData(user);
        }
        else {
            setUserData({
                name: '',
                email: '',
                phone: '',
                password: '',
                role: 'client',
                avatar: '',
                address: {
                    country: '',
                    city: '',
                    street: '',
                    postalCode: ''
                }
            });
        }
    }, [user, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setUserData(prev => ({
                ...prev,
                address: { ...prev.address, [field]: value }
            }));
        } else {
            setUserData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(userData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-subsonic-surface border border-subsonic-border p-8 rounded-lg w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-subsonic-accent mb-6">
                    {user ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="block text-xs font-montserrat text-subsonic-muted uppercase tracking-widest">Nombre *</label>
                            <Input
                                type="text"
                                name="name"
                                value={userData.name}
                                onChange={handleChange}
                                required
                                placeholder="Nombre y Apellidos"
                                className="w-full bg-subsonic-navfooter border border-subsonic-border p-2 rounded-md text-subsonic-text focus:border-subsonic-accent outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-montserrat text-subsonic-muted uppercase tracking-widest">Email *</label>
                            <Input
                                type="email"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                required
                                placeholder="ejemplo@correo.com"
                                className="w-full bg-subsonic-navfooter border border-subsonic-border p-2 rounded-md text-subsonic-text focus:border-subsonic-accent outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-montserrat text-subsonic-muted uppercase tracking-widest">Teléfono</label>
                            <Input
                                type="tel"
                                name="phone"
                                value={userData.phone}
                                onChange={handleChange}
                                placeholder="+34 123 456 789"
                                className="w-full bg-subsonic-navfooter border border-subsonic-border p-2 rounded-md text-subsonic-text focus:border-subsonic-accent outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-montserrat text-subsonic-muted uppercase tracking-widest">
                                {user ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña *'}
                            </label>
                            <Input
                                type="password"
                                name="password"
                                value={userData.password}
                                onChange={handleChange}
                                required={!user}
                                placeholder='*********'
                                className="w-full bg-subsonic-navfooter border border-subsonic-border p-2 rounded-md text-subsonic-text focus:border-subsonic-accent outline-none"
                            />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                            <label className="block text-xs font-montserrat text-subsonic-muted uppercase tracking-widest">Avatar URL</label>
                            <Input
                                type="url"
                                name="avatar"
                                value={userData.avatar}
                                onChange={handleChange}
                                placeholder="Enlace al avatar (URL)"
                                className="w-full bg-subsonic-navfooter border border-subsonic-border p-2 rounded-md text-subsonic-text focus:border-subsonic-accent outline-none"
                            />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                            <label className="block text-xs font-montserrat text-subsonic-muted uppercase tracking-widest">Rol *</label>
                            <select
                                name="role"
                                value={userData.role}
                                onChange={handleChange}
                                required
                                className="w-full bg-subsonic-navfooter border border-subsonic-border p-2 rounded-md text-subsonic-text focus:border-subsonic-accent outline-none"
                            >
                                <option value="client">Cliente</option>
                                <option value="provider">Proveedor</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <h3 className="text-sm font-semibold text-subsonic-text mb-2">Dirección</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    type="text"
                                    name="address.country"
                                    placeholder="País"
                                    value={userData.address.country}
                                    onChange={handleChange}
                                    className="bg-subsonic-navfooter border border-subsonic-border p-2 rounded-md text-subsonic-text focus:border-subsonic-accent outline-none"
                                />
                                <Input
                                    type="text"
                                    name="address.city"
                                    placeholder="Ciudad"
                                    value={userData.address.city}
                                    onChange={handleChange}
                                    className="bg-subsonic-navfooter border border-subsonic-border p-2 rounded-md text-subsonic-text focus:border-subsonic-accent outline-none"
                                />
                                <Input
                                    type="text"
                                    name="address.street"
                                    placeholder="Calle"
                                    value={userData.address.street}
                                    onChange={handleChange}
                                    className="md:col-span-2 bg-subsonic-navfooter border border-subsonic-border p-2 rounded-md text-subsonic-text focus:border-subsonic-accent outline-none"
                                />
                                <Input
                                    type="text"
                                    name="address.postalCode"
                                    placeholder="Código Postal"
                                    value={userData.address.postalCode}
                                    onChange={handleChange}
                                    className="bg-subsonic-navfooter border border-subsonic-border p-2 rounded-md text-subsonic-text focus:border-subsonic-accent outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            onClick={onClose}
                            className="border border-subsonic-border text-subsonic-bg font-black px-5 py-2 rounded-full uppercase text-sm hover:border-subsonic-accent transition"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="border border-subsonic-border text-subsonic-bg font-black px-5 py-2 rounded-full uppercase text-sm hover:border-subsonic-accent transition"
                        >
                            {user ? 'Actualizar' : 'Crear'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;