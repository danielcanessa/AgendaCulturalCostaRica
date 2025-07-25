import Header from '../../components/Header/Header';
import CategoryList from '../../components/CategoryList/CategoryList';
import EventCard from '../../components/EventCard/EventCard';
import Footer from '../../components/Footer/Footer';
import './Home.css';
import { getUsuarioActual } from '../../utils/getUsuarioActual';
import eventos from '../../data/eventos';
import { useState } from 'react';

export default function Home() {
  const { tipoUsuario, nombre } = getUsuarioActual();

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  //FILTRANDO CON las categorías y por nombre del evento 
  const eventosFiltrados = eventos.filter(ev => {
  const coincideCategoria =
    !categoriaSeleccionada || categoriaSeleccionada === 'Todos'
      ? true
      : ev.categoria === categoriaSeleccionada;

    const coincideBusqueda = ev.nombre.toLowerCase().includes(busqueda.toLowerCase());

    return coincideCategoria && coincideBusqueda;
  });
  
  
  return (
    <>
      <Header tipoUsuario={tipoUsuario} nombre={nombre} />
      <main className="home">
        <section className="banner">
          <div className="overlay">
            <h2>Descubrí lo mejor de la cultura.</h2>
            <h3>Cerca de tí.</h3>
          </div>
        </section>

        <section className="categorias">
          <h1 className='title'>Categorías</h1>
          <CategoryList onCategoriaSeleccionada={setCategoriaSeleccionada} />
        </section>

        <section className="events">
          <div className='container-events'>
            <h3 className='event-Title'>Eventos</h3>
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

          
          <div className="events-grid">
            {eventosFiltrados.filter(ev => ev.estado?.toLowerCase() === 'publicado').length > 0 ? (
            eventosFiltrados
              .filter(ev => ev.estado?.toLowerCase() === 'publicado')
              .map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                titulo={event.nombre}
                fecha={event.fecha}
                lugar={event.direccion}
                imagen={event.imagen}
              />
            ))
            ) : (
              <p className='error-msj'>No hay eventos publicados.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}