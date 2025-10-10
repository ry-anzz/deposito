import React, { createContext, useState, useContext } from 'react';

const CarrinhoContext = createContext();

export const useCarrinho = () => useContext(CarrinhoContext);

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);
  
  const [modalProduto, setModalProduto] = useState(null);
  const [quantidade, setQuantidade] = useState(1);

  const abrirModal = (produto) => {
    setModalProduto(produto);
    setQuantidade(1);
  };

  const fecharModal = () => {
    setModalProduto(null);
  };

  // --- FUNÇÃO ADICIONAR AO CARRINHO ATUALIZADA ---
  const adicionarAoCarrinho = (produto, qtd = 1) => {
    setCarrinho((prevCarrinho) => {
      const produtoExistente = prevCarrinho.find((p) => p.id === produto.id);

      // --- INÍCIO DA LÓGICA DE CONTROLO DE ESTOQUE DA OFERTA ---

      // 1. Verifica se o produto é uma oferta com limite de estoque
      if (produto.estoque_oferta && produto.estoque_oferta > 0) {
        const quantidadeAtualNoCarrinho = produtoExistente ? produtoExistente.quantidade : 0;

        // 2. Se a quantidade no carrinho já atingiu o limite da oferta, bloqueia a adição
        if (quantidadeAtualNoCarrinho >= produto.estoque_oferta) {
          alert(`Limite de ${produto.estoque_oferta} unidades para esta oferta atingido!`);
          return prevCarrinho; // Retorna o carrinho sem alterações
        }
      }
      // --- FIM DA LÓGICA DE CONTROLO DE ESTOQUE ---


      // Lógica original de adicionar/incrementar (só corre se o estoque permitir)
      if (produtoExistente) {
        return prevCarrinho.map((p) =>
          p.id === produto.id ? { ...p, quantidade: p.quantidade + qtd } : p
        );
      }
      return [...prevCarrinho, { ...produto, quantidade: qtd }];
    });
  };
  
  const confirmarAdicao = () => {
    // A lógica de confirmação do modal agora usa a nova função com verificação
    if (quantidade > 0 && modalProduto) {
      adicionarAoCarrinho(modalProduto, quantidade);
      fecharModal();
    }
  };

  const diminuirQuantidade = (produtoId) => {
    setCarrinho((prevCarrinho) => {
      const produtoExistente = prevCarrinho.find((p) => p.id === produtoId);
      if (produtoExistente && produtoExistente.quantidade === 1) {
        return prevCarrinho.filter((p) => p.id !== produtoId);
      }
      return prevCarrinho.map((p) =>
        p.id === produtoId ? { ...p, quantidade: p.quantidade - 1 } : p
      );
    });
  };

  const removerDoCarrinho = (produtoId) => {
    setCarrinho((prevCarrinho) => prevCarrinho.filter((p) => p.id !== produtoId));
  };

  const value = {
    carrinho,
    adicionarAoCarrinho,
    diminuirQuantidade,
    removerDoCarrinho,
    modalProduto,
    abrirModal,
    fecharModal,
    quantidade,
    setQuantidade,
    confirmarAdicao
  };

  return (
    <CarrinhoContext.Provider value={value}>
      {children}
    </CarrinhoContext.Provider>
  );
};