import './Perfil.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { getUsuarioActual } from '../../utils/getUsuarioActual';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const API_ME = "http://localhost:8000/api/me/";
const API_EVENTS = "http://localhost:8000/api/events/?created_by=";
const API_ORGS = "http://localhost:8000/api/organizations/";

export default function Perfil() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(null);
    const [eventos, setEventos] = useState([]);
    const [orgsCreadas, setOrgsCreadas] = useState([]);
    const [menusVisibles, setMenusVisibles] = useState({});
    const [menusOrgs, setMenusOrgs] = useState({});
    const usuarioActual = getUsuarioActual();
    const token = localStorage.getItem('token');

    // Carga usuario
    useEffect(() => {
        setLoading(true);
        setApiError(null);
        fetch(API_ME, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(() => setApiError("No se pudo cargar el perfil"))
            .finally(() => setLoading(false));
    }, [token]);

    // Carga eventos
    useEffect(() => {
        if (!user?.id) return;
        fetch(`${API_EVENTS}${user.id}`, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => setEventos(Array.isArray(data) ? data : []))
            .catch(() => setEventos([]));
    }, [user, token]);

    // Carga organizaciones creadas por el usuario
    useEffect(() => {
        if (!user?.id) return;
        fetch(`${API_ORGS}?created_by=${user.id}`, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => setOrgsCreadas(Array.isArray(data) ? data : []))
            .catch(() => setOrgsCreadas([]));
    }, [user, token]);

    if (loading) {
        return (
            <>
                <Header />
                <main className="perfil-page">
                    <div className="perfil-container">Cargando...</div>
                </main>
                <Footer />
            </>
        );
    }

    if (apiError || !user) {
        return (
            <>
                <Header />
                <main className="perfil-page">
                    <div className="perfil-container error" role="alert" aria-live="assertive">
                        {apiError || "No se encontró el usuario."}
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    const tieneEventoAprobado = eventos.some(ev => ev.is_event_approved === true);

    // Handlers para organizaciones
    const handleEditarOrg = (id) => navigate(`/editar-organizacion/${id}`);
    const handleEliminarOrg = (id) => {
        if(window.confirm('¿Estás seguro de eliminar esta organización?')) {
            fetch(`${API_ORGS}${id}/`, {
                method: 'DELETE',
                headers: { "Authorization": `Bearer ${token}` }
            })
            .then(res => {
                if (res.ok) {
                    setOrgsCreadas(orgsCreadas.filter(org => org.id !== id));
                }
            });
        }
    };

    return (
        <>
            <Header tipoUsuario={usuarioActual.tipoUsuario} nombre={usuarioActual.nombre} correo={usuarioActual.correo} />
            <main className="perfil-page">
                <div className="perfil-container">

                    {/* --- PERFIL USUARIO --- */}
                    <section className="perfil-info" aria-labelledby="perfil-titulo">
                        <h2 id="perfil-titulo" style={{ color: "#ff6600" }}>Mi perfil</h2>
                        <p><strong>Nombre:</strong> {user.name || '-'}</p>
                        <p><strong>Apellidos:</strong> {user.last_name || '-'}</p>
                        <p><strong>Correo:</strong> {user.email || '-'}</p>
                        <p><strong>Teléfono:</strong> {user.phone || '-'}</p>
                        <p><strong>Biografía:</strong> {user.bio || '-'}</p>
                        <p><strong>Rol:</strong> {user.role?.name || '-'}</p>
                        <p><strong>Organización:</strong> {user.organization?.name || 'Ninguna'}</p>
                        {user.organization && (
                        <>
                            <p><strong>Email organización:</strong> {user.organization.email || '-'}</p>
                            <p><strong>Teléfono organización:</strong> {user.organization.phone || '-'}</p>
                        </>
                        )}
                        <p><strong>Fecha de creación:</strong> {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</p>
                        <div className="organizador-status">
                            {tieneEventoAprobado ? (
                                <span className="badge-organizador" aria-label="Organizador activo">
                                    Tienes eventos aprobados y eres un organizador activo.
                                </span>
                            ) : (
                                <span className="badge-no-organizador" aria-label="No es organizador aún">
                                    No tienes eventos aprobados aún.
                                </span>
                            )}
                        </div>
                        <div className="perfil-botones">
                            <button
                                className="btn-actualizar"
                                onClick={() => navigate('/perfil/editar')}
                                aria-label="Actualizar mi información"
                            >
                                Actualizar mi información
                            </button>
                            <button
                                className="btn-eliminar"
                                aria-label="Eliminar mi usuario"
                            >
                                Eliminar mi usuario
                            </button>
                        </div>
                    </section>

                    {/* --- ORGANIZACIONES --- */}
                    <section className="perfil-organizaciones" aria-labelledby="orgs-titulo" style={{marginBottom: "36px"}}>
                        <h3 id="orgs-titulo" style={{ color: "#ff6600" }}>Organizaciones creadas</h3>
                        {orgsCreadas.length === 0 ? (
                            <div style={{ color: "#a18d04", background: "#FFFBE6", padding: "12px", borderRadius: "6px", marginBottom: "10px" }}>
                                No has creado organizaciones aún.
                            </div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Teléfono</th>
                                        <th>Email</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orgsCreadas.map((org, idx) => (
                                        <tr key={org.id}>
                                            <td>{org.name}</td>
                                            <td>{org.phone || '-'}</td>
                                            <td>{org.email || '-'}</td>
                                            <td className="celda-acciones">
                                                <div className="acciones-container">
                                                    <button
                                                        aria-haspopup="true"
                                                        aria-expanded={menusOrgs[idx] || false}
                                                        aria-controls={`acciones-org-dropdown-${org.id}`}
                                                        onClick={() =>
                                                            setMenusOrgs((prev) => ({ ...prev, [idx]: !prev[idx] }))
                                                        }
                                                        className="btn-acciones"
                                                        tabIndex={0}
                                                    >
                                                        Acciones
                                                    </button>
                                                    {menusOrgs[idx] && (
                                                        <div
                                                            className="acciones-dropdown"
                                                            id={`acciones-org-dropdown-${org.id}`}
                                                            role="menu"
                                                            tabIndex={-1}
                                                        >
                                                            <button className="btn-modificar" onClick={() => handleEditarOrg(org.id)} role="menuitem">Modificar</button>
                                                            <button className="btn-eliminar" onClick={() => handleEliminarOrg(org.id)} role="menuitem">Eliminar</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <div style={{ marginTop: "20px", textAlign: "left" }}>
                            <button
                                className="btn-actualizar"
                                style={{ fontSize: "1.07rem", fontWeight: 700, minWidth: "170px" }}
                                onClick={() => navigate("/crear-organizacion")}
                            >
                                + Crear organización
                            </button>
                        </div>
                    </section>

                    {/* --- EVENTOS --- */}
                    <section className="perfil-eventos" aria-labelledby="eventos-titulo">
                        <h3 id="eventos-titulo" style={{ color: "#ff6600" }}>Eventos publicados</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Fecha de creación</th>
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {eventos.length > 0 ? (
                                    eventos.map((ev, idx) => (
                                        <tr key={ev.id}>
                                            <td>{ev.name}</td>
                                            <td>{ev.created_at ? new Date(ev.created_at).toLocaleDateString() : '-'}</td>
                                            <td className="celda-acciones">
                                                <div className="acciones-container">
                                                    <button
                                                        aria-haspopup="true"
                                                        aria-expanded={menusVisibles[idx] || false}
                                                        aria-controls={`acciones-dropdown-${ev.id}`}
                                                        onClick={() =>
                                                            setMenusVisibles((prev) => ({ ...prev, [idx]: !prev[idx] }))
                                                        }
                                                        className="btn-acciones"
                                                        tabIndex={0}
                                                    >
                                                        Acciones
                                                    </button>
                                                    {menusVisibles[idx] && (
                                                        <div
                                                            className="acciones-dropdown"
                                                            id={`acciones-dropdown-${ev.id}`}
                                                            role="menu"
                                                            tabIndex={-1}
                                                        >
                                                            <button className="btn-ver" onClick={() => navigate(`/event/${ev.id}`)} role="menuitem">Ver</button>
                                                            <button className="btn-modificar" onClick={() => navigate(`/editar-evento/${ev.id}`)} role="menuitem">Modificar</button>
                                                            <button className="btn-eliminar" role="menuitem">Eliminar</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                                            No se han publicado eventos.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}