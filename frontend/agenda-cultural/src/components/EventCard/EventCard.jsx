import './EventCard.css';
import eventoImg from '../../assets/cardEvent.png'; 

export default function EventCard({titulo,fecha,lugar}) {
  return (
    <div className="event-card">
      <img src={eventoImg} alt="Event" />
      <div className="info">
        <div className='info-text'>
          <h4>{titulo}</h4>
          <p className='date'>{fecha}</p>
          <p>{lugar}</p>
          
        </div>
        <button>Ver más</button>
      </div>
    </div>
  );
}
