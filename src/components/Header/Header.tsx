import "./Header.css";
import logo from "../../assets/logo.png";

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <img className="logo" src={logo} alt="The Quack Duck Shop" />

        <button className="cart-button">Cart</button>
      </div>
    </header>
  );
}

export default Header;
