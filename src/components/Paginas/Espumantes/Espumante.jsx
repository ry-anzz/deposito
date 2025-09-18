import React, { useState, useEffect } from 'react';
import { useCarrinho } from '../../context/CarrinhoContext';
import supabase from '../../../supabaseClient';
import './Espumante.css';

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


const Espumante = () => {
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
          .eq('category', 'ESPUMANTES');

        if (error) throw new Error(error.message);
        setProdutos(data || []);
      } catch (error) {
        console.error('Erro ao carregar os espumantes:', error);
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
    <div className="espumante-page-container">
      <header className="espumante-header">
        <div className="espumante-header-content">
          <h1>Espumantes</h1>
          <p>BRINDES QUE CELEBRAM GRANDES MOMENTOS</p>
        </div>
      </header>

      <main className="espumante-main-content">
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Buscar por nome do espumante..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="espumante-search-input"
          />
        </div>

        {carregando ? (
          <p>Carregando espumantes...</p>
        ) : produtosFiltrados.length > 0 ? (
          <div className="espumante-grid">
            {produtosFiltrados.map((produto) => (
              <div className="espumante-card" key={produto.id}>
                <div className="espumante-card-image-container">
                    <img src={produto.imagem_url} alt={produto.name} />
                </div>
                <div className="espumante-card-content">
                    <h3>{produto.name}</h3>
                    <p className="espumante-preco">
                      R${produto.price ? produto.price.toFixed(2) : 'Indisponível'}
                    </p>
                    {/* O botão antigo foi substituído pelo nosso componente inteligente */}
                    <BotaoAdicionar produto={produto} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="nenhum-produto">Nenhum espumante encontrado.</p>
        )}
      </main>

      {/* O JSX do modal foi completamente removido daqui */}
    </div>
  );
};

export default Espumante;