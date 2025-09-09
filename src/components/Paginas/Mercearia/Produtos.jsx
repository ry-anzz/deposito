import React, { useState, useEffect } from 'react';
import { useCarrinho } from '../../context/CarrinhoContext';
import supabase from '../../../supabaseClient';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import './Produtos.css';
import Carrinho from '../../carrinho/Carrinho';

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalProduto, setModalProduto] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [filtro, setFiltro] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('MERCEARIA');
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
  const { carrinho, adicionarAoCarrinho } = useCarrinho();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('produtos').select('*');
        if (error) throw new Error(error.message);
        setProdutos(data);
      } catch (error) {
        console.error('Erro ao carregar os produtos:', error);
      } finally {
        setCarregando(false);
      }
    };

    fetchData();
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
    } else {
      alert("Quantidade inválida. Tente novamente.");
    }
  };

  const produtosFiltrados = produtos
    .filter((produto) => {
      const matchesName = produto.name.toLowerCase().includes(filtro.toLowerCase());
      const matchesCategoria = categoriaFiltro
        ? produto.category.toLowerCase() === categoriaFiltro.toLowerCase()
        : true;
      return matchesName && matchesCategoria;
    })
    .sort((a, b) => a.name.localeCompare(b.name)); // Apenas ordenação alfabética

  const categorias = produtosFiltrados.reduce((acc, produto) => {
    if (!acc[produto.category]) acc[produto.category] = [];
    acc[produto.category].push(produto);
    return acc;
  }, {});

  const handleCategoriaFiltro = (categoria) => {
    setCategoriaFiltro(categoria);
  };

  const handleAdicionarKit2 = () => {
    const kitBasico = {
      name: 'kit destilado',
      price: 99.00,
    };
    adicionarAoCarrinho(kitBasico);
  };

  const categoriasComRotulo = {
    'MERCEARIA': 'MERCEARIA',
    'REFRIGERANTES': 'REFRIGERANTES',
    'AGUA': 'ÁGUAS',
    'SUCOS': 'SUCOS',
    'PADARIA': 'PADARIA',
    'DOCES': 'DOCES',
    'DOCES E BISCOITOS': 'BISCOITOS DOCES',
    'BISCOITOS SALGADOS': 'BISCOITOS SALGADOS',
    'CONGELADOS': 'CONGELADOS',
    'FRIOS E LATICINIOS': 'FRIOS & LATICÍNIOS',
    'HIGIENE': 'HIGIENE',
    'LIMPEZA': 'LIMPEZA',
    'CIGARROS': 'CIGARROS'
  };

  return (
    <div className="container-banner">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Filtrar produtos..."
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

      <div className="teste">
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
          {Object.keys(categoriasComRotulo).map((categoria) => (
            <SwiperSlide key={categoria}>
              <button className='botons00' onClick={() => handleCategoriaFiltro(categoria)}>
                <p className='pbotao'>{categoriasComRotulo[categoria]}</p>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {carregando ? (
        <p>Carregando produtos...</p>
      ) : categoriaFiltro === 'KITS' ? (
        <div className='gelo'>
          <h2 className="categoria-titulo">Destilados</h2>
          <div className='kitdestilado'>
            <h1 className='h11'>kit destilado</h1>
            <div className="kit-cards">
              {dadocomplneto.map((item, index) => (
                <div className="kit-card2" key={index}>
                  <div className="kit-image-wrapper2">
                    <img className="kit-image2" src={item.imagem} alt={item.nome} />
                  </div>
                  <p className="kit-name2">{item.nome}</p>
                </div>
              ))}
            </div>
            <div className="chirrasco-kit-button01">
              <button onClick={handleAdicionarKit2}>Adicionar Kit destilado R$99,00</button>
            </div>
          </div>
        </div>
      ) : Object.keys(categorias).length > 0 ? (
        Object.keys(categorias).map((categoria) => (
          <div key={categoria} style={{ textAlign: 'center' }}>
            <h2 className="categoria-titulo">{categoriasComRotulo[categoria] || categoria}</h2>
            <div className="produtos-container">
              {categorias[categoria].map((produto, index) => (
                <div className="produto-card" key={index}>
                  <img className="produto-imagem" src={produto.imagem_url} alt={produto.name} />
                  <div className="produto-info">
                    <h3 className='nome-produto'>{produto.name}</h3>
                    <p>Preço: R${produto.price ? produto.price.toFixed(2) : 'Indisponível'}</p>
                    <button onClick={() => abrirModal(produto)}>
                      Adicionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>Nenhum produto encontrado.</p>
      )}

      {modalProduto && (
        <div className="modal">
          <div className="modal-content">
            <h2>Adicionar ao Carrinho</h2>
            <p>{modalProduto.name}</p>
            <p>Preço: R${modalProduto.price ? modalProduto.price.toFixed(2) : 'Indisponível'}</p>
            <div className="quantity-container">
              <label htmlFor="quantidade">Quantidade:</label>
              <div className="quantity-controls">
                <button
                  className="decrease-btn"
                  onClick={() => setQuantidade((prev) => Math.max(prev - 1, 1))}
                >
                  −
                </button>
                <input
                  type="number"
                  id="quantidade"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value, 10)))}
                  min="1"
                />
                <button
                  className="increase-btn"
                  onClick={() => setQuantidade((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>
            <div className="modal-buttons">
              <button onClick={confirmarAdicao}>Confirmar</button>
              <button onClick={fecharModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {mostrarCarrinho && <Carrinho />}
    </div>
  );
};

export default Produtos;
