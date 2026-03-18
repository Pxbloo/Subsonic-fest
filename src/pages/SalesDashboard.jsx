import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import HorizontalCarousel from "@/components/ui/HorizontalCarousel";
import DashboardCard from "@/components/ui/DashboardCard";
import SalesDetailModal from "@/components/ui/SalesDetailModal";
import useSalesDashboard from "@/hooks/useSalesDashboard";
import salesPlaceholder from "@/assets/images/Sales.png";
import SearchIcon from "@/assets/icons/search.svg";

const SalesDashboard = () => {
  const {
    searchTerm,
    filteredFestivals,
    filteredGrounds,
    handleSearchChange,
  } = useSalesDashboard();

  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="font-inter">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10">
        <PageHeader title="Ventas" className="mb-0" />

        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          onSearch={handleSearchChange}
          placeholder="Búsqueda"
          className="w-full md:w-80 flex items-center bg-subsonic-navfooter border border-subsonic-border rounded-full px-4 py-2 gap-2"
          inputClassName="bg-transparent outline-none text-subsonic-text placeholder:text-subsonic-muted flex-1 text-sm"
          showButton={true}
          buttonLabel={
            <img
              src={SearchIcon}
              alt="Buscar"
              className="w-4 h-4 opacity-70"
            />
          }
          buttonClassName="text-subsonic-muted hover:text-subsonic-accent text-lg flex items-center justify-center"
        />
      </div>

      <section className="mb-12">
        <h2 className="text-subsonic-accent text-2xl font-black uppercase tracking-tight mb-4">
          Mis festivales
        </h2>
        <HorizontalCarousel
          items={filteredFestivals}
          renderItem={(festival) => (
            <DashboardCard
              title={festival.title}
              subtitle={festival.location}
              imageSrc={salesPlaceholder}
              imageAlt="Gráfico de ventas del festival"
              onClick={() =>
                setSelectedItem({
                  type: "festival",
                  id: festival.id,
                  title: festival.title,
                  subtitle: festival.location,
                  description: festival.description,
                  imageSrc: salesPlaceholder,
                  imageAlt: `Detalle de ventas de ${festival.title}`,
                })
              }
            />
          )}
        />
      </section>

      <section>
        <h2 className="text-subsonic-accent text-2xl font-black uppercase tracking-tight mb-4">
          Mis recintos
        </h2>
        <HorizontalCarousel
          items={filteredGrounds}
          renderItem={(ground) => (
            <DashboardCard
              title={ground.name}
              subtitle={ground.area}
              imageSrc={salesPlaceholder}
              imageAlt="Gráfico de ventas del recinto"
              onClick={() =>
                setSelectedItem({
                  type: "ground",
                  title: ground.name,
                  subtitle: ground.area,
                  description: `Estado: ${ground.status} · Aforo aproximado: ${ground.capacity?.toLocaleString?.("es-ES") ?? ground.capacity} personas`,
                  imageSrc: salesPlaceholder,
                  imageAlt: `Detalle de ventas de ${ground.name}`,
                })
              }
            />
          )}
        />
      </section>

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
