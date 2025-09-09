  import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import banner01 from '../../assets/Banner-Novo.gif';
import banner02 from '../../assets/Banner-Novo2.gif';
import banner03 from '../../assets/PromocaoCerveja.jpeg';
import banner04 from '../../assets/banner04.jpg';
import video from '../../assets/video.mp4';
import { Link } from 'react-router-dom'; // Para navegação
import './Banner.css';

// Componentes de setas personalizados
const ArrowLeft = (props) => {  
  const { onClick } = props;
  return (
    <div className="custom-arrow custom-arrow-left" onClick={onClick}>
      ◀
    </div>
  );
};

const ArrowRight = (props) => {
  const { onClick } = props;
  return (
    <div className="custom-arrow custom-arrow-right" onClick={onClick}>
      ▶
    </div>
  );
};

const Banner = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    afterChange: (current) => startTyping(current),
    arrows: true,
    prevArrow: <ArrowLeft />, // Usando seta personalizada para a esquerda
    nextArrow: <ArrowRight />  // Usando seta personalizada para a direita
  };

  const banners = [
    { src: video, type: 'video', text: "", link: "/video" },
    { src: banner02, type: 'image', text: "Para curtir o churrasco com os amigos", link: "/kits-e-promocoes" },
    { src: banner04, type: 'image', text: "Mercearia", link: "/mercearia" }
  ];

  const typingSpeed = 100;
  const [currentText, setCurrentText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);

  const startTyping = (index) => {
    setCurrentText("");
    setCharIndex(0);
    setSlideIndex(index);
  };

  useEffect(() => {
    if (charIndex < banners[slideIndex].text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prev) => prev + banners[slideIndex].text[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, slideIndex]);

  return (
    <div className="banner">
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <div key={index} className="image-container">
            {banner.type === 'video' ? (
              <video width="100%" height="100%" autoPlay loop muted>
                <source src={banner.src} type="video/mp4" />
                Seu navegador não suporta o vídeo.
              </video>
            ) : (
              <img src={banner.src} alt={`Imagem ${index + 1}`} />
            )}
            <div className="texto-banner">
              {index === slideIndex ? currentText : ""}
              {/* Botão de redirecionamento abaixo do texto */}
              {banner.text && (
                <div className="botao-banner01">
                  <Link to={banner.link}>
                    <button className='bot'>Ver Mais</button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;
