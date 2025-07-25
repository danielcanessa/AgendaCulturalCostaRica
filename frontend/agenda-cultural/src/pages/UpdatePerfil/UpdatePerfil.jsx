import './UpdatePerfil.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import bannerImg from '../../assets/banner.jpg';
import { getUsuarioActual } from '../../utils/getUsuarioActual';
import { useState } from 'react';
import usuarios from '../../data/usuarios';

export default function UpdatePerfil() {
  const { tipoUsuario, nombre, correo} = getUsuarioActual();

  const usuario = usuarios.find(u => u.correo === correo) || {};


  //Aqui se cambia la información extraida del usuario correspondiente
  const [formulario, setFormulario] = useState({
    nombre: usuario.nombre,
    apellidos: usuario.apellidos,
    telefono: usuario.telefono,
    biografia: usuario.biografia,
    contraseña: ''
  });

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    console.log('Datos actualizados:', formulario);
    alert('Perfil actualizado correctamente');
  };

  return (
    <>
      <Header tipoUsuario={tipoUsuario} nombre={nombre} />
      <main className="update-perfil-page">
        <div className="update-container">
          <form className="update-form" onSubmit={manejarSubmit}>
            <label>Nombre Completo:</label>
            <input type="text" name="nombre" value={formulario.nombre} onChange={handleChange} />

            <label>Apellidos:</label>
            <input type="text" name="apellidos" value={formulario.apellidos} onChange={handleChange} />

            <label>Teléfono:</label>
            <input type="text" name="telefono" value={formulario.telefono} onChange={handleChange} />

            <label>Biografía:</label>
            <textarea name="biografia" value={formulario.biografia} onChange={handleChange} />

            <label>Modificar contraseña:</label>
            <input type="password" name="contraseña" value={formulario.contraseña} onChange={handleChange} />

            <button className="btn-actualizar" type="submit">Actualizar perfil</button>
          </form>

          <div className="update-imagen">
            <img src={bannerImg} alt="Actualizar Perfil" />
            <div className="text-overlay">
              <h2>Actualizar Perfil</h2>
              <p>La cultura vive donde estés.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
