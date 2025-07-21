import './EventCard.css';
import { useNavigate } from 'react-router-dom';


export default function EventCard({id,titulo,fecha,lugar,imagen}) {
  const navigate = useNavigate();
  let imagenEvento;

  try {
    imagenEvento = require(`../../assets/imgEvents/${imagen}`);
  } catch {
    imagenEvento = require('../../assets/cardEvent.png'); // Por defecto la generica
  }
  return (
    <div className="event-card">
      <img src={imagenEvento} alt={`Evento ${titulo}`} />
      <div className="info">
        <div className='info-text'>
          <h4>{titulo}</h4>
          <p className='date'>{fecha}</p>
          <p>{lugar}</p>
          
        </div>
        <button  onClick={() => navigate(`/event/${id}`)}>Ver más</button>
      </div>
    </div>
  );
}
