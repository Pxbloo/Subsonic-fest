import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import TicketItem from './TicketItem';

const TicketModal = ({ isOpen, onClose, festival }) => {
  const navigate = useNavigate();

  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (festival && festival.tickets) {
      const initialQuantities = festival.tickets.reduce((acc, ticket) => ({ 
        ...acc, 
        [ticket.name]: 0 
      }), {});
      setQuantities(initialQuantities);
    }
  }, [festival, isOpen]);

  if (!isOpen || !festival) return null;

  const handleUpdate = (name, delta) => {
    setQuantities(prev => ({
      ...prev,
      [name]: Math.max(0, (prev[name] || 0) + delta)
    }));
  };

  // CORRECCIÓN: parsePrice ahora acepta números y strings, manejando comas y puntos
  const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      const normalizedPrice = price.replace(',', '.');
      return parseFloat(normalizedPrice.replace(/[^0-9.]/g, '')) || 0;
    }
    return 0;
  };

  const totalAmount = festival.tickets.reduce((total, ticket) => {
    const qty = quantities[ticket.name] || 0;
    return total + (parsePrice(ticket.price) * qty);
  }, 0);

  const handleConfirm = () => {
    const storedUser = (() => {
      try {
        return JSON.parse(localStorage.getItem('user') || 'null');
      } catch {
        return null;
      }
    })();

    const checkoutDraft = {
      orderId: crypto.randomUUID(),
      totalAmount,
      source: 'tickets',
      userId: storedUser?.id || null,
    };

    sessionStorage.setItem('checkoutDraft', JSON.stringify(checkoutDraft));
    navigate('/checkout', { state: { checkoutDraft } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-subsonic-navfooter border border-subsonic-border w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-subsonic-accent uppercase tracking-tighter">
            Entradas
          </h2>
          <button onClick={onClose} className="text-subsonic-muted hover:text-white transition-colors">✕</button>
        </div>

        <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2">
          {festival.tickets.map((ticket, index) => (
            <TicketItem 
              key={index}
              {...ticket}
              quantity={quantities[ticket.name] || 0}
              onAdd={() => handleUpdate(ticket.name, 1)}
              onRemove={() => handleUpdate(ticket.name, -1)}
            />
          ))}
        </div>

        <div className="border-t border-subsonic-border pt-6 space-y-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-subsonic-muted uppercase font-bold text-xs tracking-widest">Total</span>
            <span className="text-3xl font-black text-white">{totalAmount.toFixed(2)}€</span>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
            <Button 
              variant="primary" 
              className="flex-2" 
              disabled={totalAmount === 0}
              onClick={handleConfirm}
            >
              Confirmar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;