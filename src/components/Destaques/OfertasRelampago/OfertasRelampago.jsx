// src/components/Destaques/OfertasRelampago/OfertasRelampago.jsx - DADOS REAIS + OFERTAS SIMULADAS

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import supabase from "../../../supabaseClient";
import { useCountdown } from "../../../hooks/useCountdown";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./OfertasRelampago.css";

// --- O Componente CountdownTimer continua o mesmo ---
const CountdownTimer = ({ targetDate }) => {
  // ... (nenhuma mudança aqui, mantenha o código do contador como está)
  const [days, hours, minutes, seconds] = useCountdown(targetDate);
  if (days + hours + minutes + seconds <= 0) {
    return <div className="countdown-timer ended">OFERTA ENCERRADA</div>;
  }
  return (
    <div className="countdown-timer">
      <div className="time-block">
        <span>{String(days).padStart(2, "0")}</span>
        <small>DIAS</small>
      </div>
      <div className="time-separator">:</div>
      <div className="time-block">
        <span>{String(hours).padStart(2, "0")}</span>
        <small>HRS</small>
      </div>
      <div className="time-separator">:</div>
      <div className="time-block">
        <span>{String(minutes).padStart(2, "0")}</span>
        <small>MIN</small>
      </div>
      <div className="time-separator">:</div>
      <div className="time-block">
        <span>{String(seconds).padStart(2, "0")}</span>
        <small>SEG</small>
      </div>
    </div>
  );
};

const OfertaRelampago = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtoPrincipal, setProdutoPrincipal] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. A BUSCA FOI ALTERADA
        // Buscamos até 4 produtos que você já marcou como 'destaque' no Supabase
        const { data, error } = await supabase
          .from("produtos")
          .select("*")
          .eq("destaque", true)
          .limit(4);

        if (error) throw new Error(error.message);

        if (data) {
          // 2. SIMULAÇÃO DOS DADOS DA OFERTA (A MÁGICA ACONTECE AQUI)
          const agora = new Date();
          const ofertasSimuladas = data.map((produto, index) => {
            // Calcula um preço antigo fictício (ex: 30% mais caro)
            const precoAntigo = produto.price * 1.3;
            // Cria um tempo de término diferente para cada produto
            const fimDaOferta = new Date(
              agora.getTime() +
                ((index + 1) * 2 * 60 * 60 * 1000 + 15 * 60 * 1000)
            ); // 2h15m, 4h15m, etc.

            return {
              ...produto, // Mantém todos os dados originais do produto (id, name, price, imagem)

              // E adiciona os dados FALSOS da oferta que o componente precisa
              preco_antigo: parseFloat(precoAntigo.toFixed(2)),
              fim_oferta: fimDaOferta.toISOString(),
              estoque_oferta: 50 + index * 5, // Ex: 50, 55, 60...
              estoque_vendido: 15 + index * 7, // Ex: 15, 22, 29...
            };
          });

          setProdutos(ofertasSimuladas);
          if (ofertasSimuladas.length > 0) {
            setProdutoPrincipal(ofertasSimuladas[0]);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar produtos para ofertas:", error);
      } finally {
        setCarregando(false);
      }
    };

    fetchData();
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

  // As lógicas de carregamento e de não exibir se não houver produtos continuam
  if (carregando) {
    return (
      <div className="oferta-relampago-container">
        <div className="oferta-header">
          <h2 className="oferta-title">⚡ OFERTAS RELÂMPAGO</h2>
          <p>Procurando as melhores ofertas para você...</p>
        </div>
      </div>
    );
  }

  if (!produtos || produtos.length === 0) {
    return null;
  }

  return (
    <div className="oferta-relampago-container">
      <div className="oferta-header">
        <h2 className="oferta-title">⚡ OFERTAS RELÂMPAGO</h2>
        <p>Corra, as ofertas acabam em:</p>
        {produtoPrincipal && (
          <CountdownTimer targetDate={produtoPrincipal.fim_oferta} />
        )}
      </div>

      <Slider {...settings}>
        {produtos.map((produto) => {
          const percentualVendido =
            (produto.estoque_vendido / produto.estoque_oferta) * 100;
          const desconto = Math.round(
            ((produto.preco_antigo - produto.price) / produto.preco_antigo) *
              100
          );

          return (
            <div className="oferta-slide" key={produto.id}>
              <div className="oferta-card">
                {desconto > 0 && (
                  <div className="oferta-badge">-{desconto}%</div>
                )}
                {/* PONTO IMPORTANTE: Verifique o nome da sua coluna de imagem! */}
                <img
                  src={produto.imagem_url}
                  alt={produto.name}
                  className="oferta-imagem"
                />
                <h3 className="oferta-nome">{produto.name}</h3>
                <div className="oferta-precos">
                  {produto.preco_antigo && (
                    <span className="oferta-preco-antigo">
                      R${produto.preco_antigo?.toFixed(2)}
                    </span>
                  )}
                  <span className="oferta-preco-atual">
                    R${produto.price?.toFixed(2)}
                  </span>
                </div>
                <div className="oferta-estoque">
                  <div className="oferta-estoque-barra">
                    <div
                      className="oferta-estoque-progresso"
                      style={{ width: `${percentualVendido}%` }}
                    ></div>
                  </div>
                  <span>
                    {produto.estoque_vendido} de {produto.estoque_oferta}{" "}
                    vendidos
                  </span>
                </div>
                <button className="oferta-botao">Aproveitar</button>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default OfertaRelampago;
