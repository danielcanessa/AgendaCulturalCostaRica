import './CreateEvent.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { getUsuarioActual } from '../../utils/getUsuarioActual';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';

//Punteros de Leaflet
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

export default function CreateEvent() {

    //Codigo para que se visualice el puntero en el mapa
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    });

  const { tipoUsuario, nombre } = getUsuarioActual();
  const [latLng, setLatLng] = useState(null);
  //precargar la imagen
  const [imagenPrevia, setImagenPrevia] = useState(null);
  const handleImagenSeleccionada = (e) => {
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
        <section className='createvent-page'> 
            <h2 className="titulo-form">Crear Evento</h2>

            <form className="form-evento">
            <label>Nombre:</label>
            <input type="text" placeholder="Nombre del evento" />

            <label>Categoría:</label>
            <select>
                <option>Seleccione la categoría</option>
                <option>Música</option>
                <option>Teatro</option>
                <option>Danza</option>
                <option>Arte</option>
                <option>Cine</option>
                <option>Literatura</option>
            </select>

            <label>Fecha y hora de inicio:</label>
            <input type="datetime-local" />

            <label>Fecha y hora de finalización:</label>
            <input type="datetime-local" />

            <label>Precio:</label>
            <input type="text" placeholder="₡ / $" />

            <label>Moneda:</label>
            <select>
                <option>Seleccione la moneda</option>
                <option>CRC</option>
                <option>USD</option>
            </select>

            <label>Descripción:</label>
            <textarea rows={3} />

            <label>Link entradas:</label>
            <input type="text" />

            <label>Teléfono de contacto:</label>
            <input type="text" />

            <label>Correo electrónico:</label>
            <input type="email" />

            <label>Accesibilidad:</label>
            <div className="accesibilidad-options">
                <label><input type="checkbox" /> Rampa</label>
                <label><input type="checkbox" /> Intérprete LESCO</label>
                <label><input type="checkbox" /> Braille</label>
            </div>

            <label>Dirección:</label>
            <input type="text" placeholder="Dirección completa" />

            
            <label>Seleccione el lugar en el mapa:</label>
                <MapContainer
                center={[9.9333, -84.0833]} // San José CR
                zoom={13}
                style={{ height: '300px', width: '100%', borderRadius: '8px' }}
                >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                <LocationMarker setLatLng={setLatLng} />
                {latLng && <Marker position={latLng} />}
                </MapContainer>
                {latLng && (
                <p>Ubicación seleccionada: {latLng.lat.toFixed(5)}, {latLng.lng.toFixed(5)}</p>)}


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
