import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCarrinho } from '../context/CarrinhoContext';
// Não precisamos mais importar o 'Zap'
import './BotaoCarrinho.css';

const BotaoCarrinho = () => {
  const { carrinho } = useCarrinho();
  const quantidadeTotal = carrinho.reduce((total, produto) => total + produto.quantidade, 0);
  const location = useLocation();

  if (location.pathname === '/carrinho') {
    return null;
  }

  return (
    <Link to="/carrinho" className="floating-cart-button">
      {/* Ícone de Carrinho em SVG */}
      <svg
        className="cart-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      
      {quantidadeTotal > 0 && <span className="cart-counter">{quantidadeTotal}</span>}
      <span className="cart-tooltip">Ver Carrinho</span>
    </Link>
  );
};

export default BotaoCarrinho;