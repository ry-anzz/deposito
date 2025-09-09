// Espumante.js
import React, { useState, useEffect } from 'react';
import { useCarrinho } from '../../context/CarrinhoContext';
import supabase from '../../../supabaseClient';
import './Espumante.css';  // Apliquei o estilo restrito no arquivo CSS

const Espumante = () => {
  const [espumantes, setEspumantes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalProduto, setModalProduto] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [filtro, setFiltro] = useState('');
  const { adicionarAoCarrinho } = useCarrinho();

  useEffect(() => {
    const fetchEspumantes = async () => {
      try {
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
          .eq('category', 'ESPUMANTES'); // Filtra apenas espumantes

        if (error) throw new Error(error.message);
        setEspumantes(data);
      } catch (error) {
        console.error('Erro ao carregar os espumantes:', error);
      } finally {
        setCarregando(false);
      }
    };

    fetchEspumantes();
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

  const espumantesFiltrados = espumantes.filter(espumante =>
    espumante.name.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="espumante">
      <div className="espumante-container">
        <div className="fundo01">
          <div className="titulo-espumante">
            <h1 className="h1espumante">ESPUMANTES</h1>
            <p className="pespumante">BRINDES QUE CELEBRAM MOMENTOS</p>
          </div>

          <h2 className="titulo-espumanteS">Todos os Espumantes</h2>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Filtrar espumantes..."
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

          {carregando ? (
            <p>Carregando espumantes...</p>
          ) : espumantesFiltrados.length > 0 ? (
            <div className="espumantes-lista">
              {espumantesFiltrados.map((espumante, index) => (
                <div className="espumante-card" key={index}>
                  <img
                    className="espumante-imagem"
                    src={espumante.imagem_url}
                    alt={espumante.name}
                  />
                  <h3 className="espumante-nome">{espumante.name}</h3>
                  <p className="espumante-preco">
                    Preço: R${espumante.price ? espumante.price.toFixed(2) : 'Indisponível'}
                  </p>
                  <button onClick={() => abrirModal(espumante)}>
                  Adicionar
                </button>
                </div>
              ))}
            </div>
          ) : (
            <p>Nenhum espumante encontrado.</p>
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
      </div>
    </div>
  );
};

export default Espumante;
