import { useState } from 'react';

const ArtistManagement = () => {
    // Por ahora hay unos artistas hardcodeados
    const [artistas, setArtistas] = useState([
        {id: 1, nombre: 'Artista 1', genero: 'Rock', festival: 'Festival Verano'},
        {id: 2, nombre: 'Artista 2', genero: 'Pop', festival: 'Festival Invierno'},
        {id: 3, nombre: 'Artista 3', genero: 'Electrónica', festival: 'Festival Primavera'},
        {id: 4, nombre: 'Artista 4', genero: 'Jazz', festival: 'Festival Otoño'},
    ]);

    // Manejar el borrado de artistas
    const handleDelete = (id, nombre) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar a ${nombre}?`)) {
            setArtistas(artistas.filter(artista => artista.id !== id));
        }
    };

    // Manejar la info
    const handleInfo = (id, nombre) => {
        // Por ahora solo muestra un mensaje en consola
        console.log(`Ver información de ${nombre} (ID: ${id})`);
        // Aquí iría la lógica para mostrar información del artista
        alert(`Funcionalidad de información para ${nombre} - Próximamente disponible`);
    };

    return (
        <section className="space-y-6 -mt-6 md:-mt-16">
            <h2 className="text-4xl font-su text-subsonic-accent">Gestión de Artistas</h2>

            {/* Barra de acciones superior */}
            <div className="table-actions">
                <button
                    className="bg-subsonic-accent
                    text-subsonic-bg px-4 py-2 rounded-full
                    font-black text-xs uppercase hover:bg-subsonic-text transition-colors"
                >
                    Añadir Artista +
                </button>
            </div>

            {/* Tabla de artistas */}
            <table className="artistas-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre del Artista</th>
                    <th>Género</th>
                    <th>Festival</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {artistas.map((artista) => (
                    <tr key={artista.id}>
                        <td className="id-column">{artista.id}</td>
                        <td className="nombre-column">{artista.nombre}</td>
                        <td>{artista.genero}</td>
                        <td>{artista.festival}</td>
                        <td className="actions-column">
                            <button
                                className="btn-info"
                                onClick={() => handleInfo(artista.id, artista.nombre)}
                                title="Ver información del artista"
                            >
                                <i className="fas fa-info-circle"></i>
                                <span>Información</span>
                            </button>

                            <button
                                className="bg-subsonic-accent
                                text-subsonic-bg px-4 py-2 rounded-full font-black
                                text-xs uppercase hover:bg-subsonic-text transition-colors"
                                onClick={() => handleDelete(artista.id, artista.nombre)}
                                title="Eliminar artista"
                            >
                                <i className="fas fa-trash-alt"></i>
                                <span>Borrar</span>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Mensaje si no hay artistas */}
            {artistas.length === 0 && (
                <div className="empty-state">
                    <p>No hay artistas registrados</p>
                    <button className="btn-add">Añadir primer artista</button>
                </div>
            )}
        </section>
    );
};

export default ArtistManagement;