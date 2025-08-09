import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { getUsuarioActual } from '../../utils/getUsuarioActual';
import CategoryList from '../../components/CategoryList/CategoryList';
import './MiAgenda.css';
import { useNavigate } from 'react-router-dom';
import { obtenerEventosAgendaBackend,eliminarEventoAgendaBackend } from '../../utils/agendaService';

export default function MiAgenda() {
  const { tipoUsuario, nombre, correo } = getUsuarioActual();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [eventosUsuario, setEventosUsuario] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return;

    const fetchAgenda = async () => {
      const eventos = await obtenerEventosAgendaBackend(token);
      console.log("EVENTOS RECIBIDOS:", eventos);
      setEventosUsuario(eventos);
    };

    fetchAgenda();
  }, []);

  const eventosFiltrados = eventosUsuario.filter(ev => {
    const evento = ev.event;
    const coincideCategoria =
      !categoriaSeleccionada || categoriaSeleccionada === 'Todos'
        ? true
        : evento.category?.name === categoriaSeleccionada;

    const coincideBusqueda = (evento.name || '').toLowerCase().includes(busqueda.toLowerCase());

    return coincideCategoria && coincideBusqueda;
  });

  
  return (
    <>
      <Header tipoUsuario={tipoUsuario} nombre={nombre} correo={correo} />
      <main className='mi-agenda-container'>
        <section className="miagenda-page">
          <h1 className="titulo-agenda">Mi Agenda</h1>
          <div className='event-search'>
            <h3 className='event-Title titulo-agenda '>Buscar eventos guardados</h3>
            <div className='search'>
              <i className='bx  bx-search'></i> 
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

          <h2 className="titulo-agenda">Eventos Guardados</h2>
          <div className="eventos-guardados">
            {eventosFiltrados.length > 0 ? (
              eventosFiltrados.map((ev) => {
                const evento = ev.event;
                const userEventId = ev.id; // ID de la relación UserEvent
                const token = localStorage.getItem("access");
              
                const handleEliminar = async () => {
                  const confirmado = window.confirm("¿Deseás eliminar este evento de tu agenda?");
                  if (!confirmado) return;
              
                  const exito = await eliminarEventoAgendaBackend(userEventId, token);
                  if (exito) {
                    setEventosUsuario(prev => prev.filter(e => e.id !== userEventId));
                    alert("Se elimino evento de tu agenda")
                  } else {
                    alert("No se pudo eliminar el evento.");
                  }
                };
                return (
                  <div className="evento-card" key={evento.id}>
                    <img
                      src={evento.event_banner_base64
                        ? `data:image/jpeg;base64,${evento.event_banner_base64}`
                        : '/placeholder.jpg'}
                      alt={evento.name}
                    />
                    <div className="evento-info">
                      <h4>{evento.name}</h4>
                      <p><strong>Organizador:</strong> {evento.contact_email}</p>
                      <p><strong>Ubicación:</strong> {evento.address}</p>
                      <p><strong>Fecha:</strong> {evento.start_datetime}</p>
                      <div className='btns'>
                        <button className="btn-ver" onClick={() => navigate(`/event/${evento.id}`)} >
                            Ir a evento
                        </button>
                        <button className="btn-eliminar" onClick={handleEliminar}>
                            Eliminar de mi agenda
                        </button>
                        </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className='error-msj'>No hay eventos guardados aún.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}