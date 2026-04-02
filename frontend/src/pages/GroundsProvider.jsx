import React, { useEffect, useMemo, useState } from 'react';
import BaseCard from '@/components/ui/BaseCard.jsx';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PageHeader from '@/components/ui/PageHeader';
import groundImage from '@/assets/images/Ground.jpg';
import SearchIcon from '@/assets/icons/search.svg';
import API_BASE_URL from '@/config/api';

const GroundsProvider = ({ user }) => {
    const [grounds, setGrounds] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedGround, setSelectedGround] = useState(null);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [groundsRes, reservationsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/grounds`),
                    fetch(`${API_BASE_URL}/groundReservations`),
                ]);

                const groundsData = groundsRes.ok ? await groundsRes.json() : [];
                const reservationsData = reservationsRes.ok ? await reservationsRes.json() : [];

                setGrounds(groundsData || []);
                setReservations(reservationsData || []);
            } catch (error) {
                console.error('Error loading grounds/provider data:', error);
            }
        };

        loadData();
    }, []);

    const visibleGrounds = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return grounds;
        return grounds.filter((g) =>
            `${g.name} ${g.area}`.toLowerCase().includes(q)
        );
    }, [grounds, search]);

    const getReservation = (groundId) =>
        reservations.find((r) => r.groundId === groundId && r.status !== 'rejected');

    const handleReserve = async (ground) => {
        const existing = getReservation(ground.id);
        if (existing) return;

        const newReservation = {
            groundId: ground.id,
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

            if (!response.ok) throw new Error('Reservation failed');

            const saved = await response.json();
            setReservations((prev) => [...prev, saved]);
            setSelectedGround(null);
            setNotes('');
        } catch (error) {
            console.error('Error creating reservation:', error);
        }
    };

    return (
        <main className="min-h-screen bg-subsonic-bg pt-24 pb-12 px-6 text-subsonic-text">
            <div className="max-w-7xl mx-auto flex flex-col gap-10">
                <PageHeader title="Gestión de recintos" />

                <section className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-subsonic-accent uppercase tracking-tight">
                                Recintos disponibles
                            </h2>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-64">
                            <Input
                                placeholder="Búsqueda"
                                className="w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <img
                                src={SearchIcon}
                                alt="Buscar"
                                className="w-4 h-4 opacity-70"
                                aria-hidden="true"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visibleGrounds.map((ground) => {
                            const reservation = getReservation(ground.id);
                            const isReserved = Boolean(reservation);

                            return (
                                <div
                                    key={ground.id}
                                    className="block h-full group text-left cursor-pointer"
                                    onClick={() => setSelectedGround(ground)}
                                >
                                    <BaseCard className="relative items-stretch rounded-3xl bg-subsonic-navfooter/90">
                                        <div className="bg-subsonic-bg/80 rounded-2xl mb-4 w-full overflow-hidden aspect-4/3">
                                            <img
                                                src={groundImage}
                                                alt={ground.name}
                                                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                                            />
                                        </div>

                                        <div className="mb-3 text-left space-y-1">
                                            <p className="text-sm font-black uppercase tracking-tight text-subsonic-text">
                                                {ground.name}
                                            </p>
                                            <p className="text-[11px] text-subsonic-muted uppercase tracking-widest">
                                                {ground.area} · Aforo aprox. {ground.capacity.toLocaleString('es-ES')} personas
                                            </p>
                                        </div>

                                        <div className="mt-auto flex flex-col items-center gap-3">
                      <span className="inline-flex items-center justify-center px-6 py-1 rounded-full bg-subsonic-accent text-black text-xs font-black uppercase tracking-widest">
                        {isReserved ? reservation.status : 'Disponible'}
                      </span>

                                            <Button
                                                type="button"
                                                variant="primarySmall"
                                                className="text-xs"
                                                disabled={isReserved}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedGround(ground);
                                                }}
                                            >
                                                {isReserved ? 'No disponible' : 'Reservar'}
                                            </Button>
                                        </div>
                                    </BaseCard>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>

            {selectedGround && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-40"
                    onClick={() => setSelectedGround(null)}
                >
                    <div
                        className="w-full max-w-xl max-h-[80vh]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <BaseCard className="bg-subsonic-navfooter/90 rounded-3xl overflow-hidden p-0 flex flex-col">
                            <div className="w-full h-40 md:h-56 overflow-hidden">
                                <img
                                    src={groundImage}
                                    alt={selectedGround.name}
                                    className="w-full h-full object-cover opacity-80"
                                />
                            </div>

                            <div className="p-6 space-y-4 overflow-y-auto">
                                <div>
                                    <p className="text-subsonic-accent text-xs font-bold uppercase tracking-widest mb-1">
                                        {selectedGround.area}
                                    </p>
                                    <h1 className="text-2xl font-black uppercase tracking-tight mb-1">
                                        {selectedGround.name}
                                    </h1>
                                    <p className="text-xs text-subsonic-muted uppercase tracking-widest">
                                        Aforo estimado {selectedGround.capacity.toLocaleString('es-ES')} personas
                                    </p>
                                </div>

                                <div className="text-sm text-subsonic-text/80 space-y-1">
                                    <p>
                                        Estado:{' '}
                                        <span className="font-black text-subsonic-accent uppercase">
                      {selectedGround.status}
                    </span>
                                    </p>
                                    <p>
                                        Solicita la reserva para rentar este espacio. Un administrador revisará tu petición.
                                    </p>
                                </div>

                                <Input
                                    label="Notas para la reserva"
                                    placeholder="Describe el uso previsto, fechas, necesidades..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />

                                <div className="pt-4 mt-4 border-t border-subsonic-border flex flex-wrap gap-3 justify-between">
                                    <Button
                                        type="button"
                                        variant="primarySmall"
                                        className="text-xs"
                                        onClick={() => handleReserve(selectedGround)}
                                        disabled={Boolean(getReservation(selectedGround.id))}
                                    >
                                        {getReservation(selectedGround.id) ? 'Ya reservada' : 'Enviar reserva'}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="text-xs"
                                        onClick={() => setSelectedGround(null)}
                                    >
                                        Cerrar
                                    </Button>
                                </div>
                            </div>
                        </BaseCard>
                    </div>
                </div>
            )}
        </main>
    );
};

export default GroundsProvider;