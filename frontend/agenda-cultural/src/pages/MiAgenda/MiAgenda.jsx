import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import eventos from '../../data/eventos';
import miAgenda from '../../data/miAgenda';
import { getUsuarioActual } from '../../utils/getUsuarioActual';
import CategoryList from '../../components/CategoryList/CategoryList';
import './MiAgenda.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function MiAgenda() {
  const { tipoUsuario, nombre, correo } = getUsuarioActual();

  // Buscar la agenda del usuario actual
  const agendaUsuario = miAgenda.find(u => u.correo === correo);
  const eventosGuardados = agendaUsuario ? agendaUsuario.eventos : [];

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const eventosUsuario = eventos.filter(ev => eventosGuardados.includes(ev.id));

  const [busqueda, setBusqueda] = useState('');

  const navigate = useNavigate();

  //FILTRANDO CON las categorías y por nombre del evento 
  const eventosFiltrados = eventosUsuario.filter(ev => {

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
                        eventosFiltrados.map((ev) => (
                        <div className="evento-card" key={ev.id}>
                            <img src={require(`../../assets/imgEvents/${ev.imagen}`)} alt={ev.nombre} />
                            
                            <div className="evento-info">
                                <h4>{ev.nombre}</h4>
                                <p><strong>Organizador:</strong> {ev.organizador}</p>
                                <p><strong>Ubicación:</strong> {ev.ubicacion}</p>
                                <p><strong>Fecha:</strong> {ev.fecha}</p>
                                <button className="btn-ver" onClick={() => navigate(`/event/${ev.id}`)} >Ir a evento</button>
                            </div>
                        </div>
                    ))
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
