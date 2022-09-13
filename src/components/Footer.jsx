import iconFacebook from '../assets/icon-facebook.svg';
import iconTwitter from '../assets/icon-twitter.svg';
import iconInstagram from '../assets/icon-instagram.svg';
import iconEmail from '../assets/icon-email.png';
import logo from '../assets/logo-pici130x177t.png';

export const Footer = () => {
  return (
    <footer>
      <div className="grid-container_footer">
        <picture className="logo-footer">
          <img src={logo} alt="Logo Pici" />
        </picture>
        <div className="icons-redes">
          <a
            href="https://es-es.facebook.com/"
            target="_blank"
            rel="noreferrer"
          >
            <img src={iconFacebook} alt="Facebook" />
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
            <img src={iconInstagram} alt="Instagram" />
          </a>
        </div>
        <p className="p_icons-contacto">Contacto:</p>
        <div className="div-a-icons">
          <a href="mailto:picigui@hotmail.com" target="_blank" rel="noreferrer">
            <img src={iconEmail} alt="Icon-mailto:picigui@hotmail.com" />
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noreferrer">
            <img src={iconTwitter} alt="Twitter" />
          </a>
        </div>
        <div className="pie-footer">
          <p className="attribution">
            Desde Gran Canaria hecho con <span className="corazon">♥</span> para
            el mundo.
          </p>
        </div>
      </div>
    </footer>
  );
};
