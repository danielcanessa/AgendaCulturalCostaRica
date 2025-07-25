import './Login.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import bannerImg from '../../assets/banner.jpg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import login from '../../data/login'


//Simulación de base de datos
const usuarios = login

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const manejarLogin = (e) => {
    e.preventDefault();

    const encontrado = usuarios.find(
      u => u.usuario === usuario && u.password === password
    );

    if (encontrado) {
      localStorage.setItem('usuario', JSON.stringify({
        nombre: encontrado.nombre,
        rol: encontrado.rol,
        correo: encontrado.correo
      }));
      navigate('/');
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <>
      <Header tipoUsuario="visitante" />
      <main className="login-page">
        <div className="login-container">
          <div className="login-image">
            <img src={bannerImg} alt="Fondo" />
            <div className="text-overlay">
              <h2>Iniciar Sesión</h2>
              <p>Tu agenda cultural, a un clic.</p>
            </div>
          </div>

          <form className="login-form" onSubmit={manejarLogin}>
            <label>Usuario:</label>
            <input
              type="text"
              placeholder="Ingrese su usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />

            <label>Contraseña:</label>
            <input
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className='button-section'>
              <input className="button" type="submit" value="Iniciar sesión" />
            </div>

            <a href="#">Recuperar contraseña</a>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
