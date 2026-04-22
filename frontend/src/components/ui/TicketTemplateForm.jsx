import React, { useEffect, useState } from 'react';
import Input from './Input';
import Button from './Button';

const emptyTemplate = {
  id: '',
  name: '',
  features: '',
  price: ''
};

const normalizeTemplateId = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const mergeTemplateWithDefaults = (template = {}) => ({
  ...emptyTemplate,
  ...template,
  features: Array.isArray(template.features) ? template.features.join(', ') : (template.features ?? ''),
  price: template.price ?? ''
});

const TicketTemplateForm = ({ isOpen, onClose, onSave, template }) => {
  const [templateData, setTemplateData] = useState(emptyTemplate);

  useEffect(() => {
    if (template) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTemplateData(mergeTemplateWithDefaults(template));
    } else {
      setTemplateData(emptyTemplate);
    }
  }, [template, isOpen]);

  useEffect(() => {
    if (!template) {
      const generatedId = normalizeTemplateId(templateData.name);
      if (generatedId && templateData.id !== generatedId) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTemplateData((prev) => ({
          ...prev,
          id: generatedId,
        }));
      }
    }
  }, [template, templateData.name, templateData.id]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplateData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedPrice = Number(templateData.price);

    onSave?.({
      ...templateData,
      price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
      features: String(templateData.features || '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-subsonic-border bg-subsonic-navfooter shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-subsonic-border px-6 py-4">
          <h2 className="text-xl font-black uppercase tracking-tight text-subsonic-accent">
            {template ? 'Editar plantilla de entrada' : 'Nueva plantilla de entrada'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-lg text-subsonic-muted hover:text-subsonic-text"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Nombre"
              name="name"
              value={templateData.name}
              onChange={handleChange}
              placeholder="Abono VIP"
              required
            />
            <Input
              label="ID"
              name="id"
              value={templateData.id}
              onChange={handleChange}
              placeholder="abono-vip"
              required
            />
            <Input
              label="Precio (€)"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={templateData.price}
              onChange={handleChange}
              placeholder="99.99"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-subsonic-muted">
              Beneficios (separados por comas)
            </label>
            <textarea
              name="features"
              value={templateData.features}
              onChange={handleChange}
              rows="4"
              placeholder="Acceso prioritario, Zona VIP, Consumición incluida"
              className="w-full rounded-md border border-subsonic-border bg-subsonic-surface px-4 py-2 text-sm text-subsonic-text placeholder:text-subsonic-muted outline-none focus:ring-2 focus:ring-subsonic-accent/30"
              required
            />
          </div>

          <div className="rounded-xl border border-subsonic-border bg-subsonic-surface/40 p-4">
            <p className="text-sm text-subsonic-muted">
              Define los beneficios de forma clara para reutilizar esta plantilla en la gestión de festivales.
            </p>
          </div>

          <div className="flex justify-end gap-3 border-t border-subsonic-border pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="bg-subsonic-accent px-5 py-2 text-subsonic-bg"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-subsonic-accent px-5 py-2 text-subsonic-bg"
            >
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketTemplateForm;