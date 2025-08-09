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
  const [eliminandoIds, setEliminandoIds] = useState(new Set());

  useEffect(() => {
    const token = localStorage.getItem("access");

    fetch("http://localhost:8000/api/users/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(async res => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setUsuarios(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Error cargando usuarios:", err);
        setUsuarios([]);
      });
  }, []);

  const usuariosFiltrados = usuarios.filter((usuario) =>
    (usuario.email || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleEliminar = async (userId, userEmail) => {
    if (userEmail?.toLowerCase() === (correo || '').toLowerCase()) {
      alert("No puedes eliminar tu propio usuario desde aquí.");
      return;
    }

    const ok = window.confirm(`¿Eliminar al usuario ${userEmail}? Esta acción no se puede deshacer.`);
    if (!ok) return;

    const token = localStorage.getItem("access");

    // marcar fila como "eliminando"
    setEliminandoIds(prev => new Set(prev).add(userId));

    try {
      const res = await fetch(`http://localhost:8000/api/users/${userId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (res.status === 204) {
        // borrado OK
        setUsuarios(prev => prev.filter(u => u.id !== userId));
        return;
      }

      // si hay cuerpo con detalle del error, muéstralo
      let detail = '';
      try { detail = await res.text(); } catch {}
      if (res.status === 403) {
        alert("No tienes permisos para eliminar este usuario.");
      } else if (res.status === 409) {
        alert("No se puede eliminar: el usuario tiene dependencias (p. ej., eventos creados).");
      } else {
        alert(`No se pudo eliminar (HTTP ${res.status}). ${detail || ''}`);
      }
    } catch (e) {
      console.error(e);
      alert("Error de red al intentar eliminar el usuario.");
    } finally {
      setEliminandoIds(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

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
                {usuariosFiltrados.map((usuario) => {
                  const isSelf = (usuario.email || '').toLowerCase() === (correo || '').toLowerCase();
                  const deleting = eliminandoIds.has(usuario.id);
                  return (
                    <tr key={usuario.id}>
                      <td><a href={`mailto:${usuario.email}`}>{usuario.email}</a></td>
                      <td>{usuario.name} {usuario.last_name}</td>
                      <td>{usuario.role?.name || 'N/A'}</td>
                      <td className="acciones">
                        <button className="btn-editar" onClick={() => navigate(`/perfil/${usuario.id}`)}>
                          Ver perfil
                        </button>
                        <button
                          className="btn-eliminar"
                          disabled={deleting || isSelf}
                          onClick={() => handleEliminar(usuario.id, usuario.email)}
                          title={isSelf ? "No puedes eliminar tu propio usuario" : "Eliminar usuario"}
                        >
                          {deleting ? 'Eliminando…' : 'Eliminar'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
