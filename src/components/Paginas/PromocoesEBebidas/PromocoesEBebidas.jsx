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

  return (
    <div className="container-banner">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Buscar Promocoes..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{
            width: '50%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>

      <div className="swiper-container">
        <Swiper
          spaceBetween={0}
          grabCursor={true}
          breakpoints={{
            300: { slidesPerView: 3.5 },
            800: { slidesPerView: 4.5 },
            1000: { slidesPerView: 6.5 },
            1500: { slidesPerView: 15 },
          }}
        >
          {categoriasPromocoes.map((categoria, index) => (
            <SwiperSlide key={index}>
              <button
                className={`botons00 ${categoriaFiltro === categoria ? 'ativo' : ''}`}
                onClick={() => handleCategoriaFiltro(categoria)}
              >
                <p className='pbotao'>{categoria.replace('-', ' ')}</p>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {carregando ? (
        <p>Carregando produtos...</p>
      ) : produtosFiltrados.length > 0 ? (
        <div className="produtos-container">
          {produtosFiltrados.map((produto, index) => (
            <div className="produto-card" key={index}>
              <img className="produto-imagem" src={produto.imagem_url} alt={produto.name} />
              <div className="produto-info">
                <h3 className="nome-produto">{produto.name}</h3>
                <p>Preço: R${produto.price ? produto.price.toFixed(2) : 'Indisponível'}</p>
                <button onClick={() => abrirModal(produto)}>Adicionar</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Nenhum produto encontrado para essa categoria.</p>
      )}

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
                <input
                  type="number"
                  id="quantidade"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value, 10)))}
                />
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
