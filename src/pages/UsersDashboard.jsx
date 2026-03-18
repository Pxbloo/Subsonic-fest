import React, {useEffect, useState} from 'react';
import UserModal from "@/components/ui/UserModal.jsx"


const UsersDashboard = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/users');

            if (!response.ok) {
                throw new Error('Failed to fetch users');
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

    const handleNewUser = () => {
        setSelectedUser(null);
        setModalOpen(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const handleSaveUser = async (userData) => {
        try {
            if (selectedUser) {
                const response = await fetch(`http://localhost:3000/users/${selectedUser.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData)
                });
                if (!response.ok) {
                    throw new Error('Failed to update user');
                }
            }
            else {
                const response = await fetch('http://localhost:3000/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData)
                });
                if (!response.ok) {
                    throw new Error('Failed to create user');
                }
            }
        }
        catch (error) {
            console.error('Error saving user:', error);
        }
        finally {
            setModalOpen(false);
            await fetchUsers();
        }
    };

    const handleDeleteUser = async () => {
        if (!confirmDelete) return;
        try {
            const response = await fetch(`http://localhost:3000/users/${selectedUser.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            await fetchUsers();
        }
        catch (error) {
            console.error('Error deleting user:', error);
        }
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
                <button
                    onClick={handleNewUser}
                    className="bg-subsonic-accent hover:bg-opacity-80 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                    + Nuevo Usuario
                </button>
            </div>

            <div className="bg-subsonic-navfooter border border-subsonic-border rounded-2xl overflow-hidden">
                <table className="min-w-full divide-y divide-subsonic-border">
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
                    {users.map(user => (
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
                                <button
                                    onClick={() => handleEdit(user)}
                                    className="text-subsonic-accent hover:text-opacity-80 font-medium"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => setConfirmDelete({ id: user.id, name: user.name })}
                                    className="text-red-400 hover:text-red-300 font-medium"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
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
            />
        </div>
    );
};

export default UsersDashboard;