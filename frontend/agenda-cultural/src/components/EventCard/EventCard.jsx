import './EventCard.css';
import { useNavigate } from 'react-router-dom';

export default function EventCard({ id, titulo, fecha, lugar, imagen }) {
  const navigate = useNavigate();

  return (
    <div className="event-card">
      <img src={imagen} alt={`Evento ${titulo}`} />
      <div className="info">
        <div className='info-text'>
          <h4>{titulo}</h4>
          <p className='date'>{fecha}</p>
          <p>{lugar}</p>
        </div>
        <button onClick={() => navigate(`/event/${id}`)}>Ver más</button>
      </div>
    </div>
  );
}
