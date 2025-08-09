// src/pages/EditEvent/EditEvent.jsx
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { getUsuarioActual } from '../../utils/getUsuarioActual';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tipoUsuario, nombre, correo } = getUsuarioActual();

  // Estado de carga / error
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  // Catálogos
  const [categorias, setCategorias] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [accesibilidadOpts, setAccesibilidadOpts] = useState([]); // [{id, name}]

  // Evento original (para comparar si se quiere)
  const [evento, setEvento] = useState(null);

  // UI auxiliares
  const [latLng, setLatLng] = useState(null);
  const [imagenPrevia, setImagenPrevia] = useState(null); // url
  const [bannerBase64, setBannerBase64] = useState('');    // base64 para enviar

  // Form controlado (alineado a tu API)
  const [formData, setFormData] = useState({
    name: '',
    category: '',          // id
    start_datetime: '',
    end_datetime: '',
    price: '',
    currency: '',          // id
    description: '',
    ticket_link: '',
    contact_phone: '',
    contact_email: '',
    address: '',
    accessibility_features: [], // ids
    map_location: '',         // { lat, lng } o string según tu backend (aquí usamos {lat, lng})
  });

  // Leaflet icon fix
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
  });

  function LocationMarker({ onPick }) {
    useMapEvents({
      click(e) {
        onPick(e.latlng);
      }
    });
    return null;
  }

  // Helpers
  const token = useMemo(() => localStorage.getItem('access'), []);
  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );


  function parseMapLocation(val) {
    if (!val) return null;
    if (typeof val === 'string') {
      const [lat, lng] = val.split(',').map(Number);
      return (Number.isFinite(lat) && Number.isFinite(lng)) ? { lat, lng } : null;
    }
    return null;
  }

  // Cargar catálogos + evento
  useEffect(() => {
    async function loadAll() {
      setCargando(true);
      setError('');
      try {
        const [evRes, catRes, curRes, accRes] = await Promise.all([
          fetch(`http://localhost:8000/api/events/${id}/`, { headers: { ...authHeaders } }),
          fetch(`http://localhost:8000/api/categories/`),
          fetch(`http://localhost:8000/api/currencies/`),
          fetch(`http://localhost:8000/api/accessibility-features/`)
        ]);

        if (!evRes.ok) throw new Error('No se pudo cargar el evento.');
        const ev = await evRes.json();

        setEvento(ev);

        const cats = catRes.ok ? await catRes.json() : [];
        const curs = curRes.ok ? await curRes.json() : [];
        const accs = accRes.ok ? await accRes.json() : [];

        setCategorias(cats);
        setMonedas(curs);
        setAccesibilidadOpts(accs);

        // Prefill formulario
        setFormData({
          name: ev.name ?? '',
          category: ev.category?.id ?? '',
          start_datetime: ev.start_datetime ?? '',
          end_datetime: ev.end_datetime ?? '',
          price: ev.price ?? '',
          currency: ev.currency?.id ?? '',
          description: ev.description ?? '',
          ticket_link: ev.ticket_link ?? '',
          contact_phone: ev.contact_phone ?? '',
          contact_email: ev.contact_email ?? '',
          address: ev.address ?? '',
          accessibility_features: Array.isArray(ev.accessibility_features)
            ? ev.accessibility_features.map(a => a.id)
            : [],
          map_location: typeof ev.map_location === 'string' ? ev.map_location : '',
        });

        // Imagen
        if (ev.event_banner_base64) {
          setBannerBase64(ev.event_banner_base64);
          setImagenPrevia(`data:image/jpeg;base64,${ev.event_banner_base64}`);
        }

        // Mapa
        const ll = parseMapLocation(ev.map_location);
        if (ll) setLatLng(ll);
      } catch (err) {
        setError(err.message || 'Error al cargar.');
      } finally {
        setCargando(false);
      }
    }

    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Cambios de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAccesibilidad = (e) => {
    const { value, checked } = e.target; // value es el id
    setFormData(prev => {
      const ids = new Set(prev.accessibility_features);
      const v = Number(value);
      if (checked) ids.add(v);
      else ids.delete(v);
      return { ...prev, accessibility_features: Array.from(ids) };
    });
  };

  const handleImagenSeleccionada = (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    // Preview
    const url = URL.createObjectURL(archivo);
    setImagenPrevia(url);
    // A base64 para enviar
    const reader = new FileReader();
    reader.onload = () => {
      // reader.result = "data:image/...;base64,AAAA"
      const result = String(reader.result);
      const base64 = result.includes('base64,')
        ? result.split('base64,')[1]
        : result;
      setBannerBase64(base64);
    };
    reader.readAsDataURL(archivo);
  };

  // Envío
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError('');

    try {
      // Construir payload alineado al backend

      const mapLocationStr = latLng
        ? `${latLng.lat},${latLng.lng}`
        : (formData.map_location || '');
      const payload = {
        name: formData.name,
        category: formData.category || null,        // id
        start_datetime: formData.start_datetime || null,
        end_datetime: formData.end_datetime || null,
        price: formData.price === '' ? null : Number(formData.price),
        currency: formData.currency || null,        // id
        description: formData.description,
        ticket_link: formData.ticket_link,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email,
        address: formData.address,
        accessibility_features: formData.accessibility_features, // ids
        map_location: mapLocationStr || null,
        // Solo enviamos el banner si hay uno (para no sobreescribir con vacío)
        ...(bannerBase64 ? { event_banner_base64: bannerBase64 } : {})
      };

      const res = await fetch(`http://localhost:8000/api/events/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(`No se pudo guardar. ${res.status}: ${t}`);
      }

      alert('Evento actualizado correctamente.');
      navigate(`/event/${id}`);
    } catch (err) {
      setError(err.message || 'Error al guardar.');
    } finally {
      setGuardando(false);
    }
  };

  // Render
  if (cargando) {
    return (
      <>
        <Header tipoUsuario={tipoUsuario} nombre={nombre} correo={correo} />
        <main className="create-event-container">
          <h3>Cargando datos del evento...</h3>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header tipoUsuario={tipoUsuario} nombre={nombre} correo={correo} />
        <main className="create-event-container">
          <p style={{ color: 'crimson' }}>{error}</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!evento) {
    return (
      <>
        <Header tipoUsuario={tipoUsuario} nombre={nombre} correo={correo} />
        <main className="create-event-container">
          <h3>No se encontró el evento.</h3>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header tipoUsuario={tipoUsuario} nombre={nombre} correo={correo} />
      <main className="create-event-container">
        <section className="createvent-page">
          <h2 className="titulo-form">Editar Evento</h2>

          <form className="form-evento" onSubmit={handleSubmit}>
            <label>Nombre:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />

            <label>Categoría:</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="">Seleccione la categoría</option>
              {categorias.map(c => (
                <li key={c.id} value={c.id} style={{display:'none'}}></li>
              ))}
              {categorias.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <label>Fecha y hora de inicio (ISO):</label>
            <input type="datetime-local" name="start_datetime"
              value={formData.start_datetime?.slice(0,16) || ''}
              onChange={handleChange} />

            <label>Fecha y hora de finalización (ISO):</label>
            <input type="datetime-local" name="end_datetime"
              value={formData.end_datetime?.slice(0,16) || ''}
              onChange={handleChange} />

            <label>Precio:</label>
            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} />

            <label>Moneda:</label>
            <select name="currency" value={formData.currency} onChange={handleChange}>
              <option value="">Seleccione la moneda</option>
              {monedas.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>

            <label>Descripción:</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} />

            <label>Link de entradas:</label>
            <input type="url" name="ticket_link" value={formData.ticket_link} onChange={handleChange} />

            <label>Teléfono de contacto:</label>
            <input type="text" name="contact_phone" value={formData.contact_phone} onChange={handleChange} />

            <label>Correo de contacto:</label>
            <input type="email" name="contact_email" value={formData.contact_email} onChange={handleChange} />

            <label>Dirección:</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} />

            <label>Seleccione el lugar en el mapa:</label>
            <MapContainer
              center={latLng ? [latLng.lat, latLng.lng] : [9.9333, -84.0833]}
              zoom={13}
              style={{ height: '300px', width: '100%', borderRadius: '8px' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker onPick={(ll) => { setLatLng(ll); }} />
              {latLng && <Marker position={latLng} />}
            </MapContainer>
            {latLng && (
              <p>Ubicación seleccionada: {latLng.lat.toFixed(5)}, {latLng.lng.toFixed(5)}</p>
            )}

            <label>Accesibilidad:</label>
            <div className="accesibilidad-options">
              {accesibilidadOpts.map(a => (
                <label key={a.id} style={{ marginRight: 12 }}>
                  <input
                    type="checkbox"
                    value={a.id}
                    checked={formData.accessibility_features.includes(a.id)}
                    onChange={handleAccesibilidad}
                  /> {a.name}
                </label>
              ))}
            </div>

            <label>Imagen del evento (banner):</label>
            <input type="file" accept="image/*" onChange={handleImagenSeleccionada} />
            {imagenPrevia && (
              <div className="preview-container">
                <img src={imagenPrevia} alt="Vista previa" className="preview-img" />
              </div>
            )}

            <button type="submit" className="btn-crear-evento" disabled={guardando}>
              {guardando ? 'Guardando…' : 'Guardar'}
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
