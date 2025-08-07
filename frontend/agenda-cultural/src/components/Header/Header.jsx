import './Header.css';
import logo from '../../assets/logo.png';
import user from '../../assets/user.png'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { getUsuarioActual } from '../../utils/getUsuarioActual';


export default function Header({ tipoUsuario = 'visitante', nombre = 'Usuario', correo = ''}) {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { id } = getUsuarioActual(); // obtener ID desde localStorage


  //Despliegue del submenu
  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  //Cierre de sesión
  const cerrarSesion = () => {
  localStorage.removeItem('usuario');
  navigate('/login');
};

  return (
    <header className="header">
      <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <img className="logo" src={logo} alt="Logo AGENDA CULTURAL" />
      </div>

      {/* Botones para VISITANTE */}
      {tipoUsuario === 'visitante' && (
        <div className="buttons">
          <button onClick={() => navigate('/login')}>Iniciar sesión</button>
          <button onClick={() => navigate('/registro')}>Registrarse</button>
        </div>
      )}

      {/* Botones para USUARIO LOGUEADO */}
      {tipoUsuario === 'usuario' && (
        <div className="nav-user">
          <button onClick={() => navigate('/')}>Inicio</button>
          <button onClick={() => navigate('/crear-evento')}>Crear Evento</button>
          <div className="user-menu" onClick={toggleMenu}>
            <img className="avatar" src={user} alt="usuario" />
            <span>{nombre}</span>
            {menuAbierto && (
              <div className="dropdown">
               <button onClick={() => navigate(`/perfil/${id}`)}>Mi Perfil</button>

                <button onClick={() => navigate('/mi-agenda')}>Mi Agenda</button>
                <button onClick={cerrarSesion}>Cerrar sesión</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Botones para ADMINISTRADOR */}
      {tipoUsuario === 'admin' && (
        <div className="nav-user">
          <button onClick={() => navigate('/')}>Inicio</button>
          <div className="user-menu" onClick={toggleMenu}>
            <img className="avatar" src={user} alt="admin" />
            <span>{nombre}</span>
            {menuAbierto && (
              <div className="dropdown">
                <button onClick={() => navigate('/admin/eventos')}>Administrar Eventos</button>
                <button onClick={() => navigate('/admin/usuarios')}>Administrar Usuarios</button>
                <button onClick={cerrarSesion}>Cerrar sesión</button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
