import React, { useState, useEffect } from 'react';
import { useCarrinho } from '../../context/CarrinhoContext';
import supabase from '../../../supabaseClient';
import './KitsEPromocoes.css';

// --- SUB-COMPONENTE PARA O BOTÃO INTELIGENTE ---
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


const KitsEPromocoes = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState('');
  
  // A lógica do modal foi removida

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
          .eq('category', 'KITSEPROMOCOES');

        if (error) throw new Error(error.message);
        setProdutos(data || []);
      } catch (error) {
        console.error('Erro ao carregar as promoções:', error);
      } finally {
        setCarregando(false);
      }
    };

    fetchProdutos();
  }, []);

  // Funções do modal (abrirModal, fecharModal, etc.) foram removidas

  const produtosFiltrados = produtos
    .filter(produto => produto.name.toLowerCase().includes(filtro.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="promocoes-page-container">
      <header className="promocoes-header">
        <div className="promocoes-header-content">
          <h1>Promoções</h1>
          <p>AS MELHORES OFERTAS PARA MOMENTOS ESPECIAIS</p>
        </div>
      </header>

      <main className="promocoes-main-content">
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Buscar por nome do produto em promoção..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="promocoes-search-input"
          />
        </div>

        {carregando ? (
          <p>Carregando promoções...</p>
        ) : produtosFiltrados.length > 0 ? (
          <div className="promocoes-grid">
            {produtosFiltrados.map((produto) => (
              <div className="promocao-card" key={produto.id}>
                <div className="promocao-card-image-container">
                    <img src={produto.imagem_url} alt={produto.name} />
                </div>
                <div className="promocao-card-content">
                    <h3>{produto.name}</h3>
                    <p className="promocao-preco">
                      R${produto.price ? produto.price.toFixed(2) : 'Indisponível'}
                    </p>
                    {/* O botão antigo foi substituído pelo nosso componente inteligente */}
                    <BotaoAdicionar produto={produto} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="nenhum-produto">Nenhuma promoção encontrada no momento.</p>
        )}
      </main>

      {/* O JSX do modal foi completamente removido daqui */}
    </div>
  );
};

export default KitsEPromocoes;