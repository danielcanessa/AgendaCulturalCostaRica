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
  
  const [eventosBackend, setEventosBackend] = useState([]); // Estado para almacenar eventos desde el backend
  const [mostrarEventos, setMostrarEventos] = useState(false); // Estado para controlar la visibilidad de los eventos

  // FILTRANDO CON las categorías y por nombre del evento 
  const eventosFiltrados = eventos.filter(ev => {
    const coincideCategoria =
      !categoriaSeleccionada || categoriaSeleccionada === 'Todos'
        ? true
        : ev.categoria === categoriaSeleccionada;

    const coincideBusqueda = ev.nombre.toLowerCase().includes(busqueda.toLowerCase());

    return coincideCategoria && coincideBusqueda;
  });

  ////////////////////////////////// Remover this section when the integration is ready START //////////////////////////////////
  const handleLoginAdmin = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'dcanessav@ucenfotec.ac.cr',
          password: 'admin'
        }),
      });

      if (!response.ok) {
        throw new Error('Login fallido');
      }
      const data = await response.json();
      console.log('Login exitoso:', data);

      // Guarda el token en localStorage
      if (data.access) {
        localStorage.setItem('token', data.access);
        localStorage.setItem('token_refresh', data.refresh);
      }

      alert('Login admin exitoso. Mira la consola.');
    } catch (error) {
      alert('Error al hacer login: ' + error.message);
    }
  };

  const handleLoginVisitor = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'peter@email.com',
          password: 'SecurePasss!'
        }),
      });

      if (!response.ok) {
        throw new Error('Login fallido');
      }
      const data = await response.json();
      console.log('Login visitor exitoso:', data);

      // Guarda el token en localStorage
      if (data.access) {
        localStorage.setItem('token', data.access);
        localStorage.setItem('token_refresh', data.refresh);
      }

      alert('Login exitoso. Mira la consola.');
    } catch (error) {
      alert('Error al hacer login: ' + error.message);
    }
  };

    
  const handleLogout = async () => {
    const refresh = localStorage.getItem('refresh'); // Esto es para el token de refresh en el backend
    try {
      if (refresh) {
        await fetch('http://localhost:8000/api/logout/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh }),
        });
      }
    } catch (error) {      
      console.error('Error en logout backend:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh');
      alert('Sesión cerrada.');
      // window.location.reload();
    }
  };

  const getUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token, haz login primero.');

      const response = await fetch('http://localhost:8000/api/users/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Error al obtener usuarios: ${response.status}`);
      }

      const data = await response.json();
      console.log('Usuarios:', data);
      alert('Usuarios impresos en consola.');
    } catch (error) {
      alert(error.message);
    }
  };


  const getEvents = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/events/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Error al obtener eventos: ${response.status}`);
      }

      const data = await response.json();
      console.log('Eventos:', data);
      alert('Eventos impresos en consola.');
    } catch (error) {
      alert(error.message);
    }
  };

  // Obtener eventos del backend y mostrar con imagen
  const getEventsAndShow = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/events/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Error al obtener eventos: ${response.status}`);
      }

      const data = await response.json();
      setEventosBackend(data);
      setMostrarEventos(true);
    } catch (error) {
      alert(error.message);
    }
  };

    
  // Deducción rápida de tipo de imagen base64 (JPG/PNG)
  function guessMimeFromBase64(base64String) {
    if (!base64String) return 'image/jpeg'; // Fallback
    if (base64String.startsWith('/9j/')) return 'image/jpeg';
    if (base64String.startsWith('iVBOR')) return 'image/png';
    // Puedes agregar más tipos aquí si usas GIF, WEBP, etc
    return 'image/jpeg';
  }




  

  ////////////////////////////////// Remover this section when the integration is ready End //////////////////////////////////
  
  
  return (
    <>


      <button onClick={handleLoginAdmin}>
        Lgin Admin User
      </button>

      <button onClick={handleLoginVisitor}>
        Lgin Visitor User
      </button>

      <button onClick={getUsers}>
        Get Users
      </button> 

      <button onClick={getEvents}>
        Get Events
      </button> 

      <button onClick={handleLogout}>
        Logout
      </button> 

      <button onClick={getEventsAndShow}>
        Mostrar eventos del backend (con imagen)
      </button>

      {mostrarEventos && (
      <section className="events">
        <h3 className='event-Title'>Eventos desde el backend</h3>
        <div className="events-grid">
          {eventosBackend.length > 0 ? (
            eventosBackend.map(ev => (
              <div key={ev.id} className="evento-card-backend">
                <h4>{ev.name}</h4>
                <p>{ev.description}</p>
                <p><b>Fecha:</b> {ev.start_datetime}</p>
                <p><b>Categoría:</b> {ev.category?.name}</p>
                <p><b>Precio:</b> {ev.price} {ev.currency?.name}</p>
                {ev.event_banner_base64 && (
                  <img
                    src={`data:${guessMimeFromBase64(ev.event_banner_base64)};base64,${ev.event_banner_base64}`}
                    alt={ev.name}
                    style={{ width: 250, height: 'auto', borderRadius: 10, marginBottom: 10 }}
                    onError={e => { e.target.src = '/placeholder.jpg'; }}
                  />
                )}
              </div>
            ))
          ) : (
            <p>No hay eventos disponibles.</p>
          )}
        </div>
      </section>
    )}

















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