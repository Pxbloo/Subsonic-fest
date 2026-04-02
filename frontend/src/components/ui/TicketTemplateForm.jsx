import React from 'react';
import BaseCard from './BaseCard';
import Input from './Input';
import Button from './Button';

const TicketTemplateForm = ({ data, onChange, onSave, onCancel }) => {

  const handleFeaturesChange = (e) => {
    onChange({ ...data, features: e.target.value });
  };

  return (
    <form onSubmit={onSave} className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <BaseCard className="border-l-4 border-l-subsonic-accent">
        <h2 className="text-xl font-black text-subsonic-accent uppercase mb-6 font-montserrat tracking-tight">
          Configuración de la Planilla
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Nombre de la Planilla" 
            placeholder="Ej: Abono VIP"
            value={data.name || ''} 
            onChange={e => onChange({...data, name: e.target.value})} 
            required 
          />
          <Input 
            label="Precio de Referencia (€)" 
            placeholder="Ej: 99.99"
            type="text" 
            value={data.price || ''} 
            onChange={e => onChange({...data, price: e.target.value})} 
            required 
          />
        </div>

        <div className="mt-6">
          <label className="block text-xs font-montserrat text-subsonic-muted uppercase tracking-widest mb-2 ml-1">
            Beneficios Incluidos (separados por comas)
          </label>
          <textarea 
            className="w-full bg-subsonic-bg border border-subsonic-border p-4 rounded-xl text-subsonic-text text-sm focus:border-subsonic-accent outline-none min-h-[120px] transition-all hover:border-subsonic-accent/50"
            placeholder="Ej: Acceso Prioritario, Barra Libre, Merchandising Oficial..."
            value={Array.isArray(data.features) ? data.features.join(', ') : data.features || ''}
            onChange={handleFeaturesChange}
            required
          />
        </div>
      </BaseCard>

      <div className="flex gap-4 sticky bottom-4 bg-subsonic-bg/80 backdrop-blur-md p-4 rounded-2xl border border-subsonic-border shadow-2xl z-10">
        <Button type="submit" variant="primary" className="flex-1">
          {data.id ? 'Actualizar Planilla' : 'Guardar Nueva Planilla'}
        </Button>
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default TicketTemplateForm;