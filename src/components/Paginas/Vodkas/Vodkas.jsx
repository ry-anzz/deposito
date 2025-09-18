import React, { useState, useEffect } from 'react';
import { useCarrinho } from '../../context/CarrinhoContext';
import supabase from '../../../supabaseClient';
import './Vodkas.css';

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


const Vodkas = () => {
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
          // ATENÇÃO: Para buscar Vodka e Gin, você pode usar o filtro .in()
          // .in('category', ['VODKAS', 'GIN']);
          // Por agora, vamos manter a busca original por 'VODKAS'
          .eq('category', 'VODKAS');

        if (error) throw new Error(error.message);
        setProdutos(data || []);
      } catch (error) {
        console.error('Erro ao carregar os produtos:', error);
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
    <div className="vodka-page-container">
      <header className="vodka-header">
        <div className="vodka-header-content">
          <h1>Vodka & Gin</h1>
          <p>A BASE PERFEITA PARA SEUS MELHORES DRINQUES</p>
        </div>
      </header>

      <main className="vodka-main-content">
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Buscar por nome da vodka ou gin..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="vodka-search-input"
          />
        </div>

        {carregando ? (
          <p>Carregando produtos...</p>
        ) : produtosFiltrados.length > 0 ? (
          <div className="vodka-grid">
            {produtosFiltrados.map((produto) => (
              <div className="vodka-card" key={produto.id}>
                <div className="vodka-card-image-container">
                    <img src={produto.imagem_url} alt={produto.name} />
                </div>
                <div className="vodka-card-content">
                    <h3>{produto.name}</h3>
                    <p className="vodka-preco">
                      R${produto.price ? produto.price.toFixed(2) : 'Indisponível'}
                    </p>
                    {/* O botão antigo foi substituído pelo nosso componente inteligente */}
                    <BotaoAdicionar produto={produto} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="nenhum-produto">Nenhum produto encontrado.</p>
        )}
      </main>

      {/* O JSX do modal foi completamente removido daqui */}
    </div>
  );
};

export default Vodkas;