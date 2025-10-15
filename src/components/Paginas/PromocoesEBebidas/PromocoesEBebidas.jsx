import React, { useState, useEffect } from 'react';
import { useCarrinho } from '../../context/CarrinhoContext';
import supabase from '../../../supabaseClient';
import './PromocoesEBebidas.css'; // O seu CSS será aplicado aqui

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


const PromocoesEBebidas = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState('');
  
  // O seu componente original chamava-se 'Promocoes', o nome do ficheiro e da rota é 'PromocoesEBebidas'.
  // Padronizei o nome do componente para corresponder ao ficheiro.

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setCarregando(true);
        // CORREÇÃO: A busca agora filtra diretamente no Supabase pela categoria correta.
        // ATENÇÃO: Verifique se o nome da categoria na sua tabela é exatamente 'PROMOCOESEBEBIDAS'.
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
          .eq('category', 'PROMOÇÕES E BEBIDAS');

        if (error) throw new Error(error.message);
        setProdutos(data || []);
      } catch (error) {
        console.error('Erro ao carregar as promoções:', error);
      } finally {
        setCarregando(false);
      }
    };

    fetchProdutos();
  }, []); // Este useEffect corre apenas uma vez

  // A lógica de filtragem foi simplificada, pois a categoria já foi filtrada pelo Supabase.
  const produtosFiltrados = produtos
    .filter(produto => produto.name.toLowerCase().includes(filtro.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="promocoes-page-container">
      <header className="promocoes-header">
        <div className="promocoes-header-content">
          <h1>Promoções & Bebidas</h1>
          <p>AS MELHORES OFERTAS, SELECIONADAS PARA VOCÊ</p>
        </div>
      </header>

      <main className="promocoes-main-content">
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Buscar por nome do produto..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="promocoes-search-input"
          />
        </div>

        {/* O Swiper de filtros de categoria foi removido, pois esta página só mostra uma categoria. */}

        {carregando ? (
          <p>A carregar as melhores ofertas...</p>
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
                    <BotaoAdicionar produto={produto} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="nenhum-produto">Nenhuma promoção encontrada no momento.</p>
        )}
      </main>
    </div>
  );
};

export default PromocoesEBebidas;