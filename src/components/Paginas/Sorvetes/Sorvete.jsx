import React, { useState, useEffect } from 'react';
import { useCarrinho } from '../../context/CarrinhoContext';
import supabase from '../../../supabaseClient';
import './Sorvete.css'; // Usaremos este novo CSS

// --- SUB-COMPONENTE PARA O BOTÃO INTELIGENTE ---
const BotaoAdicionar = ({ produto }) => {
  const { carrinho, adicionarAoCarrinho, diminuirQuantidade } = useCarrinho();
  const itemNoCarrinho = carrinho.find(item => item.id === produto.id);

  if (itemNoCarrinho) {
    return (
      <div className="quantity-control-card">
        <button onClick={() => diminuirQuantidade(produto.id)}>−</button>
        <span>{itemNoCarrinho.quantidade}</span>
        <button onClick={() => adicionarAoCarrinho(produto)}>+</button>
      </div>
    );
  }

  return (
    <button className="add-to-cart-btn" onClick={() => adicionarAoCarrinho(produto)}>
      Adicionar
    </button>
  );
};

const Sorvetes = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
          .eq('category', 'SORVETES'); // Busca apenas produtos da categoria 'SORVETES'

        if (error) throw new Error(error.message);
        setProdutos(data || []);
      } catch (error) {
        console.error('Erro ao carregar os sorvetes:', error);
      } finally {
        setCarregando(false);
      }
    };

    fetchProdutos();
  }, []);

  const produtosFiltrados = produtos
    .filter(produto => produto.name.toLowerCase().includes(filtro.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="sorvete-page-container">
      {/* --- Banner do Topo --- */}
      <header className="sorvete-header">
        <div className="sorvete-header-content">
          <h1>Sorvetes</h1>
          <p>SABORES CREMOSOS PARA REFRESCAR SEU DIA</p>
        </div>
      </header>

      {/* --- Conteúdo Principal --- */}
      <main className="sorvete-main-content">
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Buscar por nome do sorvete..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="sorvete-search-input"
          />
        </div>

        {carregando ? (
          <p>Carregando produtos...</p>
        ) : produtosFiltrados.length > 0 ? (
          <div className="sorvete-grid">
            {produtosFiltrados.map((produto) => (
              <div className="sorvete-card" key={produto.id}>
                <div className="sorvete-card-image-container">
                    <img src={produto.imagem_url} alt={produto.name} />
                </div>
                <div className="sorvete-card-content">
                    <h3>{produto.name}</h3>
                    <p className="sorvete-preco">
                      R${produto.price ? produto.price.toFixed(2) : 'Indisponível'}
                    </p>
                    <BotaoAdicionar produto={produto} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="nenhum-produto">Nenhum sorvete encontrado.</p>
        )}
      </main>
    </div>
  );
};

export default Sorvetes;