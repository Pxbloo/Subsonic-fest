import React, { useEffect } from "react";

export default function AuthModal({ open, mode = "login", onClose }) {
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose?.();
        };

        document.addEventListener("keydown", onKeyDown);

        // Prevent background scroll while modal is open
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = prevOverflow;
        };
    }, [open, onClose]);

    if (!open) return null;

    const title = mode === "register" ? "Crear cuenta" : "Iniciar sesión";
    const submitLabel = mode === "register" ? "Registrarme" : "Entrar";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            {/* Overlay */}
            <button
                type="button"
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
                aria-label="Cerrar"
            />

            {/* Modal panel */}
            <div className="relative z-10 w-[min(92vw,420px)] rounded-2xl border border-subsonic-border bg-subsonic-navfooter p-6 text-subsonic-text shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-black">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full px-3 py-1 text-sm font-bold hover:bg-white/10 transition"
                        aria-label="Cerrar"
                    >
                        ✕
                    </button>
                </div>

                <form
                    className="mt-5 space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        // TODO: connect to backend later
                        onClose?.();
                    }}
                >
                    {mode === "register" && (
                        <div>
                            <label className="block text-sm font-bold mb-1">Usuario</label>
                            <input
                                className="w-full rounded-xl bg-subsonic-bg/40 border border-subsonic-border px-4 py-2 outline-none focus:ring-2 focus:ring-subsonic-accent"
                                type="text"
                                placeholder="Tu usuario"
                                autoComplete="username"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold mb-1">Email</label>
                        <input
                            className="w-full rounded-xl bg-subsonic-bg/40 border border-subsonic-border px-4 py-2 outline-none focus:ring-2 focus:ring-subsonic-accent"
                            type="email"
                            placeholder="correo@ejemplo.com"
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">Contraseña</label>
                        <input
                            className="w-full rounded-xl bg-subsonic-bg/40 border border-subsonic-border px-4 py-2 outline-none focus:ring-2 focus:ring-subsonic-accent"
                            type="password"
                            placeholder="••••••••"
                            autoComplete={mode === "register" ? "new-password" : "current-password"}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-full bg-subsonic-accent px-6 py-2 font-black uppercase text-sm text-subsonic-bg hover:bg-subsonic-text transition"
                    >
                        {submitLabel}
                    </button>

                    <div className="text-center text-sm opacity-90">
                        {mode === "register" ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
                        <span className="font-bold text-subsonic-btn">
              {mode === "register" ? "Inicia sesión" : "Regístrate"}
            </span>
                        <span className="opacity-70"> TODO: Conectar luego</span>
                    </div>
                </form>
            </div>
        </div>
    );
}