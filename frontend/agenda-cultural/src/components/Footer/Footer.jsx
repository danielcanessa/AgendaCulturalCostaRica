import './Footer.css';
import logoFooter from '../../assets/logoFooter.png';
import facebook from '../../assets/SocialMedia/facebook.png'
import instagram from '../../assets/SocialMedia/instagram.png'
import tiktok from '../../assets/SocialMedia/tik-tok.png'
import youtube from '../../assets/SocialMedia/youtube.png'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <img className="logo-footer" src={logoFooter} alt="" />
        <div className="footer-col">
          <p>Enlaces útiles</p>
          <a href="#">Información</a><br />
          <a href="#">Información</a>
        </div>
        <div className="footer-col">
          <p>Conectá con nosotros</p>
          <div className="redes">
            <span><a target='_blank' href="https://www.facebook.com"><img src={facebook} alt="Red social facebook" /></a></span>
            <span><a target='_blank' href="https://www.instagram.com"><img src={instagram} alt="Red social instagram" /></a></span>
            <span><a target='_blank' href="https://www.tiktok.com"><img src={tiktok} alt="Red social tiktok" /></a></span>
            <span><a target='_blank' href="https://www.youtube.com"><img src={youtube} alt="Red social youtube" /></a></span>
          </div>
          <p>agendaculturalcr@gmail.com</p>
        </div>
      </div>
      <div className="footer-copy">
        © 2025 Agenda Cultural Costa Rica. Todos los derechos reservados.
      </div>
    </footer>
  );
}
