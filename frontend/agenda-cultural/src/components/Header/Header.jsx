import './Header.css';
import logo from '../../assets/logo.png';

export default function Header() {
  return (
    <header className="header">
      <div >
        <img className="logo" src={logo} alt="Logo AGENDA CULTURAL " />
      </div>
      <div className="buttons">
        <button>Iniciar sesión</button>
        <button>Registrarse</button>
      </div>
    </header>
  );
}
