import React, { useState, useEffect } from 'react';
import { useCarrinho } from '../../context/CarrinhoContext';
import supabase from '../../../supabaseClient';
import './KitsChurrasco.css'; // Usaremos este novo CSS

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

const KitsEPromocoes = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        // CORREÇÃO: Busca apenas os produtos da categoria 'KITSEPROMOCOES'
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
          .eq('category', 'KITSEPROMOCOES');

        if (error) throw new Error(error.message);
        setProdutos(data || []);
      } catch (error) {
        console.error('Erro ao carregar os kits e promoções:', error);
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
    <div className="kits-page-container">
      <header className="kits-header">
        <div className="kits-header-content">
          <h1>Kits de Churrasco & Promoções</h1>
          <p>TUDO PRONTO PARA A SUA GRELHA</p>
        </div>
      </header>

      <main className="kits-main-content">
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Buscar por nome do kit ou promoção..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="kits-search-input"
          />
        </div>

        {carregando ? (
          <p>A carregar as melhores ofertas...</p>
        ) : produtosFiltrados.length > 0 ? (
          <div className="kits-grid">
            {produtosFiltrados.map((produto) => (
              <div className="kit-card" key={produto.id}>
                <div className="kit-card-image-container">
                    <img src={produto.imagem_url} alt={produto.name} />
                </div>
                <div className="kit-card-content">
                    <h3>{produto.name}</h3>
                    <p className="kit-preco">
                      R${produto.price ? produto.price.toFixed(2) : 'Indisponível'}
                    </p>
                    <BotaoAdicionar produto={produto} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="nenhum-produto">Nenhum kit ou promoção encontrado no momento.</p>
        )}
      </main>
    </div>
  );
};

export default KitsEPromocoes;