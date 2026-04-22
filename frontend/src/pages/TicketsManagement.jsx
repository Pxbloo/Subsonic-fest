import React, { useState, useEffect, useMemo } from 'react';
import Button from '@/components/ui/Button';
import SearchBar from '@/components/ui/SearchBar.jsx';
import API_BASE_URL from '@/config/api';
import TicketTemplateForm from '@/components/ui/TicketTemplateForm';
import {getAuth} from "firebase/auth";
import ConfirmDialog from '@/components/ui/ConfirmDialog.jsx';

const TicketsManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [canSubmit, setCanSubmit] = useState(true);

  const API_URL = `${API_BASE_URL}/ticketTemplates`;

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (res.ok) setTemplates(await res.json());
    } catch (err) {
      console.error("Error cargando plantillas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTemplates();
  }, []);

  const filteredTemplates = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return templates;

    return templates.filter((template) => {
      const features = Array.isArray(template.features)
        ? template.features.join(', ')
        : String(template.features || '');

      return [template.id, template.name, template.price, features]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(term));
    });
  }, [searchTerm, templates]);

  const handleNew = () => {
    setSelectedTemplate(null);
    setModalOpen(true);
  };

  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setModalOpen(true);
  };

  const handleSave = async (templateData) => {
    if (!canSubmit) {
      alert('Por favor, espera antes de hacer más peticiones.');
      return;
    }
    setCanSubmit(false);

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error('No user is currently logged in or user is not authenticated.');
      }

      const token = await currentUser.getIdToken();
      const isNew = !selectedTemplate?.id;
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? API_URL : `${API_URL}/${selectedTemplate.id}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(templateData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed: ${response.status} ${errorText}`);
      }

      setModalOpen(false);
      setSelectedTemplate(null);
      await fetchTemplates();
    } catch (err) {
      console.error('Error al guardar plantilla:', err);
    } finally {
      setCanSubmit(true);
    }
  };

  const handleDelete = async (template) => {
    if (!canSubmit) {
      alert('Por favor, espera antes de hacer más peticiones.');
      return;
    }
    if (!template) return;
      setCanSubmit(false);
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          throw new Error('No user is currently logged in or user is not authenticated.');
        }

        const token = await currentUser.getIdToken();
        const response = await fetch(`${API_URL}/${template.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          console.error('Failed to delete template:', response.statusText);
        }

        setConfirmDelete(null);
        await fetchTemplates();
      } catch (err) {
        console.error("Error al borrar de db.json:", err);
      } finally {
        setCanSubmit(true);
      }
  };

  const formatPrice = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? `${parsed.toFixed(2)} €` : '-';
  };

  const formatFeatures = (value) => {
    if (Array.isArray(value)) return value.join(', ');
    return String(value || '');
  };

  if (loading) {
    return <div className="text-center p-8">Cargando plantillas de entradas...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black text-subsonic-accent uppercase tracking-tight">
          Gestión de Entradas
        </h1>
        <Button
          onClick={handleNew}
          className="border border-subsonic-border text-subsonic-bg font-black px-5 py-2 rounded-full uppercase text-sm hover:border-subsonic-bg transition"
        >
          + Nueva Plantilla
        </Button>
      </div>

      <div className="mb-6 max-w-md">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar por nombre, id, beneficios o precio..."
          showButton={false}
          className="w-full"
          inputClassName="w-full rounded-md border border-subsonic-border bg-subsonic-surface px-4 py-2 text-sm text-subsonic-text placeholder:text-subsonic-muted outline-none focus:ring-2 focus:ring-subsonic-accent/30"
        />
      </div>

      <div className="bg-subsonic-navfooter border border-subsonic-border rounded-2xl overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-225 w-full divide-y divide-subsonic-border">
            <thead className="bg-subsonic-surface/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Beneficios</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-subsonic-muted uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subsonic-border">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-subsonic-surface/20 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{template.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{template.name}</td>
                    <td className="px-6 py-4 text-sm text-subsonic-text max-w-md truncate" title={formatFeatures(template.features)}>
                      {formatFeatures(template.features)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-subsonic-text">{formatPrice(template.price)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <Button
                        onClick={() => handleEdit(template)}
                        className="bg-subsonic-border text-subsonic-accent hover:text-opacity-80 hover:bg-subsonic-accent hover:text-subsonic-bg px-6 py-2"
                        variant=""
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => setConfirmDelete(template)}
                        className="bg-subsonic-border text-red-400 hover:bg-red-500 hover:text-subsonic-bg px-6 py-2"
                        variant=""
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-sm text-subsonic-muted">
                    No se encontraron plantillas con ese filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TicketTemplateForm
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedTemplate(null);
        }}
        onSave={handleSave}
        template={selectedTemplate}
      />

      <ConfirmDialog
          isOpen={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          onConfirm={handleDelete}
          title="Eliminar plantilla"
          message={`¿Estás seguro de que deseas eliminar "${confirmDelete?.name}"? Esta acción no se puede deshacer.`}
          user={confirmDelete}
      />
    </div>
  );
};

export default TicketsManagement;