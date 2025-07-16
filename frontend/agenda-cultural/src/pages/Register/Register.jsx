import './Register.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import bannerImg from '../../assets/banner.jpg'; // 

export default function Register() {
  return (
    <>
    <Header />
      <main className="register-page">
        <div className="register-container">
          <form className="register-form">
            <label>Nombre:</label>
            <input type="text" placeholder="Nombre" />

            <label>Apellidos:</label>
            <input type="text" placeholder="Apellidos" />

            <label>Correo electrónico:</label>
            <input type="email" placeholder="correo@correo.com" />

            <label>Contraseña:</label>
            <input type="password" placeholder="**********" />

            <label>Confirmar contraseña:</label>
            <input type="password" placeholder="**********" />

            <div className="checkbox">
              <input className='checkbtn' type="checkbox" id="privacidad" />
              <label htmlFor="privacidad">Acepto política de privacidad</label>
            </div>

            <a href="#" className="link-politica">Ver política de privacidad</a>

            <div className='button-section'>
                <input className="button" type="submit" value="Registrarse"></input>
            </div>
            
          </form>

          <div className="register-image">
            <img src={bannerImg} alt="Registro" />
            <div className="text-overlay">
              <h2>Registro de Cuenta</h2>
              <p>La cultura vive donde estés.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
