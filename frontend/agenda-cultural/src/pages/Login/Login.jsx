import './Login.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import bannerImg from '../../assets/banner.jpg'; 

export default function Login() {
  return (
    <>
    <Header/>
      <main className="login-page">
        <div className="login-container">
          <div className="login-image">
            <img src={bannerImg} alt="Fondo" />
            <div className="text-overlay">
              <h2>Iniciar Sesión</h2>
              <p>Tu agenda cultural, a un clic.</p>
            </div>
          </div>

          <form className="login-form">
            <label>Usuario:</label>
            <input type="text" placeholder="Ingrese su usuario" />

            <label>Contraseña:</label>
            <input type="password" placeholder="Ingrese su contraseña" />

            <div className='button-section'>
                <input className="button" type="submit" value="Iniciar sesión"></input>
            </div>
            
            <a href="">Recuperar contraseña</a> 
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
