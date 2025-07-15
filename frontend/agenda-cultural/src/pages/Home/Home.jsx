import Header from '../../components/Header/Header';
import CategoryList from '../../components/CategoryList/CategoryList';
import EventCard from '../../components/EventCard/EventCard';
import Footer from '../../components/Footer/Footer';
import './Home.css';

//Simulación obtención de datos de la base de datos
const eventos=[{
  nombre:"Música al Atardecer: “Jazz Meets the Great American Songbook",
  fecha:"12 de febrero",
  lugar:"Parque Viva - San José"
},
{nombre:"Música para oboe de compositoras/es costarricenses",
  fecha:"30 de octubre",
  lugar:"Campus Rodrigo Facio, San Pedro - San José"
},
{nombre:"Paradojas. Colectiva",
  fecha:"25 de agosto",
  lugar:"Museo Rafael A. Calderón Guardia - San José"
},
{nombre:"Paisajes místicos. Daniela Ávalos",
  fecha:"30 de marzo",
  lugar:"Galería Talentum - San José"
}]
export default function Home() {

  return (
    <>
      <Header />
      <main className="home">
        <section className="banner">
          <div className="overlay">
            <h2>Descubrí lo mejor de la cultura.</h2>
            <h3>Cerca de tí.</h3>
          </div>
        </section>

        <section className="categorias">
          <h1 className='title'>Categorías</h1>
          <CategoryList />
        </section>

        <section className="events">
          <div className='container-events'>
            <h3 className='event-Title'>Eventos</h3>
            <div className='search'>
              <i class='bx  bx-search'></i> 
              <input type="text" placeholder="Buscar..." className="search-input" />
            </div>
          </div>
          
          <div className="events-grid">
            {eventos.map((event, index) => (
              <EventCard key={index} titulo={event.nombre} fecha={event.fecha} lugar={event.lugar} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}