import './Header.css';
import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="header">
      <div >
        <img className="logo" src={logo} alt="Logo AGENDA CULTURAL " />
      </div>
      <div className="buttons">
        <button onClick={() => navigate('/login')}>Iniciar sesión</button>
        <button onClick={() => navigate('/registro')}>Registrarse</button>
      </div>
    </header>
  );
}
