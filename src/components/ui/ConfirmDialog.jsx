import React from 'react';
import Button from "@/components/ui/Button.jsx";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-subsonic-surface border border-subsonic-border p-6 rounded-lg w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-bold text-subsonic-text mb-2">{title}</h3>
                <p className="text-subsonic-text/80 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <Button
                        onClick={onClose}
                        className="px-4 py-2 border border-subsonic-border text-subsonic-muted hover:text-subsonic-text transition"
                        variant=''
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 bg-red-500 text-black hover:text-white hover:bg-red-600 transition"
                        variant=''
                    >
                        Eliminar
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;