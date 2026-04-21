import React, {useEffect, useMemo, useState} from 'react';
import UserModal from "@/components/ui/UserModal.jsx"
import ConfirmDialog from "@/components/ui/ConfirmDialog.jsx";
import Button from "@/components/ui/Button.jsx";
import SearchBar from "@/components/ui/SearchBar.jsx";
import API_BASE_URL from '@/config/api';
import {createUserWithEmailAndPassword, getAuth,} from "firebase/auth";


const UsersDashboard = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [canSubmit, setCanSubmit] = useState(true);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/users`);

            if (!response.ok) {
                console.error('Failed to fetch users:', response.statusText);
            }
            const data = await response.json();
            setUsers(data);
        }
        catch (error) {
            console.error('Error fetching users:', error);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);
    
    const filteredUsers = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        
        if (!term) return users;
        
        return users.filter((user) => [
            user.id,
            user.name,
            user.email,
            user.phone,
            user.role,
        ]
            .filter(Boolean)
            .some((field) => String(field).toLowerCase().includes(term))
        );
    }, [searchTerm, users]);

    const handleNewUser = () => {
        setSelectedUser(null);
        setModalOpen(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const handleSaveUser = async (userData) => {
        if (!canSubmit) {
            alert('Por favor, espera antes de hacer más peticiones.');
            return;
        }
        setCanSubmit(false);
        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (!currentUser) {
                throw new Error('No user is currently logged in or user is not authenticated.');
            }

            const token = await currentUser.getIdToken();
            let uid = selectedUser?.id;

            if (!selectedUser) {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    userData.email,
                    userData.password
                );

                uid = userCredential.user.uid;
            }

            const payload = {
                ...userData,
                id: userData.id?.trim() || uid
            };
            delete payload.password;

            const url = selectedUser
                ? `${API_BASE_URL}/users/${uid}`
                : `${API_BASE_URL}/users`;

            const method = selectedUser ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed: ${response.status} ${errorText}`);
            }

            if (userData.password) {
                const response = await fetch(`${API_BASE_URL}/users/admin-password-reset/${uid}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({new_password: userData.password}),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Request failed: ${response.status} ${errorText}`);
                }
            }

            setModalOpen(false);
            setSelectedUser(null);
            await fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error);
        }
        setCanSubmit(true);
    };

    const handleDeleteUser = async (user) => {
        if (!canSubmit) {
            alert('Por favor, espera antes de hacer más peticiones.')
            return;
        }
        setCanSubmit(false);
        if (!confirmDelete || !user) return;
        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (!currentUser) {
                throw new Error('No user is currently logged in or user is not authenticated.');
            }

            const token = await currentUser.getIdToken();
            const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                console.error('Failed to delete user:', response.statusText);
            }
            setConfirmDelete(null);
            await fetchUsers();
        }
        catch (error) {
            console.error('Error deleting user:', error);
        }
        setCanSubmit(true);
    };

    if (loading) {
        return <div className="text-center p-8">Cargando usuarios...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-black text-subsonic-accent uppercase tracking-tight">
                    Gestión de Usuarios
                </h1>
                <Button
                    onClick={handleNewUser}
                    className="border border-subsonic-border text-subsonic-bg font-black px-5 py-2 rounded-full uppercase text-sm hover:border-subsonic-bg transition"
                >
                    + Nuevo Usuario
                </Button>
            </div>
            <div className="mb-6 max-w-md">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Buscar por nombre, id, email, rol..."
                    showButton={false}
                    className="w-full"
                    inputClassName="w-full rounded-md border border-subsonic-border bg-subsonic-surface px-4 py-2 text-sm text-subsonic-text
                     placeholder:text-subsonic-muted outline-none focus:ring-2 focus:ring-subsonic-accent/30"
                />
            </div>

            <div className="bg-subsonic-navfooter border border-subsonic-border rounded-2xl overflow-hidden">
                <div className="w-full overflow-x-auto">
                    <table className="min-w-225 w-full divide-y divide-subsonic-border">
                        <thead className="bg-subsonic-surface/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Teléfono</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Rol</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Acciones</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-subsonic-border">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-subsonic-surface/20 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{user.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{user.phone || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            user.role === 'admin' ? 'bg-purple-500/20 text-purple-300' :
                                                user.role === 'provider' ? 'bg-blue-500/20 text-blue-300' :
                                                    'bg-green-500/20 text-green-300'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                        <Button
                                            onClick={() => handleEdit(user)}
                                            className="bg-subsonic-border text-subsonic-accent hover:text-opacity-80 hover:bg-subsonic-accent hover:text-subsonic-bg px-6 py-2"
                                            variant=''
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            onClick={() => setConfirmDelete(user)}
                                            className="bg-subsonic-border text-red-400 hover:bg-red-500 hover:text-subsonic-bg px-6 py-2"
                                            variant=''
                                        >
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-10 text-center text-sm text-subsonic-muted">
                                    No se encontraron usuarios con ese filtro.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal para crear/editar usuario */}
            <UserModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveUser}
                user={selectedUser}
            />

            {/* Diálogo de confirmación para eliminar */}
            <ConfirmDialog
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={handleDeleteUser}
                title="Eliminar usuario"
                message={`¿Estás seguro de que deseas eliminar a "${confirmDelete?.name}"? Esta acción no se puede deshacer.`}
                user={confirmDelete}
            />
        </div>
    );
};

export default UsersDashboard;