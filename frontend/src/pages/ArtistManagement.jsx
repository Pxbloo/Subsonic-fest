import React, {useEffect, useState, useMemo} from 'react';
import ArtistModal from "@/components/ui/ArtistModal.jsx";
import API_BASE_URL from "@/config/api.js";
import Button from "@/components/ui/Button.jsx";
import SearchBar from "@/components/ui/SearchBar.jsx";
import ConfirmDialog from "@/components/ui/ConfirmDialog.jsx";

const ArtistManagement = () => {

    const [artists, setArtists] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedArt, setSelectedArt] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchArtists = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/artists`);

            if (!response.ok) {
                console.error('Failed to fetch artists:', response.statusText);
            }
            const data = await response.json();
            setArtists(data);
        }
        catch (error) {
            console.error('Error fetching artists:', error);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchArtists();
    }, []);

    const filteredArtists = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        if (!term) return artists;

        return artists.filter((artist) => [
                artist.id,
                artist.name,
                artist.email,
                artist.genre,
            ]
                .filter(Boolean)
                .some((field) => String(field).toLowerCase().includes(term))
        );
    }, [searchTerm, artists]);

    //Manejar creación de artistas
    const handleNew = () => {
        setSelectedArt(null)
        setModalOpen(true);
    }

    const handleEdit = (artist) => {
        setSelectedArt(artist);
        setModalOpen(true);
    };

    const handleSaveArtist = async (artistData) => {
        try {
            if (selectedArt) {
                const response = await fetch(`${API_BASE_URL}/artists/${selectedArt.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(artistData)
                });
                if (!response.ok) {
                    console.error('Failed to update user:', response.statusText);
                }
            }
            else {
                const response = await fetch(`${API_BASE_URL}/artists`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(artistData)
                });
                if (!response.ok) {
                    console.error('Failed to create user:', response.statusText);
                }
            }
        }
        catch (error) {
            console.error('Error saving user:', error);
        }
        finally {
            setModalOpen(false);
            await fetchArtists();
        }
    };

    // Manejar el borrado de artistas
    const handleDelete = async () => {
        if (!confirmDelete) return;
        try {
            //Para borrar usar confirmDelete en vez de selectedArt
            const response = await fetch(`${API_BASE_URL}/artists/${selectedArt.id}`, {
                method: 'DELETE',
            });
            if (!response.ok){
                console.error('Failed to delete artist:', response.statusText);
            }
            await fetchArtists();
        } catch (error) {
            console.error('Error deleting artist:', error);
        }
    };

    if(loading) {
        return <div className="text-center p-8">Cargando artistas...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-black text-subsonic-accent uppercase tracking-tight">
                    Gestión de Artistas
                </h1>
                <Button
                    onClick={handleNew}
                    className="border border-subsonic-border text-subsonic-bg font-black px-5 py-2 rounded-full uppercase text-sm hover:border-subsonic-bg transition"
                >
                    + Nuevo Artista
                </Button>
            </div>
            <div className="mb-6 max-w-md">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Buscar por nombre, id, email, género..."
                    showButton={false}
                    className="w-full"
                    inputClassName="w-full rounded-md border border-subsonic-border bg-subsonic-surface px-4 py-2 text-sm text-subsonic-text
                     placeholder:text-subsonic-muted outline-none focus:ring-2 focus:ring-subsonic-accent/30"
                />
            </div>

            <div className="bg-subsonic-navfooter border border-subsonic-border rounded-2xl overflow-hidden">
                <table className="min-w-full divide-y divide-subsonic-border">
                    <thead className="bg-subsonic-surface/50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Género</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Acciones</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-subsonic-border">
                    {filteredArtists.length > 0 ? (
                        filteredArtists.map(artist => (
                            <tr key={artist.id} className="hover:bg-subsonic-surface/20 transition">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{artist.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{artist.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{artist.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{artist.genre}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                    <Button
                                        onClick={() => handleEdit(artist)}
                                        className="bg-subsonic-border text-subsonic-accent hover:text-opacity-80 hover:bg-subsonic-accent hover:text-subsonic-bg px-6 py-2"
                                        variant=''
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        onClick={() => setConfirmDelete({ id: artist.id, name: artist.name })}
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
                                No se encontraron artistas con ese filtro.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Modal para crear/editar artista */}
            <ArtistModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveArtist}
                artist={selectedArt}
            />

            {/* Diálogo de confirmación para eliminar */}
            <ConfirmDialog
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={handleDelete}
                title="Eliminar artista"
                message={`¿Estás seguro de que deseas eliminar a "${confirmDelete?.name}"? Esta acción no se puede deshacer.`}
            />
        </div>
    );
};

export default ArtistManagement;