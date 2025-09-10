import React, { useEffect, useState } from 'react';
import { useCarrinho } from '../../context/CarrinhoContext';
import supabase from '../../../supabaseClient';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './Cerveja.css'; // Usaremos este CSS atualizado

const Cervejas = () => {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('CERVEJA');
  const [modalProduto, setModalProduto] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const { adicionarAoCarrinho } = useCarrinho();

  useEffect(() => {
    const fetchProdutos = async () => {
      // Busca todas as categorias de cerveja de uma vez
      const categoriasRelevantes = ['CERVEJA', 'FARDO-GELADO', 'FARDO-QUENTE'];
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .in('category', categoriasRelevantes); // Usa .in() para buscar todas as categorias

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

  const categoriasCervejas = ['CERVEJA', 'FARDO-GELADO', 'FARDO-QUENTE'];

  const produtosFiltrados = produtos
    .filter((produto) => {
      const matchesName = produto.name.toLowerCase().includes(filtro.toLowerCase());
      const matchesCategoria = produto.category.toLowerCase() === categoriaFiltro.toLowerCase();
      return matchesName && matchesCategoria;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="cerveja-page-container">
      {/* --- Banner do Topo --- */}
      <header className="cerveja-header">
        <div className="cerveja-header-content">
          <h1>CERVEJAS</h1>
          <p>UMA SELEÇÃO ESPECIAL PARA TODOS OS GOSTOS</p>
        </div>
      </header>

      {/* --- Conteúdo Principal --- */}
      <main className="cerveja-main-content">
        
        
        {/* Barra de Busca */}
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Buscar por nome da cerveja..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="cerveja-search-input"
          />
        </div>
        
        {/* Filtros de Categoria em Slider */}
        <div className="category-filter-container">
          <Swiper
            spaceBetween={10}
            slidesPerView={'auto'}
            grabCursor={true}
          >
            {categoriasCervejas.map((categoria, index) => (
              <SwiperSlide className="category-slide" key={index}>
                <button
                  className={`category-button ${categoriaFiltro === categoria ? 'active' : ''}`}
                  onClick={() => handleCategoriaFiltro(categoria)}
                >
                  {categoria.replace('-', ' ')}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Grade de Produtos */}
        {carregando ? (
          <p>Carregando produtos...</p>
        ) : produtosFiltrados.length > 0 ? (
          <div className="cerveja-grid">
            {produtosFiltrados.map((produto) => (
              <div className="cerveja-card" key={produto.id}>
                <div className="cerveja-card-image-container">
                    <img src={produto.imagem_url} alt={produto.name} />
                </div>
                <div className="cerveja-card-content">
                    <h3>{produto.name}</h3>
                    <p className="cerveja-preco">
                      R${produto.price ? produto.price.toFixed(2) : 'Indisponível'}
                    </p>
                    <button className="cerveja-card-button" onClick={() => abrirModal(produto)}>
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

      {/* Modal (continua o mesmo) */}
      {modalProduto && (
        <div className="modal">
          <div className="modal-content">
            <h2>Adicionar ao Carrinho</h2>
            {/* ... conteúdo do modal ... */}
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

export default Cervejas;