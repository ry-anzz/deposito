import React, { useEffect, useState } from "react";
import { useCarrinho } from "../../context/CarrinhoContext";
import supabase from "../../../supabaseClient";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSearchParams } from "react-router-dom";
import "swiper/css";
import "./Destilados.css";

// --- SUB-COMPONENTE PARA O BOTÃO INTELIGENTE ---
const BotaoAdicionar = ({ produto }) => {
  const { carrinho, adicionarAoCarrinho, diminuirQuantidade } = useCarrinho();
  const itemNoCarrinho = carrinho.find((item) => item.id === produto.id);

  if (itemNoCarrinho) {
    return (
      <div className="quantity-control-card">
               {" "}
        <button onClick={() => diminuirQuantidade(produto.id)}>−</button>       {" "}
        <span>{itemNoCarrinho.quantidade}</span>       {" "}
        <button onClick={() => adicionarAoCarrinho(produto)}>+</button>     {" "}
      </div>
    );
  }

  return (
    <button
      className="add-to-cart-btn"
      onClick={() => adicionarAoCarrinho(produto)}
    >
            Adicionar    {" "}
    </button>
  );
};

const Destilados = () => {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState("");
  // O filtro padrão é o nome da categoria na base de dados
  const [categoriaFiltro, setCategoriaFiltro] = useState("DESTILADOS");
  const [carregando, setCarregando] = useState(true);
  const [searchParams] = useSearchParams();
  const filtroDaUrl = searchParams.get("filtro");

  // CORREÇÃO: Este é o "dicionário" que mapeia os nomes da BD
  // para os nomes que o utilizador vê.

   const categoriasParaExibir = {
    'DESTILADOS': 'ALCOÓLICOS', // Nome na BD: 'DESTILADOS', Rótulo: 'ALCOÓLICOS'
    'WHISKYS': 'WHISKYS',
    'CACHAÇA': 'CACHAÇA',
    'LICOR': 'LICOR'
  };


  // Esta é a lista de categorias que vamos buscar ao Supabase
  const categoriasRelevantes = Object.keys(categoriasParaExibir); // ['DESTILADOS', 'LICOR', 'CACHAÇA', 'WHISKYS']

  useEffect(() => {
    if (filtroDaUrl && categoriasRelevantes.includes(filtroDaUrl)) {
      setCategoriaFiltro(filtroDaUrl);
    } else {
      // Se o filtro da URL for inválido (ou vazio), define o padrão.
      setCategoriaFiltro("DESTILADOS");
    }
  }, [filtroDaUrl]); // Ouve as mudanças no filtro da URL

  useEffect(() => {
    const fetchProdutos = async () => {
      setCarregando(true);
      // Busca apenas as categorias relevantes
      const { data, error } = await supabase
        .from("produtos")
        .select("*")
        .in("category", categoriasRelevantes);

      if (!error) setProdutos(data);
      setCarregando(false);
    };
    fetchProdutos();
  }, []); // Busca os produtos apenas uma vez

  const handleCategoriaFiltro = (categoria) => {
    setCategoriaFiltro(categoria);
  };

  const produtosFiltrados = produtos
    .filter((produto) => {
      const matchesName = produto.name
        .toLowerCase()
        .includes(filtro.toLowerCase());
      const matchesCategoria =
        produto.category.toLowerCase() === categoriaFiltro.toLowerCase();
      return matchesName && matchesCategoria;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="destilados-page-container">
           {" "}
      <header className="destilados-header">
               {" "}
        <div className="destilados-header-content">
                    <h1>Alcoólicos</h1>         {" "}
          <p>O BRINDE PERFEITO PARA TODAS AS OCASIÕES.</p>       {" "}
        </div>
             {" "}
      </header>
           {" "}
      <main className="destilados-main-content">
               {" "}
        <div className="search-bar-container">
                   {" "}
          <input
            type="text"
            placeholder="Buscar por whisky, cachaça, licor..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="destilados-search-input"
          />
                 {" "}
        </div>
               {/* ESTE É O BLOCO DE CÓDIGO CORRIGIDO */}       {" "}
        <div className="category-filter-container">
                   {" "}
          <Swiper spaceBetween={10} slidesPerView={"auto"} grabCursor={true}>
            {/* O map agora usa o "dicionário" categoriasParaExibir */}         
             {" "}
            {Object.entries(categoriasParaExibir).map(([key, label]) => (
              <SwiperSlide className="category-slide" key={key}>
                               {" "}
                <button
                  // Compara com a 'key' (nome da BD)
                  className={`category-button ${
                    categoriaFiltro === key ? "active" : ""
                  }`}
                  // Define o filtro para a 'key' (nome da BD)
                  onClick={() => handleCategoriaFiltro(key)}
                >
                  {/* Mostra o 'label' (nome bonito) */}                 {" "}
                  {label}               {" "}
                </button>
                             {" "}
              </SwiperSlide>
            ))}
                     {" "}
          </Swiper>
                 {" "}
        </div>
               {" "}
        {carregando ? (
          <p>Carregando produtos...</p>
        ) : produtosFiltrados.length > 0 ? (
          <div className="destilados-grid">
                       {" "}
            {produtosFiltrados.map((produto) => (
              <div className="destilados-card" key={produto.id}>
                               {" "}
                <div className="destilados-card-image-container">
                                     {" "}
                  <img src={produto.imagem_url} alt={produto.name} />           
                     {" "}
                </div>
                               {" "}
                <div className="destilados-card-content">
                                      <h3>{produto.name}</h3>                   {" "}
                  <p className="destilados-preco">
                                          R$
                    {produto.price ? produto.price.toFixed(2) : "Indisponível"} 
                                     {" "}
                  </p>
                                      <BotaoAdicionar produto={produto} />     
                           {" "}
                </div>
                             {" "}
              </div>
            ))}
                     {" "}
          </div>
        ) : (
          <p className="nenhum-produto">
            Nenhum produto encontrado com os filtros atuais.
          </p>
        )}
             {" "}
      </main>
         {" "}
    </div>
  );
};

export default Destilados;
