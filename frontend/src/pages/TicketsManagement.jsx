import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import BaseCard from '@/components/ui/BaseCard';
import API_BASE_URL from '@/config/api';
import TicketTemplateForm from '@/components/ui/TicketTemplateForm';

const TicketsManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState({ name: '', features: '', price: '' });

  const API_URL = `${API_BASE_URL}/ticketTemplates`;

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) setTemplates(await res.json());
    } catch (err) {
      console.error("Error cargando plantillas:", err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const isNew = !currentTemplate.id;
    const method = isNew ? 'POST' : 'PUT'; 
    const url = isNew ? API_URL : `${API_URL}/${currentTemplate.id}`;
   
    const templateToSave = {
      ...currentTemplate,
      features: typeof currentTemplate.features === 'string' 
        ? currentTemplate.features.split(',').map(v => v.trim()).filter(v => v !== '')
        : currentTemplate.features
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateToSave)
      });

      if (response.ok) {
        setIsEditing(false);
        fetchTemplates();
      }
    } catch (err) {
      console.error("Error al sincronizar con db.json:", err);
    }
  };

  const handleEdit = (template) => {
    setCurrentTemplate({
      ...template,
      features: Array.isArray(template.features) ? template.features.join(', ') : template.features
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar esta plantilla de db.json?")) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchTemplates();
      } catch (err) {
        console.error("Error al borrar de db.json:", err);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 p-6">
      <header className="flex justify-between items-center border-b border-subsonic-border pb-6">
        <div>
          <h1 className="text-4xl font-black text-subsonic-text uppercase tracking-tighter">Gestión de Entradas</h1>
        </div>
        {!isEditing && (
          <Button 
            variant="primarySmall" 
            onClick={() => { 
              setIsEditing(true); 
              setCurrentTemplate({ name: '', features: '', price: '' }); 
            }}
          >
            Nueva Plantilla
          </Button>
        )}
      </header>

      {isEditing ? (
        <TicketTemplateForm 
          data={currentTemplate} 
          onChange={setCurrentTemplate} 
          onSave={handleSave} 
          onCancel={() => setIsEditing(false)} 
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {templates.map(t => (
            <div key={t.id} className="bg-subsonic-navfooter border border-subsonic-border p-6 rounded-2xl flex justify-between items-center group hover:border-subsonic-accent transition-all">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-black text-subsonic-text uppercase">{t.name}</h3>
                  <span className="text-subsonic-accent font-black">{t.price}€</span>
                </div>
                <p className="text-xs text-subsonic-muted font-bold uppercase tracking-widest line-clamp-1">
                  {Array.isArray(t.features) ? t.features.join(', ') : t.features}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => handleEdit(t)}>Editar</Button>
                <Button variant="danger" className="text-xs px-4" onClick={() => handleDelete(t.id)}>Eliminar</Button>
              </div>
            </div>
          ))}
          {templates.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-subsonic-border rounded-3xl">
              <p className="text-subsonic-muted uppercase font-bold tracking-widest">No hay plantillas en db.json</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketsManagement;