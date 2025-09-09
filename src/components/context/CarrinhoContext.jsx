// src/context/CarrinhoContext.js
import React, { createContext, useContext, useState } from 'react';

const CarrinhoContext = createContext();

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);

  const adicionarAoCarrinho = (produto, quantidade = 1) => {
    setCarrinho((prevCarrinho) => {
      const produtoExistente = prevCarrinho.find((item) => item.id === produto.id);
      if (produtoExistente) {
        return prevCarrinho.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      }
      return [...prevCarrinho, { ...produto, quantidade }];
    });
  };
  

  const removerDoCarrinho = (produtoId) => {
    setCarrinho((prevCarrinho) =>
      prevCarrinho.filter((produto) => produto.id !== produtoId)
    );
  };

  const diminuirQuantidade = (produtoId) => {
    setCarrinho((prevCarrinho) => {
      const produtoExistente = prevCarrinho.find((item) => item.id === produtoId);
      if (produtoExistente.quantidade > 1) {
        return prevCarrinho.map((item) =>
          item.id === produtoId
            ? { ...item, quantidade: item.quantidade - 1 }
            : item
        );
      } else {
        return prevCarrinho.filter((produto) => produto.id !== produtoId); // Remove item se quantidade for 1
      }
    });
  };

  return (
    <CarrinhoContext.Provider value={{ carrinho, adicionarAoCarrinho, removerDoCarrinho, diminuirQuantidade }}>
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => useContext(CarrinhoContext);
