import React, { useEffect, useState } from 'react';
import { useCarrinho } from '../../context/CarrinhoContext';
import supabase from '../../../supabaseClient';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './PromocoesEBebidas.css'; // se precisar de estilos específicos

const Promocoes = () => {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('PROMOÇÕES E BEBIDAS');
  const [modalProduto, setModalProduto] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const { adicionarAoCarrinho } = useCarrinho();

  useEffect(() => {
    const fetchProdutos = async () => {
      const { data, error } = await supabase.from('produtos').select('*');
      if (!error) setProdutos(data);
      setCarregando(false);
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

  const handleCategoriaFiltro = (categoria) => {
    setCategoriaFiltro(categoria);
  };

  const categoriasPromocoes = [
    'PROMOÇÕES E BEBIDAS'
  ];

  const produtosFiltrados = produtos
    .filter((produto) => {
      const matchesName = produto.name.toLowerCase().includes(filtro.toLowerCase());
      const matchesCategoria = categoriaFiltro
        ? produto.category.toLowerCase() === categoriaFiltro.toLowerCase()
        : true;
      return matchesName && matchesCategoria;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  // No seu arquivo Promocoes.js, substitua apenas o return

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

      

      {carregando ? (
        <p>Carregando produtos...</p>
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
                  <button className="promocao-card-button" onClick={() => abrirModal(produto)}>
                    Adicionar
                  </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="nenhum-produto">Nenhum produto encontrado com os filtros atuais.</p>
      )}
    </main>

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

export default Promocoes;
