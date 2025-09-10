import React, { useEffect, useState } from 'react';
import { useCarrinho } from '../../context/CarrinhoContext';
import supabase from '../../../supabaseClient';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './Destilados.css'; // Usaremos este novo CSS

const Destilados = () => {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('DESTILADOS');
  const [modalProduto, setModalProduto] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const { adicionarAoCarrinho } = useCarrinho();

  const categoriasDestilados = ['DESTILADOS', 'LICOR', 'CACHAÇA', 'WHISKYS', 'ESPECIARIAS'];

  useEffect(() => {
    const fetchProdutos = async () => {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .in('category', categoriasDestilados);

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

  const produtosFiltrados = produtos
    .filter((produto) => {
      const matchesName = produto.name.toLowerCase().includes(filtro.toLowerCase());
      const matchesCategoria = produto.category.toLowerCase() === categoriaFiltro.toLowerCase();
      return matchesName && matchesCategoria;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="destilados-page-container">
      {/* --- Banner do Topo --- */}
      <header className="destilados-header">
        <div className="destilados-header-content">
          <h1>Destilados</h1>
          <p>O BRINDE PERFEITO PARA TODAS AS OCASIÕES.</p>
        </div>
      </header>

      {/* --- Conteúdo Principal --- */}
      <main className="destilados-main-content">
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Buscar por whisky, cachaça, licor..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="destilados-search-input"
          />
        </div>
        
        <div className="category-filter-container">
          <Swiper
            spaceBetween={10}
            slidesPerView={'auto'}
            grabCursor={true}
          >
            {categoriasDestilados.map((categoria, index) => (
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
          <div className="destilados-grid">
            {produtosFiltrados.map((produto) => (
              <div className="destilados-card" key={produto.id}>
                <div className="destilados-card-image-container">
                    <img src={produto.imagem_url} alt={produto.name} />
                </div>
                <div className="destilados-card-content">
                    <h3>{produto.name}</h3>
                    <p className="destilados-preco">
                      R${produto.price ? produto.price.toFixed(2) : 'Indisponível'}
                    </p>
                    <button className="destilados-card-button" onClick={() => abrirModal(produto)}>
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

export default Destilados;