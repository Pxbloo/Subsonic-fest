import React from 'react';

const TicketItem = ({ name, price, quantity, onAdd, onRemove }) => {
  let displayPrice = price;
  if (typeof price === 'number') {
    displayPrice = `${price.toFixed(2)}€`;
  } else if (typeof price === 'string') {
    const normalizedPrice = price.replace(',', '.').trim();
    const hasDigits = normalizedPrice.match(/\d+/);
    const hasCurrencySymbol = normalizedPrice.match(/[€$£]/);

    if (hasDigits && !hasCurrencySymbol) {
      const numericPartMatch = normalizedPrice.match(/[0-9.]+/);
      if (numericPartMatch) {
        const numValue = parseFloat(numericPartMatch[0]);
        if (!isNaN(numValue)) {
          displayPrice = `${numValue.toFixed(2)}€`;
        }
      }
    }
  }

  return (
    <div className="flex justify-between items-center bg-subsonic-bg/50 p-4 rounded-2xl border border-subsonic-border/50">
      <div className="flex-1">
        <h4 className="font-bold text-subsonic-text uppercase text-sm">{name}</h4>
        <p className="text-subsonic-accent font-black">{displayPrice}</p>
      </div>
      
      <div className="flex items-center gap-4 bg-subsonic-bg rounded-full p-1 border border-subsonic-border">
        <button 
          onClick={onRemove}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-subsonic-border text-subsonic-text transition-colors"
        >
          -
        </button>
        <span className="w-6 text-center font-black text-subsonic-accent">
          {quantity}
        </span>
        <button 
          onClick={onAdd}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-subsonic-accent hover:text-subsonic-bg text-subsonic-text transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default TicketItem;