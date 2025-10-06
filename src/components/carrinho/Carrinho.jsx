import React, { useState, useEffect } from "react";
import { useCarrinho } from "../context/CarrinhoContext";
import supabase from "../../supabaseClient";
import { db } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import "./Carrinho.css";

const Carrinho = () => {
  const {
    carrinho,
    adicionarAoCarrinho,
    diminuirQuantidade,
    removerDoCarrinho,
  } = useCarrinho();

  const [sugestoes, setSugestoes] = useState([]);

  // --- FORM STATES ---
  const [nome, setNome] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [referencia, setReferencia] = useState("");
  const [modoPagamento, setModoPagamento] = useState("");
  const [troco, setTroco] = useState("");
  const [localSelecionado, setLocalSelecionado] = useState("");
  const [valorEntrega, setValorEntrega] = useState(0);

  // --- CUPOM STATES ---
  const [cupom, setCupom] = useState("");
  const [desconto, setDesconto] = useState(0); // porcentagem
  const [mensagemCupom, setMensagemCupom] = useState("");
  const [freteGratisAtivo, setFreteGratisAtivo] = useState(false);

  const locais = [
    { nome: "Selecione o Bairro", valor: 0 },
    { nome: "Novo Cavaleiros", valor: 6 },
    { nome: "Cavaleiros", valor: 10 },
    { nome: "Granja dos Cavaleiros", valor: 10 },
    { nome: "São Marcos", valor: 10 },
    { nome: "Vale dos Cristais", valor: 10 },
    { nome: "Vale das Palmeiras", valor: 10 },
    { nome: "Praia do Pecado", valor: 10 },
    { nome: "Bairro da Glória", valor: 10 },
    { nome: "Mirante da lagoa", valor: 10 },
    { nome: "Imboassica", valor: 10 },
    { nome: "Guanabara", valor: 10 },
    { nome: "Costa do sol", valor: 10 },
    { nome: "Vale encantado", valor: 10 },
    { nome: "Riviera", valor: 10 },
    { nome: "Praia Campista", valor: 10 },
    { nome: "Outro local (a combinar)", valor: 0 },
  ];

  useEffect(() => {
    const fetchSugestoes = async () => {
      const categoriasSugeridas = ["MERCEARIA", "GELO", "REFRIGERANTES", "DOCES"];
      const { data, error } = await supabase
        .from("produtos")
        .select("*")
        .in("category", categoriasSugeridas)
        .limit(4);
      if (!error) setSugestoes(data);
    };
    fetchSugestoes();
  }, []);

  const calcularSubtotal = () =>
    carrinho.reduce((total, produto) => total + produto.price * produto.quantidade, 0);

  // Total com desconto
  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    const descontoAplicado = subtotal * (desconto / 100);
    return subtotal - descontoAplicado + valorEntrega;
  };

  const handleLocalChange = (e) => {
    const nomeLocal = e.target.value;
    const local = locais.find((l) => l.nome === nomeLocal);
    setLocalSelecionado(nomeLocal);

    // Se frete grátis estiver ativo, mantemos 0 independente do bairro
    if (freteGratisAtivo) {
      setValorEntrega(0);
    } else {
      setValorEntrega(local ? local.valor : 0);
    }
  };

  // --- VALIDAR CUPOM ---
  const aplicarCupom = async () => {
    if (!cupom.trim()) {
      setMensagemCupom("Digite um cupom válido.");
      return;
    }

    const cupomDigitado = cupom.trim().toUpperCase();

    // Consulta o banco para verificar se o cupom existe
    const { data, error } = await supabase
      .from("cupom")
      .select("nome, valor")
      .ilike("nome", cupom.trim()); // busca case-insensitive

    if (error) {
      console.error(error);
      setMensagemCupom("Erro ao verificar cupom. Tente novamente.");
      return;
    }

    if (!data || data.length === 0) {
      // Cupom não existe
      setMensagemCupom("❌ Cupom inválido ou expirado.");
      setDesconto(0);
      setFreteGratisAtivo(false);
      // restaura o frete ao valor do bairro atual
      const localAtual = locais.find((l) => l.nome === localSelecionado);
      setValorEntrega(localAtual ? localAtual.valor : 0);
      return;
    }

    // Se for FRETEGRATIS (apenas verifica o nome digitado), ativa frete grátis
    if (cupomDigitado === "FRETEGRATIS") {
      setFreteGratisAtivo(true);
      setDesconto(0);
      setValorEntrega(0);
      setMensagemCupom("🚚 Frete grátis aplicado!");
      return;
    }

    // Caso contrário, aplica desconto percentual vindo do BD
    const valorCupom = Number(data[0].valor) || 0;
    setFreteGratisAtivo(false);
    setDesconto(valorCupom);
    // garante que o valor do frete esteja de acordo com o bairro (se houver)
    const localAtual = locais.find((l) => l.nome === localSelecionado);
    setValorEntrega(localAtual ? localAtual.valor : 0);
    setMensagemCupom(`✅ Cupom aplicado! Desconto de ${valorCupom}%`);
  };

  // --- ENVIAR PEDIDO ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    const idPedido = Math.floor(Math.random() * 10000).toString().padStart(4, "0");

    try {
      // montar info do cupom para salvar
      let cupomInfo = null;
      if (desconto > 0) cupomInfo = { nome: cupom, desconto, tipo: "desconto" };
      else if (freteGratisAtivo) cupomInfo = { nome: cupom, tipo: "frete" };

      const pedido = {
        idPedido,
        cliente: { nome, rua, numero, referencia, local: localSelecionado, valorEntrega },
        pagamento: { modo: modoPagamento, troco: modoPagamento === "Dinheiro" ? troco : null },
        cupom: cupomInfo,
        produtos: carrinho.map((p) => ({
          id: p.id,
          nome: p.name,
          quantidade: p.quantidade,
          preco: p.price,
        })),
        subtotal: calcularSubtotal(),
        descontoPercentual: desconto,
        total: calcularTotal(),
        data: new Date().toISOString(),
      };

      await addDoc(collection(db, "pedidos"), pedido);
      console.log("Pedido enviado ao Firestore com sucesso.");
    } catch (err) {
      console.error("Erro ao enviar pedido para o Firestore:", err);
      alert("Ocorreu um erro ao salvar seu pedido. Tente novamente.");
      return;
    }

    // WhatsApp
    const produtosMensagem = carrinho
      .map(
        (p) =>
          `🛒 *${p.name}*\n   - Qtd: ${p.quantidade} x R$${p.price.toFixed(
            2
          )} = R$${(p.price * p.quantidade).toFixed(2)}`
      )
      .join("\n\n");

    const descontoMensagem =
      desconto > 0
        ? `Desconto (${desconto}%): -R$${(calcularSubtotal() * (desconto / 100)).toFixed(2)}\n`
        : "";

    const totalMensagem = `*Total do Pedido: R$${calcularTotal().toFixed(2)}*`;

    const mensagem = `
*NOVO PEDIDO RECEBIDO*

*Produtos:*
${produtosMensagem}

-----------------------------------
*Resumo:*
- Subtotal: R$${calcularSubtotal().toFixed(2)}
- ${descontoMensagem}Taxa de Entrega: R$${valorEntrega.toFixed(2)}
- ${totalMensagem}

*Detalhes da Entrega:*
- *Nome:* ${nome}
- *Endereço:* ${rua}, Nº ${numero}
- *Bairro:* ${localSelecionado}
- *Referência:* ${referencia || "Nenhuma"}

*Pagamento:*
- *Método:* ${modoPagamento}
${modoPagamento === "Dinheiro" ? `- *Troco para:* R$${troco}` : ""}
${(desconto > 0 || freteGratisAtivo) ? `\n*Cupom aplicado:* ${cupom} ${freteGratisAtivo ? "(Frete grátis)" : `(${desconto}%)`}` : ""}

*ID do Pedido:* ${idPedido}

*Link para Impressão:*
https://imprimir-nu.vercel.app/
    `;

    const numeroWhatsApp = "+5522999500660";
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="carrinho-page-container">
      <header className="carrinho-header">
        <h1>Meu Carrinho</h1>
      </header>

      <div className="carrinho-layout">
        <div className="carrinho-items-list">
          {carrinho.length === 0 ? (
            <div className="carrinho-vazio-interno">
              <p>Seu carrinho está vazio.</p>
              <Link to="/" className="continue-comprando-btn">
                Adicionar Produtos
              </Link>
            </div>
          ) : (
            carrinho.map((produto) => (
              <div key={produto.id} className="carrinho-item-card">
                <img src={produto.imagem_url} alt={produto.name} className="carrinho-item-img" />
                <div className="carrinho-item-details">
                  <span className="item-name">{produto.name}</span>
                  <span className="item-price">R$ {produto.price.toFixed(2)}</span>
                </div>
                <div className="carrinho-item-quantity">
                  <button onClick={() => diminuirQuantidade(produto.id)}>−</button>
                  <span>{produto.quantidade}</span>
                  <button onClick={() => adicionarAoCarrinho(produto)}>+</button>
                </div>
                <div className="carrinho-item-total">
                  <span>R$ {(produto.price * produto.quantidade).toFixed(2)}</span>
                </div>
                <button
                  className="carrinho-item-remove"
                  onClick={() => removerDoCarrinho(produto.id)}
                >
                  &times;
                </button>
              </div>
            ))
          )}
        </div>

        <div className="carrinho-summary">
          <h2>Resumo do Pedido</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>R$ {calcularSubtotal().toFixed(2)}</span>
          </div>

          {desconto > 0 && (
            <div className="summary-row">
              <span>Desconto ({desconto}%)</span>
              <span>- R$ {(calcularSubtotal() * (desconto / 100)).toFixed(2)}</span>
            </div>
          )}

          <div className="summary-row">
            <span>Taxa de Entrega</span>
            <span>R$ {valorEntrega.toFixed(2)}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>R$ {calcularTotal().toFixed(2)}</span>
          </div>

          {/* --- CAMPO DE CUPOM --- */}
          <div className="cupom-container">
            <input
              type="text"
              placeholder="Insira seu cupom"
              value={cupom}
              onChange={(e) => setCupom(e.target.value)}
            />
            <button type="button" onClick={aplicarCupom}>
              Aplicar
            </button>
            {mensagemCupom && <p className="mensagem-cupom">{mensagemCupom}</p>}
          </div>

          {/* --- FORM --- */}
          <form onSubmit={handleSubmit} className="checkout-form">
            <h3>Detalhes da Entrega e Pagamento</h3>
            <input
              type="text"
              placeholder="Nome Completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <div className="form-group">
              <input
                type="text"
                placeholder="Rua / Avenida"
                value={rua}
                onChange={(e) => setRua(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Nº"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                required
                className="input-small"
              />
            </div>
            <input
              type="text"
              placeholder="Ponto de Referência (opcional)"
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
            />
            <select value={localSelecionado} onChange={handleLocalChange} required>
              {locais.map((local) => (
                <option key={local.nome} value={local.nome}>
                  {local.nome}
                </option>
              ))}
            </select>

            <select
              value={modoPagamento}
              onChange={(e) => setModoPagamento(e.target.value)}
              required
            >
              <option value="">Forma de Pagamento</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Pix">Pix</option>
              <option value="Cartão">Cartão de Crédito/Débito</option>
            </select>
            {modoPagamento === "Dinheiro" && (
              <input
                type="text"
                placeholder="Precisa de troco para quanto?"
                value={troco}
                onChange={(e) => setTroco(e.target.value)}
              />
            )}

            <button type="submit" className="finalizar-pedido-btn">
              Finalizar Pedido via WhatsApp
            </button>
          </form>
        </div>
      </div>

      {sugestoes.length > 0 && (
        <div className="sugestoes-container">
          <h2>Você também pode gostar...</h2>
          <div className="sugestoes-grid">
            {sugestoes.map((sugestao) => (
              <div className="sugestao-card" key={sugestao.id}>
                <img src={sugestao.imagem_url} alt={sugestao.name} />
                <h3>{sugestao.name}</h3>
                <div className="sugestao-footer">
                  <span>R$ {sugestao.price.toFixed(2)}</span>
                  <button onClick={() => adicionarAoCarrinho(sugestao)}>+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrinho;
