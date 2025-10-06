import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { NavLink } from "react-router-dom";
import "swiper/css";
import logo from "../../assets/logo.png";
import supabase from "../../supabaseClient"; // Importa o Supabase
import "./Navsbars.css";

// Estrutura de dados para os links
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
  // CORREÇÃO: O link para a página de sorvetes deve ser em minúsculas
  { text: "Sorvetes e Picolés", to: "/sorvetes" },
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
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);
  // 1. Estado para guardar o texto do cupão
  const [cupomTexto, setCupomTexto] = useState("BOAS COMPRAS 💰");

  const handleDropdownToggle = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  // 2. useEffect para buscar o cupão do Supabase quando o componente carregar
  useEffect(() => {
    const fetchCupom = async () => {
      try {
        // Busca o cupão mais recente da sua tabela 'cupom'
        const { data, error } = await supabase
          .from("cupom")
          .select("nome, valor")
         
          .limit(1)
          .single();

        if (error) {
          console.warn("Nenhum cupão encontrado, a usar mensagem padrão.");
          return; // Mantém a mensagem "BOAS COMPRAS"
        }

        if (data) {
          // Formata o texto para ser exibido na barra
          const textoFormatado = `CUPOM: ${data.nome} - ${data.valor}% OFF! 💰`;
          setCupomTexto(textoFormatado);
        }
      } catch (error) {
        console.error("Erro ao buscar cupão:", error);
      }
    };

    fetchCupom();
  }, []); // O array vazio [] garante que a busca só ocorre uma vez

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="header-container" ref={navRef}>
      <div className="coupon-bar">
        {/* 3. O texto agora vem do estado 'cupomTexto' */}
        <div className="coupon-text">
          <span>{cupomTexto}</span>
          <span>{cupomTexto}</span>
          <span>{cupomTexto}</span>
          <span>{cupomTexto}</span>
        </div>
        <div className="coupon-text">
          <span>{cupomTexto}</span>
          <span>{cupomTexto}</span>
          <span>{cupomTexto}</span>
          <span>{cupomTexto}</span>
        </div>
      </div>

      <div className="main-nav-content">
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
            preventClicks={false}
          >
            {navLinks.map((link, index) => (
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
      </div>
    </header>
  );
};

export default Navsbars;
