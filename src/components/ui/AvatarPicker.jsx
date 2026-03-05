import React, {useId, useMemo} from "react";

const AvatarPicker = ({ value, onChange, size = 64, disabled = false}) => {

    const inputId = useId();

    const fallback = useMemo(() => {
        return "bg-subsonic-accent";
        }, []);

    const handleFile = (file) => {
        if (!file || disabled) return;
        if (!file.type.startsWith("image/")) return;

        console.log("File: ", file);
        const url = "#"
        onChange?.(url);
        // Conectar con el backend para subir la imagen
    }
    return (
        <div className={"flex flex-col items-center gap-2"}>
            <div
                className="rounded-full overflow-hidden border border-subsonic-border"
                style={{width: `${size}px`, height: `${size}px`}}
            >
                {value ? (
                    <img src={value} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <div className={`w-full h-full ${fallback}`} />
                )}
            </div>
            <input
                type="file"
                id={inputId}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
                disabled={disabled}
            />
            <label
                htmlFor={inputId}
                className="text-subsonic-text font-bold uppercase text-sm hover:text-subsonic-btn transition">
                Cambiar Avatar
            </label>
        </div>
    );
}

export default AvatarPicker;