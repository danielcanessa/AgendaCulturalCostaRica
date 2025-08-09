import React, { useState, useEffect } from 'react';
import './UserAdmin.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { getUsuarioActual } from '../../utils/getUsuarioActual';

export default function UserAdmin() {
  const { tipoUsuario, nombre, correo } = getUsuarioActual();
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("access");


    fetch("http://localhost:8000/api/users/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("¿Es un array?", Array.isArray(data));
        console.log("Tipo de data:", typeof data);
        console.log("Contenido:", data);
        
        setUsuarios(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Error cargando usuarios:", err);
      });
  }, []);

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  

  return (
    <>
      <Header tipoUsuario={tipoUsuario} nombre={nombre} correo={correo} />
      <main className='user-admin-container'>
        <section className="user-admin-page">
          <h2 className="titulo">Administrar Usuarios</h2>

          <div className="event-search">
            <label className='event-Title titulo-agenda'>Buscar usuario:</label>
            <div className="search">
              <i className="bx bx-search"></i>
              <input
                type="text"
                placeholder="Buscar por email..."
                className="search-input"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <h3 className="subtitulo">Usuarios:</h3>

          <div className="tabla-contenedor">
            <table className="tabla-usuarios">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Nombre</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((usuario, index) => (
                  <tr key={index}>
                    <td><a href={`mailto:${usuario.email}`}>{usuario.email}</a></td>
                    <td>{usuario.name} {usuario.last_name}</td>
                    <td>{usuario.role?.name || 'N/A'}</td>
                    <td className="acciones">
                      <button className="btn-editar" onClick={() => navigate(`/perfil/${usuario.id}`)}>Ver perfil</button>
                      <button className="btn-eliminar">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {usuariosFiltrados.length === 0 && (
              <p className="error-msj">No se encontraron usuarios.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
