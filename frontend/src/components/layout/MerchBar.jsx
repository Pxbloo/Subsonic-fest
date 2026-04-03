import React from "react";
import SearchBar from "@/components/ui/SearchBar.jsx";

function MerchCategoryBar({ categories, activeCategoryId, onChangeCategory,
searchValue = "", onChangeSearch, onSearch, onOpenPurchaseSummary, cartCount = 0,}) {
    return (
        <nav
            aria-label="Categorías de la tienda"
            className="
                w-full
                bg-subsonic-surface
                border-y border-subsonic-border
                backdrop-blur
            "
        >
            <div
                className="
                    flex items-center justify-between
                    px-6 py-2
                    md:px-25
                "
            >
                <div className="flex min-w-0 flex-1 items-center gap-15 overflow-x-auto">
                    {categories.map((cat) => {
                        const isActive = cat.id === activeCategoryId;

                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => onChangeCategory(cat.id)}
                                className={`
                                    whitespace-nowrap bg-transparent px-4 py-2 text-sm font-bold
                                    transition
                                ${
                                    isActive
                                        ? "bg-transparent text-subsonic-accent"
                                        : "bg-transparent text-subsonic-text/70 hover:text-subsonic-btn"
                                }
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30
                            `}
                            >
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                <div className="ml-4 flex shrink-0 items-center gap-13">
                    <div className="w-48 sm:w-56 md:w-70">
                        <SearchBar
                            value={searchValue}
                            onChange={onChangeSearch}
                            onSearch={onSearch}
                            placeholder="Buscar productos..."
                            showButton={false}
                            className="w-full"
                            inputClassName="
                                w-full
                                rounded-md
                                border border-white/10
                                bg-zinc-900/60
                                px-4 py-2
                                text-sm text-white
                                placeholder:text-white/40
                                outline-none
                                focus:ring-2 focus:ring-white/20
                            "
                        />
                    </div>

                    <button
                        type="button"
                        onClick={onOpenPurchaseSummary}
                        disabled={cartCount === 0}
                        className="bg-subsonic-accent text-subsonic-bg px-4 py-2 rounded-full font-black text-xs uppercase hover:bg-subsonic-text transition-colors disabled:opacity-40 disabled:hover:bg-subsonic-accent"
                    >
                        Compra {cartCount > 0 ? `(${cartCount})` : ""}
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default MerchCategoryBar;