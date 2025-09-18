import React, { useEffect, useState } from 'react';
import { useCarrinho } from '../../context/CarrinhoContext'; // O contexto agora tem a função abrirModal
import supabase from '../../../supabaseClient';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './Cerveja.css';

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

const Cervejas = () => {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('CERVEJA');
  const [carregando, setCarregando] = useState(true);
  
  // A lógica do modal foi removida, o BotaoAdicionar usa o contexto diretamente.

  useEffect(() => {
    const fetchProdutos = async () => {
      const categoriasRelevantes = ['CERVEJA', 'FARDO-GELADO', 'FARDO-QUENTE'];
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .in('category', categoriasRelevantes);

      if (!error) setProdutos(data);
      setCarregando(false);
    };
    fetchProdutos();
  }, []);

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
      <header className="cerveja-header">
        <div className="cerveja-header-content">
          <h1>CERVEJAS</h1>
          <p>UMA SELEÇÃO ESPECIAL PARA TODOS OS GOSTOS</p>
        </div>
      </header>

      <main className="cerveja-main-content">
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Buscar por nome da cerveja..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="cerveja-search-input"
          />
        </div>
        
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

export default Cervejas;