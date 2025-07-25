// src/pages/EditEvent/EditEvent.jsx
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { getUsuarioActual } from '../../utils/getUsuarioActual';
import eventos from '../../data/eventos';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

export default function EditEvent() {
  const { id } = useParams();
  const evento = eventos.find(ev => ev.id === parseInt(id));

  const { tipoUsuario, nombre } = getUsuarioActual();

  const [latLng, setLatLng] = useState(null);
  const [imagenPrevia, setImagenPrevia] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    inicio: '',
    final: '',
    precio: '',
    descripcion: '',
    entradas: '',
    contacto: '',
    correo: '',
    direccion: '',
    accesibilidad: {
      rampa: false,
      lesco: false,
      braille: false
    }
  });

  // Leaflet icon fix
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
  });

  useEffect(() => {
    if (evento) {
      setFormData({
        nombre: evento.nombre,
        categoria: evento.categoria,
        inicio: evento.inicio,
        final: evento.final,
        precio: evento.precio,
        descripcion: evento.descripcion,
        entradas: evento.entradas,
        contacto: evento.contacto,
        correo: evento.correo,
        direccion: evento.direccion,
        accesibilidad: {
          rampa: evento.accesibilidad?.includes('rampa'),
          lesco: evento.accesibilidad?.toLowerCase().includes('lesco'),
          braille: evento.accesibilidad?.toLowerCase().includes('braille')
        }
      });

      setImagenPrevia(`/assets/${evento.imagen}`);
    }
  }, [evento]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = e => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      accesibilidad: {
        ...prev.accesibilidad,
        [name]: checked
      }
    }));
  };

  const handleImagenSeleccionada = e => {
    const archivo = e.target.files[0];
    if (archivo) {
      const url = URL.createObjectURL(archivo);
      setImagenPrevia(url);
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
      <Header tipoUsuario={tipoUsuario} nombre={nombre} />
      <main className="create-event-container">
        <section className="createvent-page">
          <h2 className="titulo-form">Editar Evento</h2>
          <form className="form-evento">
            <label>Nombre:</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />

            <label>Categoría:</label>
            <select name="categoria" value={formData.categoria} onChange={handleChange}>
              <option value="">Seleccione la categoría</option>
              <option>Música</option>
              <option>Teatro</option>
              <option>Danza</option>
              <option>Arte</option>
              <option>Cine</option>
              <option>Literatura</option>
            </select>

            <label>Fecha y hora de inicio:</label>
            <input type="text" name="inicio" value={formData.inicio} onChange={handleChange} />

            <label>Fecha y hora de finalización:</label>
            <input type="text" name="final" value={formData.final} onChange={handleChange} />

            <label>Precio:</label>
            <input type="text" name="precio" value={formData.precio} onChange={handleChange} />

            <label>Descripción:</label>
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} />

            <label>Link entradas:</label>
            <input type="text" name="entradas" value={formData.entradas} onChange={handleChange} />

            <label>Teléfono de contacto:</label>
            <input type="text" name="contacto" value={formData.contacto} onChange={handleChange} />

            <label>Correo electrónico:</label>
            <input type="email" name="correo" value={formData.correo} onChange={handleChange} />

            <label>Accesibilidad:</label>
            <div className="accesibilidad-options">
              <label><input type="checkbox" name="rampa" checked={formData.accesibilidad.rampa} onChange={handleCheckbox} /> Rampa</label>
              <label><input type="checkbox" name="lesco" checked={formData.accesibilidad.lesco} onChange={handleCheckbox} /> Intérprete LESCO</label>
              <label><input type="checkbox" name="braille" checked={formData.accesibilidad.braille} onChange={handleCheckbox} /> Braille</label>
            </div>

            <label>Dirección:</label>
            <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} />

            <label>Seleccione el lugar en el mapa:</label>
            <MapContainer
              center={[9.9333, -84.0833]}
              zoom={13}
              style={{ height: '300px', width: '100%', borderRadius: '8px' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker setLatLng={setLatLng} />
              {latLng && <Marker position={latLng} />}
            </MapContainer>

            {latLng && (
              <p>Ubicación seleccionada: {latLng.lat.toFixed(5)}, {latLng.lng.toFixed(5)}</p>
            )}

            <label>Imagen del evento:</label>
            <input type="file" accept="image/*" onChange={handleImagenSeleccionada} />
            {imagenPrevia && (
              <div className="preview-container">
                <img src={imagenPrevia} alt="Vista previa" className="preview-img" />
              </div>
            )}

            <button type="submit" className="btn-crear-evento">Guardar</button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
