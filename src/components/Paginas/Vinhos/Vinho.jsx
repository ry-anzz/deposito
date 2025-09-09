import React, { useState, useEffect } from 'react';
import { useCarrinho } from '../../context/CarrinhoContext';
import supabase from '../../../supabaseClient';
import './Vinho.css';

const Vinho = () => {
  const [vinhos, setVinhos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalProduto, setModalProduto] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [filtro, setFiltro] = useState('');  // Estado para o filtro de pesquisa
  const { adicionarAoCarrinho } = useCarrinho();

  useEffect(() => {
    const fetchVinhos = async () => {
      try {
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
          .eq('category', 'VINHO'); // Filtra apenas vinhos

        if (error) throw new Error(error.message);
        setVinhos(data);
      } catch (error) {
        console.error('Erro ao carregar os vinhos:', error);
      } finally {
        setCarregando(false);
      }
    };

    fetchVinhos();
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

  // Filtra e ordena vinhos com base no nome
  const vinhosFiltrados = vinhos
    .filter(vinho => vinho.name.toLowerCase().includes(filtro.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name)); // Ordena alfabeticamente

  return (
    <div className="vinho-container">
      <div className='fundo001'>
        <div className='titulo-uva'>
          <h1 className='h1vinho'>VINHOS</h1>
          <p className='pvinho'>DEGUSTAÇÃO E HARMONIZAÇÃO</p>
        </div>

        <h2 className="titulo-vinho">Todos os Vinhos</h2>
        
        {/* Campo de pesquisa */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Filtrar vinhos..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)} // Atualiza o filtro
            style={{
              width: '50%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          />
        </div>

        {carregando ? (
          <p>Carregando vinhos...</p>
        ) : vinhosFiltrados.length > 0 ? (
          <div className="vinhos-lista">
            {vinhosFiltrados.map((vinho, index) => (
              <div className="vinho-card" key={index}>
                <img
                  className="vinho-imagem"
                  src={vinho.imagem_url}
                  alt={vinho.name}
                />
                <h3 className="vinho-nome">{vinho.name}</h3>
                <p className="vinho-preco">
                  Preço: R${vinho.price ? vinho.price.toFixed(2) : 'Indisponível'}
                </p>
                <button onClick={() => abrirModal(vinho)}>
                  Adicionar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhum vinho encontrado.</p>
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
  );
};

export default Vinho;
