import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/ui/SearchBar";
import Button from "@/components/ui/Button";
import SalesDetailModal from "@/components/ui/SalesDetailModal";
import useSalesDashboard from "@/hooks/useSalesDashboard";
import salesPlaceholder from "@/assets/images/Sales.png";

const groundStatusStyles = {
  Operativo: "bg-green-500/20 text-green-300",
  "En montaje": "bg-yellow-500/20 text-yellow-300",
  "Solo staff": "bg-red-500/20 text-red-300",
};

const SalesDashboard = () => {
  const {
    loading,
    searchTerm,
    festivals,
    grounds,
    filteredFestivals,
    filteredGrounds,
    handleSearchChange,
  } = useSalesDashboard();

  const [selectedItem, setSelectedItem] = useState(null);
  const [viewFilter, setViewFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [groundStatusFilter, setGroundStatusFilter] = useState("all");
  const navigate = useNavigate();

  const locationOptions = useMemo(() => {
    return [...new Set(
      (festivals || [])
        .map((festival) => String(festival?.location || "").trim())
        .filter(Boolean)
    )];
  }, [festivals]);

  const groundStatusOptions = useMemo(() => {
    return [...new Set(
      (grounds || [])
        .map((ground) => String(ground?.status || "").trim())
        .filter(Boolean)
    )];
  }, [grounds]);

  const visibleFestivals = useMemo(() => {
    return (filteredFestivals || []).filter((festival) => {
      if (locationFilter === "all") return true;
      return String(festival?.location || "").trim() === locationFilter;
    });
  }, [filteredFestivals, locationFilter]);

  const visibleGrounds = useMemo(() => {
    return (filteredGrounds || []).filter((ground) => {
      if (groundStatusFilter === "all") return true;
      return String(ground?.status || "").trim() === groundStatusFilter;
    });
  }, [filteredGrounds, groundStatusFilter]);

  const showFestivals = viewFilter === "all" || viewFilter === "festivals";
  const showGrounds = viewFilter === "all" || viewFilter === "grounds";

  const openFestivalDetail = (festival) => {
    const ticketsCount = Array.isArray(festival?.tickets) ? festival.tickets.length : 0;
    const artistsCount = Array.isArray(festival?.lineup) ? festival.lineup.length : 0;

    setSelectedItem({
      type: "festival",
      id: festival?.id,
      title: festival?.title,
      subtitle: festival?.location,
      description:
        festival?.description ||
        `Artistas: ${artistsCount} · Entradas: ${ticketsCount}`,
      imageSrc: festival?.image || salesPlaceholder,
      imageAlt: `Detalle de ventas de ${festival?.title || "festival"}`,
    });
  };

  const openGroundDetail = (ground) => {
    setSelectedItem({
      type: "ground",
      id: ground?.id,
      title: ground?.name,
      subtitle: ground?.area,
      description: `Estado: ${ground?.status || "N/D"} · Aforo aproximado: ${Number(ground?.capacity || 0).toLocaleString("es-ES")} personas`,
      imageSrc: ground?.image || salesPlaceholder,
      imageAlt: `Detalle de ventas de ${ground?.name || "recinto"}`,
    });
  };

  if (loading) {
    return <div className="text-center p-8">Cargando ventas...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black text-subsonic-accent uppercase tracking-tight">
          Mis Ventas
        </h1>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar por nombre, id, fecha, ubicación o estado..."
            showButton={false}
            className="w-full"
            inputClassName="w-full rounded-md border border-subsonic-border bg-subsonic-surface px-4 py-2 text-sm text-subsonic-text placeholder:text-subsonic-muted outline-none focus:ring-2 focus:ring-subsonic-accent/30"
          />
        </div>

        <div className="lg:col-span-2">
          <select
            value={viewFilter}
            onChange={(event) => setViewFilter(event.target.value)}
            className="w-full rounded-md border border-subsonic-border bg-subsonic-surface px-4 py-2 text-sm text-subsonic-text outline-none focus:ring-2 focus:ring-subsonic-accent/30"
          >
            <option value="all">Todo</option>
            <option value="festivals">Festivales</option>
            <option value="grounds">Recintos</option>
          </select>
        </div>

        <div className="lg:col-span-2">
          <select
            value={locationFilter}
            onChange={(event) => setLocationFilter(event.target.value)}
            className="w-full rounded-md border border-subsonic-border bg-subsonic-surface px-4 py-2 text-sm text-subsonic-text outline-none focus:ring-2 focus:ring-subsonic-accent/30"
          >
            <option value="all">Ubicación (todas)</option>
            {locationOptions.map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <select
            value={groundStatusFilter}
            onChange={(event) => setGroundStatusFilter(event.target.value)}
            className="w-full rounded-md border border-subsonic-border bg-subsonic-surface px-4 py-2 text-sm text-subsonic-text outline-none focus:ring-2 focus:ring-subsonic-accent/30"
          >
            <option value="all">Estado recinto (todos)</option>
            {groundStatusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {showFestivals && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-black uppercase tracking-tight text-subsonic-accent">Mis festivales</h2>
          <div className="bg-subsonic-navfooter border border-subsonic-border rounded-2xl overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="min-w-225 w-full divide-y divide-subsonic-border">
                <thead className="bg-subsonic-surface/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Título</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Ubicación</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Artistas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Entradas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Foto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-subsonic-border">
                  {visibleFestivals.length > 0 ? (
                    visibleFestivals.map((festival) => (
                      <tr key={festival.id} className="hover:bg-subsonic-surface/20 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{festival.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{festival.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{festival.date || festival.startDate || '-'}</td>
                        <td className="px-6 py-4 text-sm text-subsonic-text max-w-xs truncate" title={festival.location || ''}>{festival.location || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{Array.isArray(festival.lineup) ? festival.lineup.length : 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{Array.isArray(festival.tickets) ? festival.tickets.length : 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${festival.image ? 'bg-green-500/20 text-green-300' : 'bg-subsonic-border text-subsonic-muted'}`}>
                            {festival.image ? 'Sí' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <Button
                            onClick={() => openFestivalDetail(festival)}
                            className="bg-subsonic-border text-subsonic-accent hover:text-opacity-80 hover:bg-subsonic-accent hover:text-subsonic-bg px-6 py-2"
                            variant=""
                          >
                            Detalle
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-10 text-center text-sm text-subsonic-muted">
                        No se encontraron festivales con los filtros actuales.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {showGrounds && (
        <section>
          <h2 className="mb-3 text-lg font-black uppercase tracking-tight text-subsonic-accent">Mis recintos</h2>
          <div className="bg-subsonic-navfooter border border-subsonic-border rounded-2xl overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="min-w-225 w-full divide-y divide-subsonic-border">
                <thead className="bg-subsonic-surface/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Área</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Capacidad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Foto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-subsonic-border">
                  {visibleGrounds.length > 0 ? (
                    visibleGrounds.map((ground) => (
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
                            Detalle
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-10 text-center text-sm text-subsonic-muted">
                        No se encontraron recintos con los filtros actuales.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <SalesDetailModal
        open={Boolean(selectedItem)}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        primaryActionLabel={
          selectedItem?.type === "festival" ? "Ver festival" : undefined
        }
        onPrimaryAction={
          selectedItem?.type === "festival" && selectedItem?.id
            ? () => {
                navigate(`/festival/${selectedItem.id}`);
                setSelectedItem(null);
              }
            : undefined
        }
      />
    </div>
  );
};

export default SalesDashboard;
