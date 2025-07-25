import React, { useState } from 'react';
import './UserAdmin.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import usuariosExp from '../../data/usuarios';
import { useNavigate } from 'react-router-dom';
import { getUsuarioActual } from '../../utils/getUsuarioActual';

export default function UserAdmin() {
  const { tipoUsuario, nombre } = getUsuarioActual();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');

  const usuariosFiltrados = usuariosExp.filter((usuario) =>
    usuario.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
    <Header tipoUsuario={tipoUsuario} nombre={nombre} />
    <main className='user-admin-container'>
    <section className="user-admin-page">
      <h2 className="titulo">Administrar Usuarios</h2>

      <div className="event-search">
        <label className='event-Title titulo-agenda '>Buscar usuario:</label>
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
              <th>Fecha de creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((usuario, index) => (
              <tr key={index}>
                <td>
                  <a href={`mailto:${usuario.correo}`}>{usuario.correo}</a>
                </td>
                <td>{usuario.fechaCreacion}</td>
                <td className="acciones">
                  <button className="btn-editar"  onClick={() => navigate(`/perfil/${usuario.correo}`)} >Editar</button>
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
    <Footer/>
    </>
  );
}
