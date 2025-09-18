import React, { createContext, useState, useContext } from "react";

// 1. Cria o Contexto
const CarrinhoContext = createContext();

// 2. Cria um "Hook" para facilitar o uso do contexto em outros componentes
export const useCarrinho = () => useContext(CarrinhoContext);

// 3. Cria o "Provider", que é o componente que vai fornecer os dados para toda a sua aplicação
export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);

  // Lógica do Modal de Adicionar Produto
  const [modalProduto, setModalProduto] = useState(null);
  const [quantidade, setQuantidade] = useState(1);

  const abrirModal = (produto) => {
    setModalProduto(produto);
    setQuantidade(1); // Reseta a quantidade para 1 sempre que abrir o modal
  };

  const fecharModal = () => {
    setModalProduto(null);
  };

  const adicionarAoCarrinho = (produto, qtd = 1) => {
    setCarrinho((prevCarrinho) => {
      const produtoExistente = prevCarrinho.find((p) => p.id === produto.id);
      if (produtoExistente) {
        // Se o produto já existe, apenas aumenta a quantidade
        return prevCarrinho.map((p) =>
          p.id === produto.id ? { ...p, quantidade: p.quantidade + qtd } : p
        );
      }
      // Se não existe, adiciona o novo produto ao carrinho
      return [...prevCarrinho, { ...produto, quantidade: qtd }];
    });
  };

  // Função que será chamada pelo botão "Confirmar" do modal
  const confirmarAdicao = () => {
    if (quantidade > 0 && modalProduto) {
      adicionarAoCarrinho(modalProduto, quantidade);
      fecharModal();
    }
  };

  const diminuirQuantidade = (produtoId) => {
    setCarrinho((prevCarrinho) => {
      const produtoExistente = prevCarrinho.find((p) => p.id === produtoId);
      if (produtoExistente.quantidade === 1) {
        // Se a quantidade for 1, remove o produto
        return prevCarrinho.filter((p) => p.id !== produtoId);
      }
      // Se for maior que 1, apenas diminui a quantidade
      return prevCarrinho.map((p) =>
        p.id === produtoId ? { ...p, quantidade: p.quantidade - 1 } : p
      );
    });
  };

  const removerDoCarrinho = (produtoId) => {
    setCarrinho((prevCarrinho) =>
      prevCarrinho.filter((p) => p.id !== produtoId)
    );
  };

  // Todos os estados e funções que a aplicação precisa ter acesso
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
    confirmarAdicao,
  };

  return (
    <CarrinhoContext.Provider value={value}>
      {children}
    </CarrinhoContext.Provider>
  );
};
