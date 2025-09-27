import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import banner02 from '../../assets/Banner-Novo2.gif';
import banner03 from '../../assets/PromocaoCerveja.jpeg';
import whiskeybanner from '../../assets/whiskeybanner.png';
import churrascobanner from '../../assets/churrascobanner.png';
import video from '../../assets/video.mp4';
import { useNavigate } from 'react-router-dom';
import './Banner.css';

// Componentes de setas personalizados
const ArrowLeft = (props) => {
  const { onClick } = props;
  return <div className="custom-arrow custom-arrow-left" onClick={onClick}>◀</div>;
};

const ArrowRight = (props) => {
  const { onClick } = props;
  return <div className="custom-arrow custom-arrow-right" onClick={onClick}>▶</div>;
};

const Banner = () => {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    prevArrow: <ArrowLeft />,
    nextArrow: <ArrowRight />
  };

  const banners = [
    { src: video, type: 'video', link: "/cervejas" },
    { src: banner02, type: 'image', link: "/cervejas" },
   { src: whiskeybanner, type: 'image', link: "/destilados?filtro=WHISKYS" },
    { src: churrascobanner, type: 'image', link: "/kits-e-promocoes" }
  ];

  const handleBannerClick = (link) => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <div className="banner">
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <div 
            key={index} 
            className="image-container" 
            onClick={() => handleBannerClick(banner.link)}
          >
            {banner.type === 'video' ? (
              <video width="100%" height="100%" autoPlay loop muted playsInline>
                <source src={banner.src} type="video/mp4" />
                Seu navegador não suporta o vídeo.
              </video>
            ) : (
              <img src={banner.src} alt={`Banner ${index + 1}`} />
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;