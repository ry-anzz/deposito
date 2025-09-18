import React, { useEffect, useState } from 'react';
import { useCarrinho } from '../../context/CarrinhoContext'; // O contexto agora tem a função abrirModal
import supabase from '../../../supabaseClient';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './Destilados.css';

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


const Destilados = () => {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('DESTILADOS');
  const [carregando, setCarregando] = useState(true);
  
  // A lógica do modal foi removida, o BotaoAdicionar usa o contexto diretamente.

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
      <header className="destilados-header">
        <div className="destilados-header-content">
          <h1>Destilados</h1>
          <p>O BRINDE PERFEITO PARA TODAS AS OCASIÕES.</p>
        </div>
      </header>

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
                    {/* O botão antigo foi substituído pelo nosso componente inteligente */}
                    <BotaoAdicionar produto={produto} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="nenhum-produto">Nenhum produto encontrado com os filtros atuais.</p>
        )}
      </main>

      {/* O JSX do modal foi completamente removido daqui */}
    </div>
  );
};

export default Destilados;