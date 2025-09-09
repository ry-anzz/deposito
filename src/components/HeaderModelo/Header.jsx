import React from "react";
import "./Header.css";
import localizacao from "../../assets/localizacao.png";
import email from "../../assets/o-email.png";
import instagram from "../../assets/instagram.png";

const Header = () => {
  return (
    <div className="header">
      {/* <div className="navbar">
        <div className="contact-info">
          <div className="div01">
            <img src={localizacao} alt="Localização" />
            <p>
              Alameda da Lagoa, 26 - Granja dos Cavaleiros, Macaé - RJ,
              27930-130
            </p>
          </div>
          <div className="div02">
            <img src={email} alt="Email" />
            <p>depositolagoa2022@gmail.com</p>
          </div>
        </div>
        <div className="instagram-icon">
          <a
            href="https://www.instagram.com/deposito_dalagoa"
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-link"
          >
            <img src={instagram} alt="Instagram" />
            <p>deposito_dalagoa</p>
          </a>
        </div>
      </div> */}
    </div>
  );
};

export default Header;
