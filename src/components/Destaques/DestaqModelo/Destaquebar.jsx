import React, { useEffect, useState } from "react";
import { useCarrinho } from "../../context/CarrinhoContext";
import supabase from "../../../supabaseClient";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Destaquebar.css";
import { useNavigate } from "react-router-dom";

const Destaquebar = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalProduto, setModalProduto] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const { adicionarAoCarrinho } = useCarrinho();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("produtos")
          .select("*")
          .eq("category", "CERVEJA") // Filtra produtos da categoria 'CERVEJA'
          .eq("destaque", true); // Filtra produtos com destaque igual a true
        if (error) throw new Error(error.message);
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao carregar os produtos:", error);
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

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 4,
    slidesToScroll: 1,
    draggable: true,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="destaque-bar-container">
      <h1 className="texto-destaque">Destaques de Cerveja</h1>
      {carregando ? (
        <p>Carregando produtos...</p>
      ) : (
        <Slider {...settings}>
          {produtos.map((produto, index) => (
            <div className="destaque-produto-card" key={index}>
              <img
                className="destaque-produto-imagem"
                src={produto.imagem_url}
                alt={produto.name}
              />
              <h3>{produto.name}</h3>
              <p>
                Preço: R$
                {produto.price ? produto.price.toFixed(2) : "Indisponível"}
              </p>
              <button onClick={() => abrirModal(produto)}>Adicionar</button>
            </div>
          ))}
        </Slider>
      )}
      <button
        className="destaque-ver-mais-button"
        onClick={() => navigate("/mercearia")}
      >
        Ver Mais
      </button>

      {modalProduto && (
        <div className="modal">
          <div className="modal-content">
            <h2>Adicionar ao Carrinho</h2>
            <p>{modalProduto.name}</p>
            <p>
              Preço: R$
              {modalProduto.price
                ? modalProduto.price.toFixed(2)
                : "Indisponível"}
            </p>
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
                  onChange={(e) =>
                    setQuantidade(Math.max(1, parseInt(e.target.value, 10)))
                  }
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
    </div>
  );
};

export default Destaquebar;
