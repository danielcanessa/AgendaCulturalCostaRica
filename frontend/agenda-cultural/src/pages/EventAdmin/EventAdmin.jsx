// EventAdmin.jsx
import React, { useEffect, useState } from 'react';
import './EventAdmin.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import CategoryList from '../../components/CategoryList/CategoryList';
import { useNavigate } from 'react-router-dom';
import { getUsuarioActual } from '../../utils/getUsuarioActual';

export default function EventAdmin() {
  const { tipoUsuario, nombre, correo, id: usuarioId } = getUsuarioActual();

  const navigate = useNavigate();

  const [eventos, setEventos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('access');


  useEffect(() => {
    fetch("http://localhost:8000/api/events/", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        const noAprobados = data.filter(ev => ev.is_event_approved === false);
        setEventos(noAprobados);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error cargando eventos:", err);
        setError("No se pudieron cargar los eventos");
        setCargando(false);
      });
  }, [token]);

  const aprobarEvento = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/events/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          is_event_approved: true,
          approved_by: usuarioId
        })
      });

      if (!res.ok) throw new Error("Error al aprobar evento");

      setEventos(prev => prev.filter(ev => ev.id !== id));
      alert("Evento aprobado");

    } catch (err) {
      console.error("Error aprobando evento:", err);
      alert("No se pudo aprobar el evento.");
    }
  };

  const rechazarEvento = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este evento?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/events/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Error al eliminar evento");

      setEventos(prev => prev.filter(ev => ev.id !== id));
      alert("Evento eliminado");

    } catch (err) {
      console.error("Error eliminando evento:", err);
      alert("No se pudo eliminar el evento.");
    }
  };

  const eventosFiltrados = eventos.filter(ev => {
    const coincideCategoria = !categoriaSeleccionada || categoriaSeleccionada === 'Todos'
      ? true
      : ev.category?.name === categoriaSeleccionada;

    const coincideBusqueda = ev.name.toLowerCase().includes(busqueda.toLowerCase());

    return coincideCategoria && coincideBusqueda;
  });

  function guessMimeFromBase64(base64String) {
    if (!base64String) return 'image/jpeg';
    if (base64String.startsWith('/9j/')) return 'image/jpeg';
    if (base64String.startsWith('iVBOR')) return 'image/png';
    return 'image/jpeg';
  }

  return (
    <>
      <Header tipoUsuario={tipoUsuario} nombre={nombre} correo={correo} />
      <main className="admin-eventos">
        <section className='adm-events'>
          <h2 className="titulo-seccion">Administrar Eventos</h2>
          <div className='event-search'>
            <h3 className='event-Title titulo-agenda'>Buscar eventos para publicar</h3>
            <div className='search'>
              <i className='bx bx-search'></i>
              <input
                type="text"
                placeholder="Buscar por nombre..."
                className="search-input"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <CategoryList onCategoriaSeleccionada={setCategoriaSeleccionada} />

          <h3 className="subtitulo">Eventos pendientes de revisión:</h3>
          {eventosFiltrados.length > 0 ? (
            eventosFiltrados.map((ev) => (
              <div key={ev.id} className="evento-pendiente">
                <div className="info-pendiente">
                  <p><strong>Nombre:</strong> {ev.name}</p>
                  <p><strong>Categoría:</strong> {ev.category?.name}</p>
                  <p><strong>Fecha:</strong> {ev.start_datetime?.split("T")[0]}</p>
                  <p><strong>Ubicación:</strong> {ev.address}</p>
                  <p><strong>Correo de contacto:</strong> {ev.contact_email}</p>
                  <div className="botones-pendientes">
                      <button className="btn-aceptar" onClick={() => aprobarEvento(ev.id)}>Aprobar</button>
                      <button className="btn-eliminar" onClick={() => rechazarEvento(ev.id)}>Rechazar</button>
                    <button
                      className="btn-solicitar"
                      onClick={() => navigate(`/event/${ev.id}?modo=solicitar-cambios`)}
                    >
                      Solicitar cambios
                    </button>
                  </div>
                </div>
                <img
                  src={
                    ev.event_banner_base64
                      ? `data:${guessMimeFromBase64(ev.event_banner_base64)};base64,${ev.event_banner_base64}`
                      : '/placeholder.jpg'
                  }
                  alt={ev.name}
                />
              </div>
            ))
          ) : (
            <p className='error-msj'>No hay eventos pendientes.</p>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
