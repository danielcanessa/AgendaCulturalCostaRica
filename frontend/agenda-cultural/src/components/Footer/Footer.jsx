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
        <img className="logo-footer" src={logoFooter} alt="Agenda Cultural Costa Rica" />
        <div className="footer-col">
          <p>Enlaces útiles</p>
          <button
            type="button"
            className="footer-link-btn"
            tabIndex={0}
            aria-label="Acerca de nosotros"
            onClick={() => window.alert('Próximamente: Acerca de nosotros')}
          >
            Acerca de nosotros
          </button>
          <br />
          <br />
          <button
            type="button"
            className="footer-link-btn"
            tabIndex={0}
            aria-label="Información legal"
            onClick={() => window.alert('Próximamente: Información legal')}
          >
            Información legal
          </button>
        </div>
        <div className="footer-col">
          <p>Conectá con nosotros</p>
          <div className="redes">
            <span>
              <a
                target='_blank'
                rel="noopener noreferrer"
                href="https://www.facebook.com"
                aria-label="Facebook"
              >
                <img src={facebook} alt="Facebook de Agenda Cultural Costa Rica" />
              </a>
            </span>
            <span>
              <a
                target='_blank'
                rel="noopener noreferrer"
                href="https://www.instagram.com"
                aria-label="Instagram"
              >
                <img src={instagram} alt="Instagram de Agenda Cultural Costa Rica" />
              </a>
            </span>
            <span>
              <a
                target='_blank'
                rel="noopener noreferrer"
                href="https://www.tiktok.com"
                aria-label="TikTok"
              >
                <img src={tiktok} alt="TikTok de Agenda Cultural Costa Rica" />
              </a>
            </span>
            <span>
              <a
                target='_blank'
                rel="noopener noreferrer"
                href="https://www.youtube.com"
                aria-label="YouTube"
              >
                <img src={youtube} alt="YouTube de Agenda Cultural Costa Rica" />
              </a>
            </span>
          </div>
          <p>
            <a href="mailto:agendaculturalcr@gmail.com">agendaculturalcr@gmail.com</a>
          </p>
        </div>
      </div>
      <div className="footer-copy">
        © 2025 Agenda Cultural Costa Rica. Todos los derechos reservados.
      </div>
    </footer>
  );
}