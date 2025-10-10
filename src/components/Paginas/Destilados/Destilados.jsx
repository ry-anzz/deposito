import React, { useEffect, useState } from 'react';
import { useCarrinho } from '../../context/CarrinhoContext';
import supabase from '../../../supabaseClient';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useSearchParams } from 'react-router-dom';
import 'swiper/css';
import './Destilados.css';

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

const Destilados = () => {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('DESTILADOS');
  const [carregando, setCarregando] = useState(true);
  
  const [searchParams] = useSearchParams();

  // CORREÇÃO 1: Lemos o valor do filtro fora do useEffect
  const filtroDaUrl = searchParams.get('filtro');

  const categoriasDestilados = ['DESTILADOS', 'LICOR', 'CACHAÇA', 'WHISKYS', 'ESPECIARIAS'];

  // CORREÇÃO 2: O useEffect agora "ouve" as mudanças no VALOR do filtro da URL
  useEffect(() => {
    if (filtroDaUrl && categoriasDestilados.includes(filtroDaUrl)) {
      setCategoriaFiltro(filtroDaUrl);
    } else {
      // Se não houver filtro na URL, volta para a categoria padrão
      setCategoriaFiltro('DESTILADOS');
    }
  }, [filtroDaUrl]); // A dependência agora é o valor, não o objeto

  useEffect(() => {
    const fetchProdutos = async () => {
      setCarregando(true);
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
                    <BotaoAdicionar produto={produto} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="nenhum-produto">Nenhum produto encontrado com os filtros atuais.</p>
        )}
      </main>
    </div>
  );
};

export default Destilados;