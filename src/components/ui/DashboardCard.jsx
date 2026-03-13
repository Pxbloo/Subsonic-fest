import React from "react";
import BaseCard from "@/components/ui/BaseCard";
import Button from "@/components/ui/Button";

const DashboardCard = ({
  title,
  subtitle,
  imageSrc,
  imageAlt = "Visualización",
  buttonLabel = "Ver detalle",
  buttonVariant = "primarySmall",
  onClick,
}) => {
  return (
    <BaseCard className="h-full">
      <div
        className="w-full aspect-video bg-subsonic-border rounded-lg mb-6 overflow-hidden flex items-center justify-center cursor-pointer"
        onClick={onClick}
      >
        {imageSrc && (
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex items-center justify-between gap-4 mt-auto">
        <div className="text-left">
          <h3 className="text-subsonic-text font-bold text-lg leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-subsonic-muted text-xs mt-1 line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>
        <Button variant={buttonVariant} onClick={onClick}>
          {buttonLabel}
        </Button>
      </div>
    </BaseCard>
  );
};

export default DashboardCard;
