
import './Perfil.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { getUsuarioActual } from '../../utils/getUsuarioActual';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import eventos from '../../data/eventos';
import usuarios from '../../data/usuarios';

export default function Perfil() {
    const navigate = useNavigate();
    const { tipoUsuario, nombre, correo } = getUsuarioActual();
    const { correoUsuario } = useParams();

    const correoMostrado = correoUsuario || correo;
    const viendoOtroPerfil = correo !== correoMostrado;
    const esVistaAdmin = tipoUsuario === 'admin' && viendoOtroPerfil;

    console.log("Usuario logueado:", correo);
    console.log("Perfil mostrado:", correoUsuario);
    console.log("¿Es vista admin?", esVistaAdmin);


    const usuario = usuarios.find(u => u.correo === correoMostrado) || {};
    const [menusVisibles, setMenusVisibles] = useState({});

    const eventosUsuario = eventos.filter(ev => ev.correoAutor === usuario.correo);

    return (
        <>
            <Header tipoUsuario={tipoUsuario} nombre={nombre} correo={correo} />
            <main className="perfil-page">
                <section className="perfil-info">
                    <h2>{esVistaAdmin ? 'Editar usuario' : 'Datos del usuario'}</h2>
                    <p><strong>Nombre:</strong> {usuario.nombre}</p>
                    <p><strong>Apellidos:</strong> {usuario.apellidos}</p>
                    <p><strong>Correo:</strong> {usuario.correo}</p>
                    <p><strong>Teléfono:</strong> {usuario.telefono}</p>
                    <p><strong>Biografía:</strong> {usuario.biografia}</p>

                    {esVistaAdmin && (
                        <div className="campo-rol">
                            <p><strong>Rol:</strong></p>
                            <select defaultValue={usuario.tipoUsuario}>
                                <option value="">Seleccione el rol</option>
                                <option value="Visitante">Visitante</option>
                                <option value="Administrador">Administrador</option>
                            </select>
                        </div>
                    )}

                    <p><strong>Fecha de creación:</strong> {usuario.fechaCreacion || 'No disponible'}</p>

                    <div className="organizador">
                        <input type="checkbox" checked={usuario.organizador} disabled />
                        <label>Organizador de eventos</label>
                        <p>Este campo se activa automáticamente cuando el usuario publica eventos</p>
                    </div>

                    <div className="perfil-botones">
                        {!esVistaAdmin && (
                            <button className="btn-actualizar" onClick={() => navigate('/perfil/editar')}>
                                Actualizar mi información
                            </button>
                        )}
                        {esVistaAdmin && (
                            <button className="btn-actualizar-admin">
                                Actualizar
                            </button>
                        )}
                        
                        <button className={esVistaAdmin ? "btn-eliminar-admin" : "btn-eliminar"}>
                            {esVistaAdmin ? "Eliminar usuario" : "Eliminar mi usuario"}
                        </button>
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
                                                        {!esVistaAdmin && (
                                                            <button className="btn-modificar" onClick={() => navigate(`/editar-evento/${ev.id}`)} >Modificar</button>
                                                        )}
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
                                        No se han publicado eventos.
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
