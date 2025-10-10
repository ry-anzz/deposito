import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import supabase from '../../../supabaseClient';
import { useCountdown } from '../../../hooks/useCountdown';
import { useCarrinho } from '../../context/CarrinhoContext'; // Importa o contexto do carrinho
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './OfertasRelampago.css';

// --- SUB-COMPONENTE PARA O BOTÃO INTELIGENTE (com estilo das ofertas) ---
const BotaoAdicionarOferta = ({ produto }) => {
  const { carrinho, adicionarAoCarrinho, diminuirQuantidade } = useCarrinho();
  const itemNoCarrinho = carrinho.find(item => item.id === produto.id);

  if (itemNoCarrinho) {
    return (
      <div className="quantity-control-oferta">
        <button onClick={() => diminuirQuantidade(produto.id)}>−</button>
        <span>{itemNoCarrinho.quantidade}</span>
        <button onClick={() => adicionarAoCarrinho(produto)}>+</button>
      </div>
    );
  }

  return (
    <button className="oferta-botao" onClick={() => adicionarAoCarrinho(produto)}>
      Aproveitar
    </button>
  );
};


// --- Componente do Contador (sem alterações) ---
const CountdownTimer = ({ targetDate }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);
  if (days + hours + minutes + seconds <= 0) {
    return <div className="countdown-timer ended">OFERTA ENCERRADA</div>;
  }
  return (
    <div className="countdown-timer">
      <div className='time-block'><span>{String(days).padStart(2, '0')}</span><small>DIAS</small></div>
      <div className='time-separator'>:</div>
      <div className='time-block'><span>{String(hours).padStart(2, '0')}</span><small>HRS</small></div>
      <div className='time-separator'>:</div>
      <div className='time-block'><span>{String(minutes).padStart(2, '0')}</span><small>MIN</small></div>
      <div className='time-separator'>:</div>
      <div className='time-block'><span>{String(seconds).padStart(2, '0')}</span><small>SEG</small></div>
    </div>
  );
};


const OfertaRelampago = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // --- LÓGICA DE BUSCA DE DADOS ATUALIZADA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // A busca continua a mesma: pega apenas as ofertas ativas
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
          .not('fim_oferta', 'is', null)
          .gt('fim_oferta', new Date().toISOString()) // Garante que a oferta não expirou
          .order('fim_oferta', { ascending: true });

        if (error) throw new Error(error.message);

        setProdutos(data || []);
      } catch (error) {
        console.error('Erro ao carregar ofertas relâmpago:', error);
      } finally {
        setCarregando(false);
      }
    };

    // 1. Executa a busca assim que a página carrega
    fetchData(); 

    // 2. CORREÇÃO: Cria um intervalo que re-executa a busca a cada 30 segundos
    const intervalId = setInterval(fetchData, 30000); 

    // 3. Limpa o intervalo quando o componente é desmontado para evitar problemas de memória
    return () => clearInterval(intervalId);
  }, []);

  const settings = {
    dots: true,
    infinite: produtos.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };
  
  // Se não houver produtos, não renderiza nada
  if (!produtos || produtos.length === 0) {
    return null; 
  }

  const proximaOfertaATerminar = produtos[0]?.fim_oferta;

  return (
    <div className="oferta-relampago-container">
      <div className="oferta-header">
        <h2 className="oferta-title">⚡ OFERTAS RELÂMPAGO</h2>
        <p>Corra, as ofertas acabam em:</p>
        {proximaOfertaATerminar && <CountdownTimer targetDate={proximaOfertaATerminar} />}
      </div>

      <Slider {...settings}>
        {produtos.map((produto) => {
          const percentualVendido = (produto.estoque_vendido / produto.estoque_oferta) * 100;
          const desconto = Math.round(((produto.preco_antigo - produto.price) / produto.preco_antigo) * 100);

          return (
            <div className="oferta-slide" key={produto.id}>
              <div className="oferta-card">
                {desconto > 0 && <div className="oferta-badge">-{desconto}%</div>}
                <img src={produto.imagem_url} alt={produto.name} className="oferta-imagem" />
                <h3 className="oferta-nome">{produto.name}</h3>
                <div className="oferta-precos">
                  {produto.preco_antigo && <span className="oferta-preco-antigo">R${produto.preco_antigo?.toFixed(2)}</span>}
                  <span className="oferta-preco-atual">R${produto.price?.toFixed(2)}</span>
                </div>
                <div className="oferta-estoque">
                  <div className="oferta-estoque-barra">
                    <div 
                      className="oferta-estoque-progresso" 
                      style={{ width: `${percentualVendido}%` }}
                    ></div>
                  </div>
                  <span>{produto.estoque_vendido} de {produto.estoque_oferta} vendidos</span>
                </div>
                {/* Usando o botão inteligente para adicionar ao carrinho */}
                <BotaoAdicionarOferta produto={produto} />
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default OfertaRelampago;