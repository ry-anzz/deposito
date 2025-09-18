import React from 'react';
import { useEffect, useState } from 'react';
import { useCarrinho } from '../../context/CarrinhoContext';
import supabase from '../../../supabaseClient';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './Destaquebar.css';
import { useNavigate } from 'react-router-dom';

// --- NOVO SUB-COMPONENTE PARA O BOTÃO INTELIGENTE ---
const BotaoAdicionar = ({ produto }) => {
  const { carrinho, adicionarAoCarrinho, diminuirQuantidade } = useCarrinho();
  
  // Verifica se este produto específico já está no carrinho
  const itemNoCarrinho = carrinho.find(item => item.id === produto.id);

  if (itemNoCarrinho) {
    // Se o item já está no carrinho, mostra o controlo de quantidade
    return (
      <div className="quantity-control-card">
        <button onClick={() => diminuirQuantidade(produto.id)}>−</button>
        <span>{itemNoCarrinho.quantidade}</span>
        <button onClick={() => adicionarAoCarrinho(produto)}>+</button>
      </div>
    );
  }

  // Se não, mostra o botão "Adicionar"
  return (
    <button className="add-to-cart-btn" onClick={() => adicionarAoCarrinho(produto)}>
      Adicionar
    </button>
  );
};


const Destaquebar = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  // A LÓGICA DO MODAL FOI COMPLETAMENTE REMOVIDA DAQUI
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("produtos")
          .select("*")
          .eq("category", "CERVEJA")
          .eq("destaque", true);
        if (error) throw new Error(error.message);
        setProdutos(data || []);
      } catch (error) {
        console.error("Erro ao carregar os produtos:", error);
      } finally {
        setCarregando(false);
      }
    };

    fetchData();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 4,
    slidesToScroll: 1,
    draggable: true,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="destaque-bar-container">
      <h1 className="texto-destaque">Destaques de Cerveja</h1>
      {carregando ? (
        <p>Carregando produtos...</p>
      ) : (
        <Slider {...settings}>
          {produtos.map((produto) => (
            <div className="destaque-produto-card" key={produto.id}>
              <img
                className="destaque-produto-imagem"
                src={produto.imagem_url}
                alt={produto.name}
              />
              <h3>{produto.name}</h3>
              <p className="destaque-produto-preco">
                R$
                {produto.price ? produto.price.toFixed(2) : "Indisponível"}
              </p>
              {/* Usamos o novo componente de botão aqui */}
              <BotaoAdicionar produto={produto} />
            </div>
          ))}
        </Slider>
      )}
      <button
        className="destaque-ver-mais-button"
        onClick={() => navigate("/cervejas")} // Corrigido para levar à página de cervejas
      >
        Ver Mais
      </button>

      {/* O JSX DO MODAL FOI REMOVIDO */}
    </div>
  );
};

export default Destaquebar;