import './Perfil.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { getUsuarioActual } from '../../utils/getUsuarioActual';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import eventos from '../../data/eventos';

export default function Perfil() {
    const navigate = useNavigate();
    const { tipoUsuario, nombre } = getUsuarioActual();

    const [menusVisibles, setMenusVisibles] = useState({});

    

    // Simulación de datos del usuario
    const usuario = {
        nombre: 'Shirley',
        apellidos: 'Brenes',
        correo: 'shirley.brenes@something.com',
        telefono: '(506) 7894 6512',
        biografia: 'Biografía escrita por el usuario.',
        organizador: true
    };

    //Filtra solo los eventos que le correspondan al usuario, para esto utilice correo como el identificador
    const eventosUsuario = eventos.filter(ev => ev.correoAutor === usuario.correo);

    return (
        <>
        <Header tipoUsuario={tipoUsuario} nombre={nombre} />
        <main className="perfil-page">
            <section className="perfil-info">
            <h2>Datos del usuario</h2>
            <p><strong>Nombre:</strong> {usuario.nombre}</p>
            <p><strong>Apellidos:</strong> {usuario.apellidos}</p>
            <p><strong>Correo:</strong> {usuario.correo}</p>
            <p><strong>Teléfono:</strong> {usuario.telefono}</p>
            <p><strong>Biografía:</strong> {usuario.biografia}</p>

            <div className="organizador">
                <input type="checkbox" checked={usuario.organizador} disabled />
                <label>Organizador de eventos</label>
                <p>Este campo se activa automáticamente cuando el usuario publica eventos</p>
            </div>

            <div className="perfil-botones">
                <button className="btn-actualizar" onClick={() => navigate('/perfil/editar')}>Actualizar mi información</button>
                <button className="btn-eliminar">Eliminar mi usuario</button>
            </div>
            </section>

            <section className="perfil-eventos">
            <h3>Eventos publicados</h3>
            <table>
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Fecha de creación</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                    {eventosUsuario.length > 0 ? (
                        eventosUsuario.map((ev, idx) => (
                        <tr key={idx}>
                            <td>{ev.nombre}</td>
                            <td>{ev.fecha}</td>
                            <td className="celda-acciones">
                            <div className="acciones-container">
                                <button
                                onClick={() =>
                                    setMenusVisibles((prev) => ({ ...prev, [idx]: !prev[idx] }))
                                }
                                className="btn-acciones"
                                >
                                Acciones
                                </button>
                                {menusVisibles[idx] && (
                                <div className="acciones-dropdown">
                                    <button className="btn-ver" onClick={() => navigate(`/event/${ev.id}`)}>Ver</button>
                                    <button className="btn-modificar">Modificar</button>
                                    <button className="btn-eliminar">Eliminar</button>
                                </div>
                                )}
                            </div>
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                            No has publicado eventos aún.
                        </td>
                        </tr>
                    )}
                </tbody>
            </table>
            </section>
        </main>
        <Footer />
        </>
    );
}
