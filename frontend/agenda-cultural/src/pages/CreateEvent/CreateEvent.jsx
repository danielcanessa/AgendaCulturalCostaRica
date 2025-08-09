import './CreateEvent.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { getUsuarioActual } from '../../utils/getUsuarioActual';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

export default function CreateEvent() {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });

  const { tipoUsuario, nombre, correo } = getUsuarioActual();
  const [latLng, setLatLng] = useState(null);
  const [imagenPrevia, setImagenPrevia] = useState(null);
  const [imagenBase64, setImagenBase64] = useState('');
  const [nombreEvento, setNombreEvento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [precio, setPrecio] = useState('');
  const [moneda, setMoneda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [linkEntradas, setLinkEntradas] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correoContacto, setCorreoContacto] = useState('');
  const [direccion, setDireccion] = useState('');
  const [accesibilidad, setAccesibilidad] = useState([]);

  const handleImagenSeleccionada = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      const lector = new FileReader();
      lector.onloadend = () => {
        setImagenPrevia(lector.result);
        const base64 = lector.result.split(',')[1];
        setImagenBase64(base64);
      };
      lector.readAsDataURL(archivo);
    }
  };

  const toggleAccesibilidad = (id, checked) => {
    if (checked) {
      setAccesibilidad(prev => [...prev, id]);
    } else {
      setAccesibilidad(prev => prev.filter(item => item !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');

    const evento = {
      name: nombreEvento,
      description: descripcion,
      start_datetime: fechaInicio,
      end_datetime: fechaFin,
      price: parseFloat(precio),
      ticket_link: linkEntradas,
      contact_email: correoContacto,
      contact_phone: telefono,
      address: direccion,
      map_location: latLng ? `${latLng.lat},${latLng.lng}` : '',
      event_banner_base64: imagenBase64,
      currency_id: moneda,
      category_id: categoria
    };

    try {
      const res = await fetch("http://localhost:8000/api/events/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(evento)
      });

      if (!res.ok) throw new Error("Error al crear evento");

      const data = await res.json();
      alert("Evento creado exitosamente");
      window.location.reload();

      for (const idAcc of accesibilidad) {
        await fetch("http://localhost:8000/api/eventaccessibilityfeatures/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            event_id: data.id,
            accessibility_feature_id: idAcc
          })
        });
      }

    } catch (error) {
      console.error(error);
      alert("Hubo un error al crear el evento.");
    }
  };

  function LocationMarker({ setLatLng }) {
    useMapEvents({
      click(e) {
        setLatLng(e.latlng);
      }
    });
    return null;
  }

  return (
    <>
      <Header tipoUsuario={tipoUsuario} nombre={nombre} correo={correo} />
      <main className="create-event-container">
        <section className='createvent-page'>
          <h2 className="titulo-form">Crear Evento</h2>
          <form className="form-evento" onSubmit={handleSubmit}>
            <label>Nombre:</label>
            <input type="text" value={nombreEvento} onChange={e => setNombreEvento(e.target.value)} />

            <label>Categoría:</label>
            <select value={categoria} onChange={e => setCategoria(e.target.value)}>
              <option value="">Seleccione la categoría</option>
              <option value="1">Música</option>
              <option value="2">Teatro</option>
              <option value="3">Danza</option>
            </select>

            <label>Fecha y hora de inicio:</label>
            <input type="datetime-local" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />

            <label>Fecha y hora de finalización:</label>
            <input type="datetime-local" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />

            <label>Precio:</label>
            <input type="text" value={precio} onChange={e => setPrecio(e.target.value)} />

            <label>Moneda:</label>
            <select value={moneda} onChange={e => setMoneda(e.target.value)}>
              <option value="">Seleccione la moneda</option>
              <option value="1">CRC</option>
              <option value="2">USD</option>
            </select>

            <label>Descripción:</label>
            <textarea rows={3} value={descripcion} onChange={e => setDescripcion(e.target.value)} />

            <label>Link entradas:</label>
            <input type="text" value={linkEntradas} onChange={e => setLinkEntradas(e.target.value)} />

            <label>Teléfono de contacto:</label>
            <input type="text" value={telefono} onChange={e => setTelefono(e.target.value)} />

            <label>Correo electrónico:</label>
            <input type="email" value={correoContacto} onChange={e => setCorreoContacto(e.target.value)} />

            <label>Accesibilidad:</label>
            <div className="accesibilidad-options">
              <label><input type="checkbox" onChange={e => toggleAccesibilidad(1, e.target.checked)} /> Rampa</label>
              <label><input type="checkbox" onChange={e => toggleAccesibilidad(2, e.target.checked)} /> Intérprete LESCO</label>
              <label><input type="checkbox" onChange={e => toggleAccesibilidad(3, e.target.checked)} /> Braille</label>
            </div>

            <label>Dirección:</label>
            <input type="text" value={direccion} onChange={e => setDireccion(e.target.value)} />

            <label>Seleccione el lugar en el mapa:</label>
            <MapContainer center={[9.9333, -84.0833]} zoom={13} style={{ height: '300px', width: '100%', borderRadius: '8px' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <LocationMarker setLatLng={setLatLng} />
              {latLng && <Marker position={latLng} />}
            </MapContainer>
            {latLng && <p>Ubicación seleccionada: {latLng.lat.toFixed(5)}, {latLng.lng.toFixed(5)}</p>}

            <label>Agregar imagen evento:</label>
            <input type="file" accept="image/*" onChange={handleImagenSeleccionada} />
            {imagenPrevia && (
              <div className="preview-container">
                <img src={imagenPrevia} alt="Vista previa" className="preview-img" />
              </div>
            )}

            <button type="submit" className="btn-crear-evento">Crear</button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
