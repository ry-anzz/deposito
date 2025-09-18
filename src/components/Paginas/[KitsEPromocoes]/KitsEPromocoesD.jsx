import React from 'react';
import { useCarrinho } from '../../context/CarrinhoContext';
import PaoDeAlho from '../../../assets/paodealho.jpg';
import CoxinhaDaAsa from '../../../assets/asinha.png';
import Carvão from "../../../assets/cavão2k.jpg";
import Linguiça from '../../../assets/liguiça.png';
import Queijo from '../../../assets/queijo.webp';
import Picanha from '../../../assets/picanha.png';
import Bife from '../../../assets/bife.jpg';
import Baixo from '../../../assets/baixo.png';
import Churrasco from '../../../assets/image-churrasco.jpg';
import './KitsEPromocoesD.css';

// --- SUB-COMPONENTE PARA O BOTÃO INTELIGENTE ---
const BotaoAdicionarKit = ({ kitInfo, kitItems }) => {
  const { carrinho, adicionarAoCarrinho, diminuirQuantidade } = useCarrinho();
  
  // O ID do kit será baseado no seu nome para ser único
  const kitId = kitInfo.name;
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


const ChurrascoBasico = () => {
  // A lógica do modal não é mais necessária aqui

  const kit1Itens = [
    { nome: 'Peça de Picanha (1)', imagem: Picanha }, { nome: 'Pão de Alho (1)', imagem: PaoDeAlho },
    { nome: 'Coxinha da Asa - Pif Paf (1)', imagem: CoxinhaDaAsa }, { nome: 'Linguiça - Pif Paf (1)', imagem: Linguiça },
    { nome: 'Queijo Coalho', imagem: Queijo }, { nome: "Carvão 2KG", imagem: Carvão },
  ];
  
  const kit1Info = {
    name: 'Kit Churrasco (Para dividir com a família) - Serve até 8 pessoas',
    price: 249.90,
  };

  const kit2Itens = [
    { nome: 'Peça de Bife Ancho (1)', imagem: Bife }, { nome: 'Pão de Alho (1)', imagem: PaoDeAlho },
    { nome: 'Coxinha da Asa - Pif Paf (1)', imagem: CoxinhaDaAsa }, { nome: 'Linguiça - Pif Paf (1)', imagem: Linguiça },
    { nome: "Carvão 2KG", imagem: Carvão },
  ];

  const kit2Info = {
    name: 'Kit Churrasco (Para resenha com amigos) - Serve até 5 pessoas',
    price: 154.90,
  };

  return (
    <div className='elite'>
      <div className="chirrasco-container">
        <div className='image-churrasco'>
          <img src={Churrasco} alt="Churrasco" />
        </div>

        <div className="kit-container">
          <div className='card01'>
            <h1 className="kit-title">Kit Churrasco (Para dividir com a família)</h1>
            <div className="kit-cards">
              {kit1Itens.map((item, index) => (
                <div className="kit-card" key={index}>
                  <div className="kit-image-wrapper">
                    <img className="kit-image" src={item.imagem} alt={item.nome} />
                  </div>
                  <p className="kit-name">{item.nome}</p>
                </div>
              ))}
            </div>
            <div className="chirrasco-kit-button">
              {/* Usando o novo componente de botão */}
              <BotaoAdicionarKit kitInfo={kit1Info} />
            </div>
          </div>

          <div className="card02">
            <h1 className="kit-title">Kit Churrasco (Para resenha com amigos)</h1>
            <div className="kit-cards">
              {kit2Itens.map((item, index) => (
                <div className="kit-card2" key={index}>
                  <div className="kit-image-wrapper2">
                    <img className="kit-image2" src={item.imagem} alt={item.nome} />
                  </div>
                  <p className="kit-name2">{item.nome}</p>
                </div>
              ))}
            </div>
            <div className="chirrasco-kit-button">
              {/* Usando o novo componente de botão */}
              <BotaoAdicionarKit kitInfo={kit2Info} />
            </div>
          </div>
        </div>

        <div className="chirrasco-image-footer">
          <img src={Baixo} alt="Imagem de rodapé" />
        </div>
      </div>
    </div>
  );
};

export default ChurrascoBasico;