import React, { useEffect, useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SearchBar from '@/components/ui/SearchBar.jsx';
import groundImage from '@/assets/images/Ground.jpg';
import API_BASE_URL from '@/config/api';

const groundStatusStyles = {
    Operativo: 'bg-green-500/20 text-green-300',
    'En montaje': 'bg-yellow-500/20 text-yellow-300',
    'Solo staff': 'bg-red-500/20 text-red-300',
};

const reservationStatusStyles = {
    pending: 'bg-yellow-500/20 text-yellow-300',
    approved: 'bg-green-500/20 text-green-300',
    rejected: 'bg-red-500/20 text-red-300',
};

const GroundsProvider = ({ user }) => {
    const [grounds, setGrounds] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [reservationFilter, setReservationFilter] = useState('all');
    const [groundStatusFilter, setGroundStatusFilter] = useState('all');
    const [selectedGround, setSelectedGround] = useState(null);
    const [notes, setNotes] = useState('');
    const [canSubmit, setCanSubmit] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [groundsRes, reservationsRes] = await Promise.allSettled([
                    fetch(`${API_BASE_URL}/grounds`),
                    fetch(`${API_BASE_URL}/groundReservations`),
                ]);

                if (groundsRes.status === 'fulfilled' && groundsRes.value.ok) {
                    const groundsData = await groundsRes.value.json();
                    setGrounds(Array.isArray(groundsData) ? groundsData : []);
                } else {
                    setGrounds([]);
                }

                if (reservationsRes.status === 'fulfilled' && reservationsRes.value.ok) {
                    const reservationsData = await reservationsRes.value.json();
                    setReservations(Array.isArray(reservationsData) ? reservationsData : []);
                } else {
                    setReservations([]);
                }
            } catch (error) {
                console.error('Error loading grounds/provider data:', error);
                setGrounds([]);
                setReservations([]);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const reservationByGroundId = useMemo(() => {
        const map = new Map();
        for (const reservation of reservations || []) {
            const groundId = String(reservation?.groundId || '').trim();
            const status = String(reservation?.status || '').toLowerCase();

            if (!groundId || status === 'rejected') continue;
            if (!map.has(groundId)) map.set(groundId, reservation);
        }
        return map;
    }, [reservations]);

    const groundStatusOptions = useMemo(() => {
        return [...new Set(
            (grounds || [])
                .map((ground) => String(ground?.status || '').trim())
                .filter(Boolean)
        )];
    }, [grounds]);

    const filteredGrounds = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        return (grounds || []).filter((ground) => {
            const reservation = reservationByGroundId.get(String(ground?.id || ''));
            const isReserved = Boolean(reservation);

            const matchesTerm =
                !term ||
                [ground.id, ground.name, ground.area, ground.status, ground.capacity]
                    .filter(Boolean)
                    .some((value) => String(value).toLowerCase().includes(term));

            const matchesReservation =
                reservationFilter === 'all' ||
                (reservationFilter === 'available' && !isReserved) ||
                (reservationFilter === 'reserved' && isReserved);

            const matchesGroundStatus =
                groundStatusFilter === 'all' ||
                String(ground?.status || '').trim() === groundStatusFilter;

            return matchesTerm && matchesReservation && matchesGroundStatus;
        });
    }, [grounds, groundStatusFilter, reservationByGroundId, reservationFilter, searchTerm]);

    const getReservationLabel = (reservation) => {
        if (!reservation) return 'Disponible';
        const status = String(reservation?.status || '').toLowerCase();

        if (status === 'pending') return 'Pendiente';
        if (status === 'approved') return 'Aprobada';
        if (status === 'rejected') return 'Rechazada';
        return String(reservation?.status || 'Reservado');
    };

    const getReservationBadgeClass = (reservation) => {
        if (!reservation) return 'bg-green-500/20 text-green-300';
        const status = String(reservation?.status || '').toLowerCase();
        return reservationStatusStyles[status] || 'bg-subsonic-border text-subsonic-muted';
    };

    const getGroundImage = (ground) => String(ground?.image || '').trim() || groundImage;

    const openGroundDetail = (ground) => {
        setSelectedGround(ground);
        setNotes('');
    };

    const closeGroundDetail = () => {
        setSelectedGround(null);
        setNotes('');
    };

    const handleReserve = async (ground) => {
        const groundId = String(ground?.id || '').trim();
        if (!groundId) return;
        if (!canSubmit) return;
        if (reservationByGroundId.has(groundId)) return;

        setCanSubmit(false);

        const newReservation = {
            groundId,
            providerId: user?.id,
            providerName: user?.name,
            status: 'pending',
            createdAt: new Date().toISOString(),
            notes: notes.trim(),
        };

        try {
            const response = await fetch(`${API_BASE_URL}/groundReservations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReservation),
            });

            if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
            }

            let savedReservation = null;
            try {
                savedReservation = await response.json();
            } catch {
                savedReservation = null;
            }

            const reservationRecord = savedReservation?.groundId
                ? savedReservation
                : newReservation;

            setReservations((prev) => [...prev, reservationRecord]);
            closeGroundDetail();
        } catch (error) {
            console.error('Error creating reservation:', error);
        } finally {
            setCanSubmit(true);
        }
    };

    if (loading) {
        return <div className="text-center p-8">Cargando recintos...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-black text-subsonic-accent uppercase tracking-tight">
                    Mis Recintos
                </h1>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-3 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Buscar por nombre, id, área, estado o capacidad..."
                        showButton={false}
                        className="w-full"
                        inputClassName="w-full rounded-md border border-subsonic-border bg-subsonic-surface px-4 py-2 text-sm text-subsonic-text placeholder:text-subsonic-muted outline-none focus:ring-2 focus:ring-subsonic-accent/30"
                    />
                </div>

                <div className="lg:col-span-2">
                    <select
                        value={reservationFilter}
                        onChange={(event) => setReservationFilter(event.target.value)}
                        className="w-full rounded-md border border-subsonic-border bg-subsonic-surface px-4 py-2 text-sm text-subsonic-text outline-none focus:ring-2 focus:ring-subsonic-accent/30"
                    >
                        <option value="all">Reserva (todas)</option>
                        <option value="available">Disponibles</option>
                        <option value="reserved">Reservadas</option>
                    </select>
                </div>

                <div className="lg:col-span-3">
                    <select
                        value={groundStatusFilter}
                        onChange={(event) => setGroundStatusFilter(event.target.value)}
                        className="w-full rounded-md border border-subsonic-border bg-subsonic-surface px-4 py-2 text-sm text-subsonic-text outline-none focus:ring-2 focus:ring-subsonic-accent/30"
                    >
                        <option value="all">Estado (todos)</option>
                        {groundStatusOptions.map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-subsonic-navfooter border border-subsonic-border rounded-2xl overflow-hidden">
                <div className="w-full overflow-x-auto">
                    <table className="min-w-225 w-full divide-y divide-subsonic-border">
                        <thead className="bg-subsonic-surface/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Área</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Capacidad</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Estado recinto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Estado reserva</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Foto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-subsonic-border">
                            {filteredGrounds.length > 0 ? (
                                filteredGrounds.map((ground) => {
                                    const reservation = reservationByGroundId.get(String(ground.id));
                                    const isReserved = Boolean(reservation);

                                    return (
                                        <tr key={ground.id} className="hover:bg-subsonic-surface/20 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{ground.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{ground.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{ground.area || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{Number(ground.capacity || 0).toLocaleString('es-ES')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${groundStatusStyles[ground.status] || 'bg-subsonic-border text-subsonic-muted'}`}>
                                                    {ground.status || 'N/D'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getReservationBadgeClass(reservation)}`}>
                                                    {getReservationLabel(reservation)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ground.image ? 'bg-green-500/20 text-green-300' : 'bg-subsonic-border text-subsonic-muted'}`}>
                                                    {ground.image ? 'Sí' : 'No'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                                <Button
                                                    onClick={() => openGroundDetail(ground)}
                                                    className="bg-subsonic-border text-subsonic-accent hover:text-opacity-80 hover:bg-subsonic-accent hover:text-subsonic-bg px-6 py-2"
                                                    variant=""
                                                >
                                                    Ver
                                                </Button>
                                                <Button
                                                    onClick={() => openGroundDetail(ground)}
                                                    className="bg-subsonic-border text-green-300 hover:bg-green-500 hover:text-subsonic-bg px-6 py-2"
                                                    variant=""
                                                    disabled={isReserved}
                                                >
                                                    {isReserved ? 'Reservado' : 'Reservar'}
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-10 text-center text-sm text-subsonic-muted">
                                        No se encontraron recintos con los filtros actuales.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedGround && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6"
                    onClick={closeGroundDetail}
                >
                    <div
                        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-subsonic-border bg-subsonic-navfooter shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex shrink-0 items-center justify-between border-b border-subsonic-border px-6 py-4">
                            <h2 className="text-xl font-black uppercase tracking-tight text-subsonic-accent">Detalle del recinto</h2>
                            <button
                                type="button"
                                onClick={closeGroundDetail}
                                className="text-lg text-subsonic-muted hover:text-subsonic-text"
                                aria-label="Cerrar modal"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-6 overflow-y-auto p-6 md:grid-cols-2">
                            <div className="overflow-hidden rounded-xl border border-subsonic-border bg-subsonic-surface">
                                <img
                                    src={getGroundImage(selectedGround)}
                                    alt={selectedGround.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-subsonic-muted">{selectedGround.area || 'Área no definida'}</p>
                                    <h3 className="text-2xl font-black uppercase tracking-tight text-subsonic-text">{selectedGround.name}</h3>
                                </div>

                                <p className="text-sm text-subsonic-text/80">
                                    Aforo aproximado: <span className="font-black text-subsonic-text">{Number(selectedGround.capacity || 0).toLocaleString('es-ES')}</span> personas
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${groundStatusStyles[selectedGround.status] || 'bg-subsonic-border text-subsonic-muted'}`}>
                                        {selectedGround.status || 'N/D'}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getReservationBadgeClass(reservationByGroundId.get(String(selectedGround.id)))}`}>
                                        {getReservationLabel(reservationByGroundId.get(String(selectedGround.id)))}
                                    </span>
                                </div>

                                <Input
                                    label="Notas para la reserva"
                                    placeholder="Describe el uso previsto, fechas y necesidades..."
                                    value={notes}
                                    onChange={(event) => setNotes(event.target.value)}
                                />

                                <div className="flex justify-end gap-3 border-t border-subsonic-border pt-4">
                                    <Button
                                        type="button"
                                        onClick={() => handleReserve(selectedGround)}
                                        className="bg-subsonic-accent px-5 py-2 text-subsonic-bg"
                                        disabled={Boolean(reservationByGroundId.get(String(selectedGround.id))) || !canSubmit}
                                    >
                                        {reservationByGroundId.get(String(selectedGround.id)) ? 'Ya reservado' : 'Enviar reserva'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroundsProvider;