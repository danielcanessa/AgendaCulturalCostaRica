// EventAdm.jsx
import React from 'react';
import './EventAdmin.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import eventos from '../../data/eventos';
import CategoryList from '../../components/CategoryList/CategoryList';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsuarioActual } from '../../utils/getUsuarioActual';



export default function EventAdm() {
  const { tipoUsuario, nombre } = getUsuarioActual();

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const eventosFiltrados = eventos.filter((ev) => {
    const coincideCategoria =
      !categoriaSeleccionada || categoriaSeleccionada === 'Todos'
        ? true
        : ev.categoria === categoriaSeleccionada;
    

    const coincideBusqueda = ev.nombre.toLowerCase().includes(busqueda.toLowerCase());

    return coincideCategoria && coincideBusqueda;
  });


  const navigate = useNavigate();
  return (
    <>
     <Header tipoUsuario={tipoUsuario} nombre={nombre} />
    <main className="admin-eventos">
      
      <section className='adm-events'>
        <h2 className="titulo-seccion">Administrar Eventos</h2>
        <div className='event-search'>
                <h3 className='event-Title titulo-agenda '>Buscar eventos para publicar   </h3>
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
        <h3 className="subtitulo">Eventos pendientes de revisión:</h3>
        {eventosFiltrados.filter(ev => ev.estado?.toLowerCase() === 'pendiente').length > 0 ? (
            eventosFiltrados
              .filter(ev => ev.estado?.toLowerCase() === 'pendiente')
              .map((ev) => (
              <div key={ev.id} className="evento-pendiente">
                
                <div className="info-pendiente">
                  <p><strong>Nombre:</strong> {ev.nombre}</p>
                  <p><strong>Categoría:</strong> {ev.categoria}</p>
                  <p><strong>Fecha:</strong> {ev.fecha}</p>
                  <p><strong>Ubicación:</strong> {ev.direccion}</p>
                  <p><strong>Correo de contacto:</strong> {ev.correo}</p>
                  <div className="botones-pendientes">
                    <button className="btn-aceptar">Aprobar</button>
                    <button className="btn-rechazar">Rechazar</button>
                    <button
                      className="btn-solicitar"
                      onClick={() => navigate(`/event/${ev.id}?modo=solicitar-cambios`)}
                    >
                      Solicitar cambios
                    </button>

                  </div>
                </div>
                <img src={require(`../../assets/imgEvents/${ev.imagen}`)} alt={ev.nombre} />
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
