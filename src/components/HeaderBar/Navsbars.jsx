// Navsbars.js

import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { NavLink } from "react-router-dom";
import "swiper/css";
import logo from "../../assets/logo.png";
import "./Navsbars.css";

// Estrutura de dados (a mesma de antes)
const navLinks = [
  { text: "Home", to: "/" },

  {
    text: "Bebidas",
    isDropdown: true,
    subLinks: [
      { text: "Cervejas", to: "/cervejas" },
      { text: "Destilados", to: "/destilados" },
      { text: "Vodkas/Gin", to: "/vodkas" },
      { text: "Vinhos", to: "/vinhos" },
      { text: "Espumantes", to: "/espumantes" },
      { text: "Energéticos", to: "/energeticos" },
    ],
  },
  
  
  {
    text: "Promoções e Kits",
    isDropdown: true,
    subLinks: [
      { text: "Promoções / Kits Bebidas", to: "/promocoes-e-bebidas" },
      { text: "Kit Churrasco / Promoções", to: "/kits-e-promocoes" },
    ],
  },
  { text: "Mercearia", to: "/mercearia" },
  { text: "Gelos", to: "/gelos" },
  { text: "PetShop", to: "/petshop" },
  { text: "Locais de Entrega", to: "/locais-de-entrega" },
  { text: "Carrinho", to: "/carrinho" },
];

const Navsbars = () => {
  // Estado para controlar qual dropdown está aberto (pelo seu índice)
  const [openDropdown, setOpenDropdown] = useState(null);
  const navRef = useRef(null);

  const handleDropdownToggle = (index) => {
    // Se o dropdown clicado já estiver aberto, feche-o. Senão, abra-o.
    setOpenDropdown(openDropdown === index ? null : index);
  };

  // Efeito para fechar o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header-container" ref={navRef}>
      <div className="logo-container">
        <NavLink to="/">
          <img src={logo} alt="Logo" className="logo-img" />
        </NavLink>
      </div>

      <nav className="navsbars">
        <Swiper
          slidesPerView="auto"
          spaceBetween={55}
          grabCursor={true}
          // Adicione esta linha para garantir que os cliques funcionem melhor
          preventClicks={false}
        >
          {navLinks.map((link, index) => (
            // A mudança principal está aqui: adicionamos uma classe dinâmica
            <SwiperSlide
              key={index}
              className={`nav-slide ${
                openDropdown === index ? "dropdown-active" : ""
              }`}
            >
              {link.isDropdown ? (
                <div className="nav-item dropdown">
                  <span
                    className="nav-link dropdown-toggle"
                    onClick={() => handleDropdownToggle(index)}
                  >
                    {link.text} <span className="arrow"></span>
                  </span>
                  <div
                    className={`dropdown-menu ${
                      openDropdown === index ? "show" : ""
                    }`}
                  >
                    {link.subLinks.map((subLink, subIndex) => (
                      <NavLink
                        key={subIndex}
                        to={subLink.to}
                        className="dropdown-item"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {subLink.text}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="nav-item">
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    {link.text}
                  </NavLink>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </nav>
    </header>
  );
};

export default Navsbars;
