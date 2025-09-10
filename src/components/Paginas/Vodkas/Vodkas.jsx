import React, { useState, useEffect } from 'react';
import { useCarrinho } from '../../context/CarrinhoContext';
import supabase from '../../../supabaseClient';
import './Vodkas.css'; // Usaremos este novo CSS

const Vodkas = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalProduto, setModalProduto] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [filtro, setFiltro] = useState('');
  const { adicionarAoCarrinho } = useCarrinho();

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
          // ATENÇÃO: A categoria no seu menu é 'VODKAS/GIN', mas aqui a busca era por 'VODKAS'.
          // Para buscar ambos, você precisa garantir que eles tenham a mesma categoria no Supabase
          // ou buscar múltiplas categorias. Vamos buscar por 'VODKAS' por enquanto.
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

  const abrirModal = (produto) => {
    setModalProduto(produto);
    setQuantidade(1);
  };

  const fecharModal = () => {
    setModalProduto(null);
  };

  const confirmarAdicao = () => {
    if (quantidade > 0) {
      adicionarAoCarrinho(modalProduto, quantidade);
      fecharModal();
    }
  };

  const produtosFiltrados = produtos
    .filter(produto => produto.name.toLowerCase().includes(filtro.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="vodka-page-container">
      {/* --- Banner do Topo --- */}
      <header className="vodka-header">
        <div className="vodka-header-content">
          <h1>Vodka & Gin</h1>
          <p>A BASE PERFEITA PARA SEUS MELHORES DRINQUES</p>
        </div>
      </header>

      {/* --- Conteúdo Principal --- */}
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

        {/* Grade de Produtos */}
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
                    <button className="vodka-card-button" onClick={() => abrirModal(produto)}>
                      Adicionar
                    </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="nenhum-produto">Nenhum produto encontrado.</p>
        )}
      </main>

      {/* Modal */}
      {modalProduto && (
        <div className="modal">
          <div className="modal-content">
            <h2>Adicionar ao Carrinho</h2>
            <p>{modalProduto.name}</p>
            <p>Preço: R${modalProduto.price?.toFixed(2) ?? 'Indisponível'}</p>
            <div className="quantity-container">
              <label htmlFor="quantidade">Quantidade:</label>
              <div className="quantity-controls">
                <button onClick={() => setQuantidade((prev) => Math.max(prev - 1, 1))}>−</button>
                <input type="number" id="quantidade" value={quantidade} onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value, 10)))} />
                <button onClick={() => setQuantidade((prev) => prev + 1)}>+</button>
              </div>
            </div>
            <div className="modal-buttons">
              <button onClick={confirmarAdicao}>Confirmar</button>
              <button onClick={fecharModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vodkas;