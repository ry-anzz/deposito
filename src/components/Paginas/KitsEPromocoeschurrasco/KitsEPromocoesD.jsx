import React from 'react';
import { useCarrinho } from '../../context/CarrinhoContext';
import PaoDeAlho from '../../../assets/paodealho.jpg';
import CoxinhaDaAsa from '../../../assets/asinha.png';
import Carvão from "../../../assets/cavão2k.jpg";
import Linguiça from '../../../assets/liguiça.png';
import Queijo from '../../../assets/queijo.webp';
import Picanha from '../../../assets/picanha.png';
import Bife from '../../../assets/bife.jpg';
import './KitsePromocoesD.css'; // Usaremos este novo CSS

// --- SUB-COMPONENTE PARA O BOTÃO INTELIGENTE ---
const BotaoAdicionarKit = ({ kitInfo }) => {
  const { carrinho, adicionarAoCarrinho, diminuirQuantidade } = useCarrinho();
  const kitId = kitInfo.name; // Usa o nome como ID único para o kit
  const itemNoCarrinho = carrinho.find(item => item.id === kitId);

  if (itemNoCarrinho) {
    return (
      <div className="quantity-control-kit">
        <button onClick={() => diminuirQuantidade(kitId)}>−</button>
        <span>{itemNoCarrinho.quantidade}</span>
        <button onClick={() => adicionarAoCarrinho({ ...kitInfo, id: kitId })}>+</button>
      </div>
    );
  }

  return (
    <button className="kit-add-button" onClick={() => adicionarAoCarrinho({ ...kitInfo, id: kitId })}>
      Adicionar Kit - R$ {kitInfo.price.toFixed(2)}
    </button>
  );
};

const KitsDeChurrasco = () => {
  const kit1Itens = [
    { nome: 'Peça de Picanha (1)', imagem: Picanha }, { nome: 'Pão de Alho (1)', imagem: PaoDeAlho },
    { nome: 'Coxinha da Asa (1)', imagem: CoxinhaDaAsa }, { nome: 'Linguiça (1)', imagem: Linguiça },
    { nome: 'Queijo Coalho', imagem: Queijo }, { nome: "Carvão 2KG", imagem: Carvão },
  ];
  
  const kit1Info = {
    name: 'Kit Churrasco (Para dividir com a família) - Serve até 8 pessoas',
    price: 249.90,
    imagem_url: 'https://picsum.photos/seed/churrasco-familia/300'
  };

  const kit2Itens = [
    { nome: 'Peça de Bife Ancho (1)', imagem: Bife }, { nome: 'Pão de Alho (1)', imagem: PaoDeAlho },
    { nome: 'Coxinha da Asa (1)', imagem: CoxinhaDaAsa }, { nome: 'Linguiça (1)', imagem: Linguiça },
    { nome: "Carvão 2KG", imagem: Carvão },
  ];

  const kit2Info = {
    name: 'Kit Churrasco (Para resenha com amigos) - Serve até 5 pessoas',
    price: 154.90,
    imagem_url: 'https://picsum.photos/seed/churrasco-amigos/300'
  };

  return (
    <div className="churrasco-page-container">
      <header className="churrasco-header">
        <div className="churrasco-header-content">
          <h1>Kits de Churrasco</h1>
          <p>TUDO PRONTO PARA A SUA GRELHA</p>
        </div>
      </header>

      <main className="churrasco-main-content">
        {/* --- Kit 1: Família --- */}
        <section className="kit-section">
          <h2 className="kit-title">{kit1Info.name}</h2>
          <div className="kit-items-grid">
            {kit1Itens.map((item, index) => (
              <div className="kit-item-card" key={index}>
                <img src={item.imagem} alt={item.nome} />
                <p>{item.nome}</p>
              </div>
            ))}
          </div>
          <div className="kit-button-container">
            <BotaoAdicionarKit kitInfo={kit1Info} />
          </div>
        </section>

        {/* --- Kit 2: Amigos --- */}
        <section className="kit-section">
          <h2 className="kit-title">{kit2Info.name}</h2>
          <div className="kit-items-grid">
            {kit2Itens.map((item, index) => (
              <div className="kit-item-card" key={index}>
                <img src={item.imagem} alt={item.nome} />
                <p>{item.nome}</p>
              </div>
            ))}
          </div>
          <div className="kit-button-container">
            <BotaoAdicionarKit kitInfo={kit2Info} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default KitsDeChurrasco;