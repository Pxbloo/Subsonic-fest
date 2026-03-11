import { useId, useState } from "react";

const SearchBar = ({
                       value, // opcional (controlado)
                       defaultValue = "", // opcional (no controlado)
                       onChange, // (term: string) => void  -> para búsqueda “en vivo”
                       onSearch, // (term: string) => void  -> al enviar el formulario
                       placeholder = "Buscar...",
                       className = "",
                       inputClassName = "",
                       buttonClassName = "",
                       buttonLabel = "Buscar",
                       showButton = true,
                       autoSubmitOnChange = false,
                       name = "q",
                       disabled = false,
                   }) => {
    const inputId = useId();
    const isControlled = value !== undefined;

    const [internalTerm, setInternalTerm] = useState(defaultValue);
    const term = isControlled ? value : internalTerm;

    const emitChange = (next) => {
        if (!isControlled) setInternalTerm(next);
        onChange?.(next);
        if (autoSubmitOnChange) onSearch?.(next);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch?.(term);
    };

    return (
        <form onSubmit={handleSubmit} className={`search-bar ${className}`}>
            <label htmlFor={inputId} className="sr-only">
                Buscar
            </label>

            <input
                id={inputId}
                name={name}
                type="search"
                value={term}
                onChange={(e) => emitChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete="off"
                className={inputClassName}
            />

            {showButton && (
                <button
                    type="submit"
                    disabled={disabled}
                    className={buttonClassName}
                >
                    {buttonLabel}
                </button>
            )}
        </form>
    );
};

export default SearchBar;