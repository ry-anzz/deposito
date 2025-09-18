
import { useState, useEffect } from 'react';
import { useCarrinho } from '../context/CarrinhoContext';

import supabase from '../../supabaseClient';
import { Link } from 'react-router-dom';
import './Carrinho.css';

const Carrinho = () => {
  const { carrinho, adicionarAoCarrinho, diminuirQuantidade, removerDoCarrinho } = useCarrinho();
  const [sugestoes, setSugestoes] = useState([]);

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [referencia, setReferencia] = useState('');
  const [modoPagamento, setModoPagamento] = useState('');
  const [troco, setTroco] = useState('');
  const [localSelecionado, setLocalSelecionado] = useState('');
  const [valorEntrega, setValorEntrega] = useState(0);

  const locais = [
    { nome: 'Selecione o Bairro', valor: 0 }, { nome: 'Novo Cavaleiros', valor: 6 },
    { nome: 'Cavaleiros', valor: 6 }, { nome: 'Granja dos Cavaleiros', valor: 6 },
    { nome: 'São Marcos', valor: 6 }, { nome: 'Vale dos Cristais', valor: 10 },
    { nome: 'Vale das Palmeiras', valor: 10 }, { nome: 'Praia do Pecado', valor: 6 },
    { nome: 'Bairro da Glória', valor: 6 }, { nome: 'Mirante da lagoa', valor: 10 },
    { nome: 'Imboassica', valor: 10 }, { nome: 'Guanabara', valor: 10 },
    { nome: 'Costa do sol', valor: 10 }, { nome: 'Vale encantado', valor: 8 },
    { nome: 'Riviera', valor: 10 }, { nome: 'Outro local (a combinar)', valor: 0 }
  ];

  useEffect(() => {
    const fetchSugestoes = async () => {
      const categoriasSugeridas = ['MERCEARIA', 'GELO', 'REFRIGERANTES', 'DOCES'];
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .in('category', categoriasSugeridas)
        .limit(4);
      if (!error) {
        setSugestoes(data);
      } else {
        console.error("Erro ao buscar sugestões:", error);
      }
    };
    fetchSugestoes();
  }, []);
  
  const calcularSubtotal = () => {
    return carrinho.reduce((total, produto) => total + produto.price * produto.quantidade, 0);
  };

  const calcularTotal = () => {
    return calcularSubtotal() + valorEntrega;
  };
  
  const handleLocalChange = (e) => {
    const nomeLocal = e.target.value;
    const local = locais.find(l => l.nome === nomeLocal);
    setLocalSelecionado(nomeLocal);
    setValorEntrega(local ? local.valor : 0);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio. Adicione produtos antes de finalizar o pedido.");
        return;
    }
    // ...Sua lógica de envio para o Firestore e WhatsApp...
    alert(`Pedido enviado com sucesso!`);
  };

  return (
    <div className="carrinho-page-container">
      <header className="carrinho-header">
        <h1>Meu Carrinho</h1>
      </header>
        
      {/* CORREÇÃO APLICADA AQUI: O layout principal agora está sempre visível */}
      <div className="carrinho-layout">
        {/* Coluna da Esquerda: Itens do Carrinho */}
        <div className="carrinho-items-list">
          {carrinho.length === 0 ? (
            // A mensagem de carrinho vazio agora aparece DENTRO da coluna de itens
            <div className="carrinho-vazio-interno">
              <br />
              <Link to="/" className="continue-comprando-btn">Adicionar Produtos</Link>
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
                <button className="carrinho-item-remove" onClick={() => removerDoCarrinho(produto.id)}>
                  &times;
                </button>
              </div>
            ))
          )}
        </div>

        {/* Coluna da Direita: Resumo e Formulário */}
        <div className="carrinho-summary">
          <h2>Resumo do Pedido</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>R$ {calcularSubtotal().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Taxa de Entrega</span>
            <span>R$ {valorEntrega.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>R$ {calcularTotal().toFixed(2)}</span>
          </div>
          
          <form onSubmit={handleSubmit} className="checkout-form">
            <h3>Detalhes da Entrega e Pagamento</h3>
            <input type="text" placeholder="Nome Completo" value={nome} onChange={(e) => setNome(e.target.value)} required />
            <div className="form-group">
              <input type="text" placeholder="Rua / Avenida" value={rua} onChange={(e) => setRua(e.target.value)} required />
              <input type="text" placeholder="Nº" value={numero} onChange={(e) => setNumero(e.target.value)} required className="input-small" />
            </div>
            <input type="text" placeholder="Ponto de Referência (opcional)" value={referencia} onChange={(e) => setReferencia(e.target.value)} />
            <select value={localSelecionado} onChange={handleLocalChange} required>
              {locais.map(local => <option key={local.nome} value={local.nome}>{local.nome}</option>)}
            </select>
            <select value={modoPagamento} onChange={(e) => setModoPagamento(e.target.value)} required>
                <option value="">Forma de Pagamento</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Pix">Pix</option>
                <option value="Cartão">Cartão de Crédito/Débito</option>
            </select>
            {modoPagamento === 'Dinheiro' && (
              <input type="text" placeholder="Precisa de troco para quanto?" value={troco} onChange={(e) => setTroco(e.target.value)} />
            )}

            <button type="submit" className="finalizar-pedido-btn">Finalizar Pedido via WhatsApp</button>
          </form>
        </div>
      </div>

      {/* Seção de Sugestões */}
      {sugestoes.length > 0 && (
        <div className="sugestoes-container">
            <h2>Você também pode gostar...</h2>
            <div className="sugestoes-grid">
                {sugestoes.map(sugestao => (
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

