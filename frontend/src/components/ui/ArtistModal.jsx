import React, {useEffect, useState} from 'react';
import Button from "@/components/ui/Button.jsx";
import Input from "@/components/ui/Input.jsx";
import API_BASE_URL from "@/config/api.js";

const emptyArtist = {
    id: '',
    name: '',
    email: '',
    phone: '',
    genre: '',
    spotifyId: '',
    description: '',
    address: {
        country: '',
        city: '',
        street: '',
        postalCode: ''
    }
};

const normalizeArtistId = (name) =>
    String(name || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

const mergeArtistWithDefaults = (artist = {}) => ({
    ...emptyArtist,
    ...artist,
    phone: artist.phone ?? '',
    genre: artist.genre ?? '',
    spotifyId: artist.spotifyId ?? '',
    description: artist.description ?? '',
    address: {
        ...emptyArtist.address,
        ...(artist.address ?? {}),
    },
});

const ArtistModal = ({ isOpen, onClose, onSave, artist }) => {

    const [artistData, setArtistData] = useState(emptyArtist);
    const [festivals, setFestivals] = useState([]);

    useEffect(() => {
        if (artist) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setArtistData(mergeArtistWithDefaults(artist));
        } else {
            setArtistData(emptyArtist);
        }
    }, [artist, isOpen]);

    useEffect(() => {
        const fetchFestivals = async () => {
            if (!isOpen || !artist?.id) {
                setFestivals([]);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/festivals`);
                if (!response.ok) {
                    console.error('Failed to fetch festivals:', response.statusText);
                    setFestivals([]);
                    return;
                }

                const data = await response.json();
                const matchedFestivals = data.filter((festival) =>
                    Array.isArray(festival.lineup) &&
                    festival.lineup.some((lineupArtist) => lineupArtist.id === artist.id)
                );

                setFestivals(matchedFestivals);
            } catch (error) {
                console.error('Error fetching festivals:', error);
                setFestivals([]);
            }
        };

        fetchFestivals();
    }, [artist?.id, isOpen]);

    useEffect(() => {
        if (!artist) {
            const generatedId = normalizeArtistId(artistData.name);
            if (generatedId && artistData.id !== generatedId) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setArtistData((prev) => ({
                    ...prev,
                    id: generatedId
                }));
            }
        }
    }, [artist, artistData.name, artistData.id]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSave) {
            onSave(artistData);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setArtistData(prev => ({
                ...prev,
                address: { ...prev.address, [field]: value }
            }));
            return;
        }

        setArtistData(prev => {
            const next = { ...prev, [name]: value };

            if (!artist && name === 'name') {
                next.id = normalizeArtistId(value);
            }

            return next;
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-subsonic-border bg-subsonic-navfooter shadow-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between border-b border-subsonic-border px-6 py-4 shrink-0">
                    <h2 className="text-xl font-black text-subsonic-accent uppercase tracking-tight">
                        {artist ? artistData.name : 'Nuevo artista'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-subsonic-muted hover:text-subsonic-text text-lg"
                        aria-label="Cerrar modal"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Nombre"
                            name="name"
                            value={artistData.name}
                            onChange={handleChange}
                            placeholder="Nombre del artista"
                            required
                        />
                        <Input
                            label="ID"
                            name="id"
                            value={artistData.id}
                            onChange={handleChange}
                            placeholder="nombre-del-artista"
                            required
                        />
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={artistData.email}
                            onChange={handleChange}
                            placeholder="email@artista.com"
                            required
                        />
                        <Input
                            label="Teléfono (opcional)"
                            name="phone"
                            value={artistData.phone}
                            onChange={handleChange}
                            placeholder="+34 600 000 000"
                        />
                        <Input
                            label="Género"
                            name="genre"
                            value={artistData.genre}
                            onChange={handleChange}
                            placeholder="Reggaeton / Trap"
                            required
                        />
                        <Input
                            label="Spotify ID"
                            name="spotifyId"
                            value={artistData.spotifyId}
                            onChange={handleChange}
                            placeholder="ID de Spotify"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-subsonic-muted">
                            Descripción
                        </label>
                        <textarea
                            name="description"
                            value={artistData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Descripción del artista"
                            className="w-full rounded-md border border-subsonic-border bg-subsonic-surface px-4 py-2 text-sm text-subsonic-text placeholder:text-subsonic-muted outline-none focus:ring-2 focus:ring-subsonic-accent/30"
                        />
                    </div>

                    <div>
                        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-subsonic-accent">
                            Dirección
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="País"
                                name="address.country"
                                value={artistData.address.country}
                                onChange={handleChange}
                                placeholder="España"
                            />
                            <Input
                                label="Ciudad"
                                name="address.city"
                                value={artistData.address.city}
                                onChange={handleChange}
                                placeholder="Madrid"
                            />
                            <Input
                                label="Calle"
                                name="address.street"
                                value={artistData.address.street}
                                onChange={handleChange}
                                placeholder="Calle principal 123"
                            />
                            <Input
                                label="Código postal"
                                name="address.postalCode"
                                value={artistData.address.postalCode}
                                onChange={handleChange}
                                placeholder="28001"
                            />
                        </div>
                    </div>

                    {artist && (
                        <div className="rounded-xl border border-subsonic-border bg-subsonic-surface/40 p-4">
                            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-subsonic-accent">
                                Festivales asociados
                            </h3>

                            {festivals.length > 0 ? (
                                <div className="space-y-3">
                                    {festivals.map((festival) => (
                                        <div
                                            key={festival.id}
                                            className="rounded-lg border border-subsonic-border bg-subsonic-navfooter px-4 py-3"
                                        >
                                            <p className="font-semibold text-subsonic-text">{festival.title}</p>
                                            <p className="text-sm text-subsonic-muted">
                                                {festival.date} · {festival.location}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-subsonic-muted">
                                    Este artista no aparece en ningún festival.
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 border-t border-subsonic-border pt-4">
                        <Button
                            type="button"
                            onClick={onClose}
                            className="bg-subsonic-accent text-subsonic-bg px-5 py-2"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-subsonic-accent text-subsonic-bg px-5 py-2"
                        >
                            Guardar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ArtistModal;