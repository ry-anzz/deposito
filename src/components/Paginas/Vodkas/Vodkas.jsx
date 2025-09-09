import React, { useState, useEffect } from 'react';
import { useCarrinho } from '../../context/CarrinhoContext';
import supabase from '../../../supabaseClient';
import './Vodkas.css';

const Vodkas = () => {
  const [vodkas, setVodkas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalProduto, setModalProduto] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [filtro, setFiltro] = useState('');
  const { adicionarAoCarrinho } = useCarrinho();

  useEffect(() => {
    const fetchVodkas = async () => {
      try {
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
          .eq('category', 'VODKAS'); // Filtra apenas vodkas

        if (error) throw new Error(error.message);

        const vodkasOrdenadas = data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setVodkas(data);
      } catch (error) {
        console.error('Erro ao carregar as vodkas:', error);
      } finally {
        setCarregando(false);
      }
    };

    fetchVodkas();
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
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const vodkasFiltradas = vodkas.filter((vodka) =>
    vodka.name.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="vodka-container">
      <div className="titulo-secao">
        <h1 className="h1vodka">VODKA / GIN </h1>
        <p className="pvodka">CLÁSSICAS E REFINADAS</p>
      </div>

      <h2 className="titulo-vodka">Todas as Vodkas</h2>

      <div className="filtro-container">
        <input
          type="text"
          placeholder="Filtrar vodkas..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {carregando ? (
        <p>Carregando vodkas...</p>
      ) : vodkasFiltradas.length > 0 ? (
        <div className="vodkas-lista">
          {vodkasFiltradas.map((vodka, index) => (
            <div className="vodka-card" key={index}>
              <img
                className="vodka-imagem"
                src={vodka.imagem_url}
                alt={vodka.name}
              />
              <h3 className="vodka-nome">{vodka.name}</h3>
              <p className="vodka-preco">
                Preço: R${vodka.price ? vodka.price.toFixed(2) : 'Indisponível'}
              </p>
              <button onClick={() => abrirModal(vodka)}>
                  Adicionar
                </button>
            </div>
          ))}
        </div>
      ) : (
        <p>Nenhuma vodka encontrada.</p>
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
    </div>
  );
};

export default Vodkas;
