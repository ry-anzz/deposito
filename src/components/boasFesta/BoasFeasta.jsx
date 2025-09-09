import React, { useState, useEffect } from 'react';
import { useCarrinho } from '../context/CarrinhoContext';
import supabase from '../../supabaseClient';
import './BoasFesta.css';

const BoasFeasta = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState('');
  const { adicionarAoCarrinho } = useCarrinho();

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
          .in('category', ['FARDO-GELADO', 'FARDO-QUENTE']); // Filtra produtos nas categorias

        if (error) throw new Error(error.message);

        // Ordena os produtos por categoria e por nome de forma alfabética
        const produtosOrdenados = data.sort((a, b) => {
          if (a.category === 'FARDO-GELADO' && b.category === 'FARDO-QUENTE') return -1;
          if (a.category === 'FARDO-QUENTE' && b.category === 'FARDO-GELADO') return 1;
          // Ordenação alfabética por nome
          return a.name.localeCompare(b.name);
        });

        setProdutos(produtosOrdenados);
      } catch (error) {
        console.error('Erro ao carregar os produtos:', error);
      } finally {
        setCarregando(false);
      }
    };

    fetchProdutos();
  }, []);

  // Filtra os produtos com base no filtro de pesquisa
  const produtosFiltrados = produtos.filter((produto) =>
    produto.name.toLowerCase().includes(filtro.toLowerCase())
  );

  // Separar produtos por categoria
  const produtosGelados = produtosFiltrados.filter(
    (produto) => produto.category === 'FARDO-GELADO'
  );
  const produtosQuentes = produtosFiltrados.filter(
    (produto) => produto.category === 'FARDO-QUENTE'
  );

  return (
    <div className="boas-festa-container">
      <div className="fundo-boas">

        {/* Campo de pesquisa */}
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

        {carregando ? (
          <p>Carregando produtos...</p>
        ) : (
          <>
            {/* Produtos Gelados */}
            {produtosGelados.length > 0 && (
              <>
                <h3 className="fardos">Fardo Gelado</h3>
                <div className="produtos-lista">
                  {produtosGelados.map((produto, index) => (
                    <div className="produto-card" key={index}>
                      <img
                        className="produto-imagem"
                        src={produto.imagem_url}
                        alt={produto.name}
                      />
                      <h3 className="produto-nome">{produto.name}</h3>
                      <p className="produto-preco">
                        Preço: R${produto.price ? produto.price.toFixed(2) : 'Indisponível'}
                      </p>
                      <button
                        className="produto-botao"
                        onClick={() => adicionarAoCarrinho(produto)}
                      >
                        Adicionar ao Carrinho
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Produtos Quentes */}
            {produtosQuentes.length > 0 && (
              <>
                <h3 className="fardos">Fardo Quente</h3>
                <div className="produtos-lista">
                  {produtosQuentes.map((produto, index) => (
                    <div className="produto-card" key={index}>
                      <img
                        className="produto-imagem"
                        src={produto.imagem_url}
                        alt={produto.name}
                      />
                      <h3 className="produto-nome">{produto.name}</h3>
                      <p className="produto-preco">
                        Preço: R${produto.price ? produto.price.toFixed(2) : 'Indisponível'}
                      </p>
                      <button
                        className="produto-botao"
                        onClick={() => adicionarAoCarrinho(produto)}
                      >
                        Adicionar ao Carrinho
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BoasFeasta;
