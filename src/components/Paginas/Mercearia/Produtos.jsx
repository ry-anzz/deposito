import React, { useState, useEffect } from 'react';
import { useCarrinho } from '../../context/CarrinhoContext';
import supabase from '../../../supabaseClient';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useSearchParams } from 'react-router-dom'; // 1. Importa o hook necessário
import 'swiper/css';
import './Produtos.css';

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

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('MERCEARIA');
  
  // 2. Usa o hook para ler os parâmetros da URL
  const [searchParams] = useSearchParams();

  const categoriasComRotulo = {
    'MERCEARIA': 'MERCEARIA', 'REFRIGERANTES': 'REFRIGERANTES', 'AGUA': 'ÁGUAS',
    'SUCOS': 'SUCOS', 'PADARIA': 'PADARIA', 'DOCES': 'DOCES', 'DOCES E BISCOITOS': 'BISCOITOS DOCES',
    'BISCOITOS SALGADOS': 'BISCOITOS SALGADOS', 'CONGELADOS': 'CONGELADOS',
    'FRIOS E LATICINIOS': 'FRIOS & LATICÍNIOS', 'HIGIENE': 'HIGIENE',
    'LIMPEZA': 'LIMPEZA', 'CIGARROS': 'CIGARROS'
  };

  const categoriasRelevantes = Object.keys(categoriasComRotulo);

  // 3. Este useEffect corre UMA VEZ para ler o filtro da URL
  useEffect(() => {
    const filtroDaUrl = searchParams.get('filtro'); // Procura por '?filtro=...'
    // A categoria na URL vem como 'limpeza', então convertemos para maiúsculas
    const filtroFormatado = filtroDaUrl ? filtroDaUrl.toUpperCase() : null; 
    
    if (filtroFormatado && categoriasRelevantes.includes(filtroFormatado)) {
      // Se encontrou um filtro válido, define-o como o filtro ativo
      setCategoriaFiltro(filtroFormatado);
    }
  }, []); // O array vazio [] garante que isto só corre uma vez

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
          .in('category', categoriasRelevantes);

        if (error) throw new Error(error.message);
        setProdutos(data || []);
      } catch (error) {
        console.error('Erro ao carregar os produtos:', error);
      } finally {
        setCarregando(false);
      }
    };
    fetchData();
  }, []);
  
  const handleCategoriaFiltro = (categoria) => {
    setCategoriaFiltro(categoria);
  };

  const produtosFiltrados = produtos
    .filter((produto) => {
      const matchesName = produto.name.toLowerCase().includes(filtro.toLowerCase());
      const matchesCategoria = produto.category.toUpperCase() === categoriaFiltro;
      return matchesName && matchesCategoria;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="mercearia-page-container">
      <header className="mercearia-header">
        <div className="mercearia-header-content">
          <h1>Mercearia</h1>
          <p>TUDO QUE VOCÊ PRECISA, COM A QUALIDADE DE SEMPRE</p>
        </div>
      </header>

      <main className="mercearia-main-content">
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Buscar por nome do produto..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="mercearia-search-input"
          />
        </div>
        
        <div className="category-filter-container">
          <Swiper spaceBetween={10} slidesPerView={'auto'} grabCursor={true}>
            {Object.entries(categoriasComRotulo).map(([key, label]) => (
              <SwiperSlide className="category-slide" key={key}>
                <button
                  className={`category-button ${categoriaFiltro === key ? 'active' : ''}`}
                  onClick={() => handleCategoriaFiltro(key)}
                >
                  {label}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        {carregando ? (
          <p>Carregando produtos...</p>
        ) : produtosFiltrados.length > 0 ? (
          <div className="mercearia-grid">
            {produtosFiltrados.map((produto) => (
              <div className="mercearia-card" key={produto.id}>
                <div className="mercearia-card-image-container">
                    <img src={produto.imagem_url} alt={produto.name} />
                </div>
                <div className="mercearia-card-content">
                    <h3>{produto.name}</h3>
                    <p className="mercearia-preco">
                      R${produto.price ? produto.price.toFixed(2) : 'Indisponível'}
                    </p>
                    <BotaoAdicionar produto={produto} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="nenhum-produto">Nenhum produto encontrado nesta categoria.</p>
        )}
      </main>
    </div>
  );
};

export default Produtos;