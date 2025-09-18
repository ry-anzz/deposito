import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import supabase from '../../../supabaseClient';
import { useCarrinho } from '../../context/CarrinhoContext';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './DestaqueEspumante.css';

// --- SUB-COMPONENTE PARA O BOTÃO INTELIGENTE ---
// Este componente decide se mostra "Adicionar" ou o controlo de quantidade
const BotaoAdicionar = ({ produto }) => {
  const { carrinho, adicionarAoCarrinho, diminuirQuantidade } = useCarrinho();
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


const DestaqueEspumante = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();
  
  // A lógica do modal foi removida, o useCarrinho agora é usado pelo BotaoAdicionar

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("produtos")
          .select("*")
          .eq("category", "ESPUMANTES")
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
  
  // As funções do modal (abrirModal, fecharModal, etc.) foram removidas daqui

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
    <div className="espumante-container">
      <h1>Destaques de Espumante</h1>
      {carregando ? (
        <p>Carregando produtos...</p>
      ) : (
        <Slider {...settings}>
          {produtos.map((produto) => ( // Alterado para usar produto.id como key
            <div className="espumante-produto-card" key={produto.id}>
              <div className="espumante-produto-imagem-container">
                <img
                  className="espumante-produto-imagem"
                  src={produto.imagem_url}
                  alt={produto.name} // Corrigido para produto.name
                />
              </div>
              <h3>{produto.name}</h3>
              <p>
                Preço: R$
                {produto.price ? produto.price.toFixed(2) : "Indisponível"}
              </p>
              
              {/* SUBSTITUIÇÃO DO BOTÃO ANTIGO PELO NOVO COMPONENTE */}
              <BotaoAdicionar produto={produto} />

            </div>
          ))}
        </Slider>
      )}

      <button
        className="ver-mais"
        onClick={() => navigate('/espumantes')}
      >
        Ver Mais
      </button>

      {/* O JSX DO MODAL FOI COMPLETAMENTE REMOVIDO */}
    </div>
  );
};

export default DestaqueEspumante;
