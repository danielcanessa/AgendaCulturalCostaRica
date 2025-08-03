
import './Event.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { getUsuarioActual } from '../../utils/getUsuarioActual';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react'; 


export default function Event() {
  

  const {tipoUsuario , nombre, correo } = getUsuarioActual();
  const [searchParams] = useSearchParams();
  const modo = searchParams.get("modo");
  const mostrarSolicitudCambios = tipoUsuario?.toLowerCase() === "admin" && modo === "solicitar-cambios";

  const [estrellasSeleccionadas, setEstrellasSeleccionadas] = useState(0);

  const { id } = useParams();

  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/events/${id}/`);
        if (!response.ok) throw new Error('Error al obtener el evento');
        const data = await response.json();
        setEvento(data);
      } catch (error) {
        console.error('Error al cargar el evento:', error.message);
      } finally {
        setCargando(false);
      }
    };
  
    fetchEvento();
  }, [id]);


  

  const esAutor = correo === evento?.correoAutor;


  if (cargando) {
    return (
      <>
        <Header tipoUsuario={tipoUsuario} nombre={nombre} />
        <main className="evento-page">
          <h2>Cargando evento...</h2>
        </main>
        <Footer />
      </>
    );
  }

  if (!evento) {
    return (
      <>
        <Header tipoUsuario={tipoUsuario} nombre={nombre} />
        <main className="evento-page">
          <h2>Evento no encontrado</h2>
        </main>
        <Footer />
      </>
    );
  }

 

  return (
    <>
      <Header tipoUsuario={tipoUsuario} nombre={nombre} />
      <main className="event-page">
        <div className='event-banner'>
        <img
            className='banner'
            src={
              evento.event_banner_base64
                ? `data:image/jpeg;base64,${evento.event_banner_base64}`
                : '/placeholder.jpg'
            }
            alt={`Banner de ${evento.name}`}
          />
        </div>

        <section className="event-detalle">
          <h2 className="titulo-event">Información del Evento</h2>
          <p><strong>Nombre:</strong> {evento.name}</p>
          <p><strong>Categoría:</strong> {evento.category?.name}</p>
          <p><strong>Inicio:</strong> {evento.start_datetime}</p>
          <p><strong>Precio:</strong> {evento.price} {evento.currency?.name}</p>
          <p><strong>Descripción:</strong> {evento.description}</p>
          <p><strong>Entradas:</strong> <a href={evento.ticket_link} target="_blank" rel="noreferrer">{evento.ticket_link}</a></p>
          <p><strong>Teléfono:</strong> {evento.contact_phone}</p>
          <p><strong>Correo:</strong> {evento.contact_email}</p>
          <p><strong>Dirección:</strong> {evento.address}</p>

          <iframe
            className="mapa"
            title="Ubicación del evento"
            src={`https://www.google.com/maps?q=${encodeURIComponent(evento.address)} (${encodeURIComponent(evento.nombre)})&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

          {tipoUsuario === 'usuario' && (
            <div className="botones-event">
              <button className="btn-agenda">Añadir a mi agenda</button>
              {esAutor && (
                <button
                  className="btn-editar"
                  onClick={() => navigate(`/editar-evento/${evento.id}`)}
                >
                  Editar evento
                </button>
              )}
            </div>
          )}

          {mostrarSolicitudCambios && (
            <div className="solicitud-cambios">
              <h3>Solicitud de cambios o razón por la cuál se elimina el evento</h3>
              <textarea placeholder="Escriba los cambios o el motivo de eliminación del evento" rows="4"></textarea>
              <div className="botones-event">
                <button className="btn-editar">Solicitar Cambios</button>
                <button className="btn-eliminar">Eliminar Evento</button>
              </div>
            </div>
          )}
        </section>

        <section className="comentarios">
          <h3>Comentarios</h3>
          {Array.isArray(evento.comentarios) && evento.comentarios.length > 0 ? (
            evento.comentarios.map((c, i) => (
              <div key={i} className="comentario">
                <strong>{c.autor}</strong>
                <p>{c.texto}</p>
                <p>{'⭐'.repeat(c.estrellas)} {c.estrellas} estrellas</p>
              </div>
            ))
          ) : (
            <p>No hay comentarios aún.</p>
          )}

          {tipoUsuario === 'usuario' && (
            <form className="form-comentario">
              <h3>Añadir comentario sobre el evento</h3>
              <label>¿Qué opinás de este evento?</label>
              <textarea placeholder="Escribí tu comentario aquí." rows={3}></textarea>
              <div className="rating-stars">
                <label>¿Cuántas estrellas le das?</label>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <span
                      key={num}
                      className={num <= estrellasSeleccionadas ? 'star filled' : 'star'}
                      onClick={() => setEstrellasSeleccionadas(num)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn-publicar">Publicar comentario</button>
            </form>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
