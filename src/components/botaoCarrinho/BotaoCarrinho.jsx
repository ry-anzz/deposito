import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Adicionado useLocation
import { useCarrinho } from '../context/CarrinhoContext';
import Zap from '../../assets/zap.webp';
import './BotaoCarrinho.css';

const BotaoCarrinho = () => {
  const { carrinho } = useCarrinho();
  const quantidadeTotal = carrinho.reduce((total, produto) => total + produto.quantidade, 0);
  const location = useLocation(); // Obtém a localização atual

  // Ocultar o botão na rota '/carrinho'
  if (location.pathname === '/carrinho') {
    return null;
  }

  return (
    <div className="botao-carrinho">
      <Link to="/carrinho">
        <img src={Zap} alt="Carrinho" className="icone-carrinho" />
        {quantidadeTotal > 0 && <span className="contador">{quantidadeTotal}</span>}
        <span className="hover-text">Finalize sua compra</span>
      </Link>
    </div>
  );
};

export default BotaoCarrinho;
