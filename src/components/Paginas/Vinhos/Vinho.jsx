import React, { useState, useEffect } from 'react';
import { useCarrinho } from '../../context/CarrinhoContext';
import supabase from '../../../supabaseClient';
import './Vinho.css';

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


const Vinho = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState('');
  
  // A lógica do modal foi removida, o BotaoAdicionar usa o contexto diretamente.

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
          .eq('category', 'VINHO');

        if (error) throw new Error(error.message);
        setProdutos(data || []);
      } catch (error) {
        console.error('Erro ao carregar os vinhos:', error);
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
    <div className="vinho-page-container">
      <header className="vinho-header">
        <div className="vinho-header-content">
          <h1>Vinhos</h1>
          <p>DEGUSTAÇÃO E HARMONIZAÇÃO PARA GRANDES MOMENTOS</p>
        </div>
      </header>

      <main className="vinho-main-content">
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Buscar por nome do vinho..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="vinho-search-input"
          />
        </div>

        {carregando ? (
          <p>Carregando vinhos...</p>
        ) : produtosFiltrados.length > 0 ? (
          <div className="vinho-grid">
            {produtosFiltrados.map((produto) => (
              <div className="vinho-card" key={produto.id}>
                <div className="vinho-card-image-container">
                    <img src={produto.imagem_url} alt={produto.name} />
                </div>
                <div className="vinho-card-content">
                    <h3>{produto.name}</h3>
                    <p className="vinho-preco">
                      R${produto.price ? produto.price.toFixed(2) : 'Indisponível'}
                    </p>
                    {/* O botão antigo foi substituído pelo nosso componente inteligente */}
                    <BotaoAdicionar produto={produto} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="nenhum-produto">Nenhum vinho encontrado.</p>
        )}
      </main>

      {/* O JSX do modal foi completamente removido daqui */}
    </div>
  );
};

export default Vinho;