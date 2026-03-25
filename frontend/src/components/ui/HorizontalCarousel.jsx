import React, { useRef } from "react";

const HorizontalCarousel = ({
  items,
  renderItem,
  getKey,
  emptyMessage = "No hay elementos para mostrar.",
  scrollAmount = 320,
}) => {
  const containerRef = useRef(null);

  const scrollBy = (direction) => {
    if (!containerRef.current) return;
    const offset = direction === "left" ? -scrollAmount : scrollAmount;
    containerRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  if (!items || items.length === 0) {
    return (
      <p className="text-subsonic-muted text-sm">{emptyMessage}</p>
    );
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto pb-4 pr-8"
      >
        {items.map((item, index) => (
          <div
            key={getKey ? getKey(item, index) : item.id ?? index}
            className="shrink-0 w-72 max-w-full"
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Desplazar a la izquierda"
        onClick={() => scrollBy("left")}
        className="hidden md:flex absolute inset-y-0 left-0 items-center justify-center translate-x-[-50%]"
      >
        <div className="w-8 h-8 rounded-full bg-subsonic-navfooter/80 border border-subsonic-border text-subsonic-text flex items-center justify-center text-lg hover:border-subsonic-accent">
          &lt;
        </div>
      </button>

      <button
        type="button"
        aria-label="Desplazar a la derecha"
        onClick={() => scrollBy("right")}
        className="hidden md:flex absolute inset-y-0 right-0 items-center justify-center translate-x-[50%]"
      >
        <div className="w-8 h-8 rounded-full bg-subsonic-navfooter/80 border border-subsonic-border text-subsonic-text flex items-center justify-center text-lg hover:border-subsonic-accent">
          &gt;
        </div>
      </button>
    </div>
  );
};

export default HorizontalCarousel;
