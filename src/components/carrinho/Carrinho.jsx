import React, { useState } from 'react';
import { useCarrinho } from '../context/CarrinhoContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import './Carrinho.css';

const Carrinho = () => {
  const { carrinho, adicionarAoCarrinho, diminuirQuantidade } = useCarrinho();

  const [nome, setNome] = useState('');
  const [rua, setRua] = useState('');
  const [cep, setCep] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [referencia, setReferencia] = useState('');
  const [modoPagamento, setModoPagamento] = useState('');
  const [troco, setTroco] = useState('');
  const [localSelecionado, setLocalSelecionado] = useState('');
  const [valorEntrega, setValorEntrega] = useState(0);

  const locais = [
    { nome: 'Selecione o Local', valor: '0'},
    { nome: 'Novo Cavaleiros - 6,00', valor: 6 },
    { nome: 'Cavaleiros - 6,00', valor: 6 },
    { nome: 'Granja dos Cavaleiros - 6,00', valor: 6 },
    { nome: 'São Marcos - 6,00', valor: 6 },
    { nome: 'Vale dos Cristais - 10,00', valor: 10 },
    { nome: 'Vale das Palmeiras - 10,00', valor: 10 },
    { nome: 'Praia do Pecado - 6,00', valor: 6 },
    { nome: 'Bairro da Glória - 6,00', valor: 6 },
    { nome: 'Mirante da lagoa - 10,00', valor: 10 },
    { nome: 'Imboassica - 10,00', valor: 10 },
    { nome: 'Guanabara - 10,00', valor: 10 },
    { nome: 'Costa do sol -10,00', valor: 10 },
    { nome: 'Vale encantado - 8,00', valor: 8 },
    { nome: 'Riviera - 10,00', valor: 10 },
    { nome: 'Outro local', valor: 0 } // Local "Outro local"
  ];

  const calcularTotal = () => {
    let total = carrinho.reduce((total, produto) => {
      return total + produto.price * produto.quantidade;
    }, 0);
    // Soma o valor de entrega, exceto quando for "Outro local"
    if (localSelecionado !== 'Outro local') {
      total += valorEntrega;
    }
    return total;
  };

  const gerarIdPedido = () => {
    return Math.random().toString(36).substring(2, 6);
  };

  const enviarDadosParaFirestore = async (idPedido) => {
    try {
      const pedido = {
        idPedido,
        cliente: {
          nome,
          rua,
          cep,
          referencia,
          local: localSelecionado,
          valorEntrega: localSelecionado === 'Outro local' ? 0 : valorEntrega, // Não inclui valor de entrega para "Outro local"
        },
        pagamento: {
          modo: modoPagamento,
          troco: modoPagamento === 'Dinheiro' ? troco : null,
        },
        produtos: carrinho.map((produto) => ({
          id: produto.id,
          nome: produto.name,
          quantidade: produto.quantidade,
          preco: produto.price,
        })),
        total: calcularTotal(),
        data: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'pedidos'), pedido);
      console.log('Pedido enviado com sucesso. ID:', docRef.id);
    } catch (e) {
      console.error('Erro ao enviar pedido para o Firestore:', e);
    }
  };

  const enviarWhatsApp = (idPedido) => {
    const produtosMensagem = carrinho
      .map((produto) => {
        const totalProduto = (produto.price * produto.quantidade).toFixed(2);
        return `🛒 *${produto.name}*\n   - Preço: R$${produto.price.toFixed(2)}\n   - Quantidade: ${produto.quantidade}\n   - Total: R$${totalProduto}\n   - Imagem:📷 (${produto.imagem_url})`;
      })
      .join('\n\n');

    let totalCarrinho = calcularTotal().toFixed(2);
    let valorEntregaMensagem = localSelecionado === 'Outro local' ? 'Valor de entrega será negociado com o dono.' : `Valor da entrega: R$${valorEntrega.toFixed(2)}`;

    const mensagem = `
    ↪︎ *Lista de Compras*\n\n${produtosMensagem}\n\n${valorEntregaMensagem}\n *Total: R$${totalCarrinho}*\n\n
    ↪︎ *Informações do Cliente*\n- Nome: ${nome}\n- Rua: ${rua}\n- Número: ${cep}\n- Referência: ${referencia}\n
    ↪︎ *Pagamento*: ${modoPagamento}${modoPagamento === 'Dinheiro' ? `\n↪︎ Troco para: R$${troco}` : ''}\n
    ↪︎ *ID do Pedido:* ${idPedido}\n 
    ↪︎ *Imprimir Pedido:* https://imprimir-nu.vercel.app/`;

    const numeroWhatsApp = '+5522999500660'; // Altere para o número desejado
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, '_blank');
  };

  return (
    <div className="carrinho-container">
      <h2>Seu carrinho</h2>
      {carrinho.length === 0 ? (
        <p>Nenhum produto no carrinho.</p>
      ) : (
        <>
          <ul className="produtos-list">
            {carrinho.map((produto) => (
              <li key={produto.id} className="produto-item">
                <img src={produto.imagem_url} alt={produto.name} className="carrinho-produto-imagem" />
                <span className="produto-info">
                  <span className="produto-name">{produto.name}</span>
                  <span className="preco">R${produto.price.toFixed(2)} x {produto.quantidade}</span>
                </span>
                <div>
                  <button onClick={() => diminuirQuantidade(produto.id)}>Remover</button>
                  <button onClick={() => adicionarAoCarrinho(produto)}>Adicionar</button>
                </div>
              </li>
            ))}
          </ul>

          <h3>Total: R${calcularTotal().toFixed(2)}</h3>

          <button id="enviar-whatsapp" onClick={() => setMostrarModal(true)}>Enviar para WhatsApp</button>
        </>
      )}

      {mostrarModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Insira seus dados</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const idPedido = gerarIdPedido();
                await enviarDadosParaFirestore(idPedido);
                enviarWhatsApp(idPedido);
                setMostrarModal(false);
              }}
            >
              <div>
                <label>Nome:</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
            
              <div>
                <label>Rua:</label>
                <input
                  type="text"
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Numero:</label>
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Referência:</label>
                <input
                  type="text"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                />
              </div>
              <div>
                <label>Modo de Pagamento:</label>
                <select
                  value={modoPagamento}
                  onChange={(e) => setModoPagamento(e.target.value)}
                  required
                >
                  <option value="null">Escolher opção</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Pix">Pix</option>
                  <option value="Cartão">Cartão</option>
                  
                </select>
              </div>
              {modoPagamento === 'Dinheiro' && (
                <div>
                  <label>Troco para:</label>
                  <input
                    type="number"
                    value={troco}
                    onChange={(e) => setTroco(e.target.value)}
                    required
                  />
                </div>
              )}
              <div>
                <label>Selecione o Local:</label>
                <select
                  value={localSelecionado}
                  onChange={(e) => {
                    const valor = e.target.value;
                    setLocalSelecionado(valor);
                    // Atualiza o valor da entrega baseado no local
                    const localSelecionado = locais.find((local) => local.nome === valor);
                    setValorEntrega(localSelecionado ? localSelecionado.valor : 0);
                  }}
                >
                  {locais.map((local) => (
                    <option key={local.nome} value={local.nome}>
                      {local.nome}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit">Confirmar e Enviar</button>
              <button type="button" onClick={() => setMostrarModal(false)}>Cancelar e Fechar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrinho;

