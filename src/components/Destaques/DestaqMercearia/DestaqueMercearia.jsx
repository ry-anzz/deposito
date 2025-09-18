import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import supabase from '../../../supabaseClient';
import { useCarrinho } from '../../context/CarrinhoContext'; // Importa as novas funções necessárias
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './DestaqueMercearia.css';

// --- SUB-COMPONENTE PARA O BOTÃO INTELIGENTE ---
const BotaoAdicionar = ({ produto }) => {
  // Pega o carrinho e as funções de adicionar/diminuir do contexto global
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

  // Se não, mostra o botão "Adicionar" original
  return (
    <button className="add-to-cart-btn" onClick={() => adicionarAoCarrinho(produto)}>
      Adicionar
    </button>
  );
};


const DestaqueMercearia = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();
  
  // A lógica do modal foi removida

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
          .eq('category', 'MERCEARIA')
          .eq('destaque', true);
        if (error) throw new Error(error.message);
        setProdutos(data || []);
      } catch (error) {
        console.error('Erro ao carregar os produtos:', error);
      } finally {
        setCarregando(false);
      }
    };
  
    fetchData();
  }, []);

  // TODA A LÓGICA DO MODAL FOI REMOVIDA

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 3, // Ajustado para os cards maiores
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <div className="mercearia-container">
      <h1>Destaques de Mercearia</h1>
      {carregando ? (
        <p>Carregando produtos...</p>
      ) : (
        <Slider {...settings}>
          {produtos.map((produto) => (
            <div className="mercearia-produto-card" key={produto.id}>
              <div className="mercearia-produto-imagem-container">
                <img
                  className="mercearia-produto-imagem"
                  src={produto.imagem_url}
                  alt={produto.name}
                />
              </div>
              <h3>{produto.name}</h3>
              <p>Preço: R${produto.price ? produto.price.toFixed(2) : 'Indisponível'}</p>

              {/* SUBSTITUIÇÃO DO BOTÃO ANTIGO PELO NOVO COMPONENTE */}
              <BotaoAdicionar produto={produto} />

            </div>
          ))}
        </Slider>
      )}

      <button className="mercearia-ver-mais-button" onClick={() => navigate('/mercearia')}>
        Ver Mais
      </button>

      {/* O JSX DO MODAL FOI REMOVIDO */}
    </div>
  );
};

export default DestaqueMercearia;
