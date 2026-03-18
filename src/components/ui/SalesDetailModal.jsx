import React from "react";
import Button from "@/components/ui/Button";

const SalesDetailModal = ({
  open,
  item,
  onClose,
  primaryActionLabel,
  onPrimaryAction,
}) => {
  if (!open || !item) return null;

  const { title, subtitle, description, imageSrc, imageAlt = "Detalle" } = item;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl border border-subsonic-border bg-subsonic-navfooter text-subsonic-text shadow-2xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest text-subsonic-muted hover:bg-white/10 hover:text-subsonic-text transition"
          onClick={onClose}
          aria-label="Cerrar detalle"
        >
          ✕
        </button>

        {imageSrc && (
          <div className="w-full aspect-video bg-subsonic-bg/60 border-b border-subsonic-border overflow-hidden">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="p-6 md:p-8 space-y-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-subsonic-muted mb-1">
              Detalle de ventas
            </p>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-subsonic-text">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-xs md:text-sm font-bold text-subsonic-muted">
                {subtitle}
              </p>
            )}
          </div>

          {description && (
            <p className="mt-4 text-sm leading-relaxed text-subsonic-text/80">
              {description}
            </p>
          )}

          {onPrimaryAction && (
            <div className="mt-5 flex justify-end">
              <Button
                variant="primarySmall"
                className="px-6 py-2 text-[11px] uppercase tracking-[0.2em]"
                onClick={onPrimaryAction}
              >
                {primaryActionLabel || "Ver detalle"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesDetailModal;
