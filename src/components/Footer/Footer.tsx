import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          <span className="copyright">©</span> DUCK TEAM F26D
        </p>

        <p>
          <Link to="/about" className="footer-link">
            ABOUT THE DUCK TEAM
          </Link>
        </p>

        <p>
          <Link to="/contact" className="footer-link">
            CONTACT US
          </Link>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
