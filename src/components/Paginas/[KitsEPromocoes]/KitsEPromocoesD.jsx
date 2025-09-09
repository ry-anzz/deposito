import React from 'react';
import { useCarrinho } from '../../context/CarrinhoContext';
import PaoDeAlho from '../../../assets/paodealho.jpg';
import CoxinhaDaAsa from '../../../assets/asinha.png';
import Carvão from "../../../assets/cavão2k.jpg";
import Cavão4k from "../../../assets/cavão4k.jpg"
import Linguiça from '../../../assets/liguiça.png';
import Sal from '../../../assets/sal.jpg';
import Parana from '../../../assets/parana.jpg';
import Bife from '../../../assets/bife.jpg';
import Suina from '../../../assets/suina.png'
import Queijo from '../../../assets/queijo.webp'
import Costela from '../../../assets/costela.jpg'
import Farofa from '../../../assets/farofa.webp'
import Picanha from '../../../assets/picanha.png'
import Sal500 from '../../../assets/sal500.jpg'
import Baixo from '../../../assets/baixo.png'
import Churrasco from '../../../assets/image-churrasco.jpg'
import Balão from '../../../assets/balao.png'
import Taboau from '../../../assets/tabua.png'
import Brilho from '../../../assets/brilho.png'
import Estrela from '../../../assets/estrelas.png'
import Barraspng from '../../../assets/barraspng.png'
import './KitsEPromocoes.css';

const ChurrascoBasico = () => {
  const { adicionarAoCarrinho } = useCarrinho();

  const kit1 = [
    { nome: 'Peça de Picanha (1)', imagem: Picanha },
    { nome: 'Pão de Alho (1)', imagem: PaoDeAlho },
    { nome: 'Coxinha da Asa - Pif Paf (1)', imagem: CoxinhaDaAsa },
    { nome: 'Linguiça - Pif Paf (1)', imagem: Linguiça },
    { nome: 'Queijo Coalho', imagem: Queijo },
    { nome: "Carvão 2KG", imagem: Carvão },
  ];

  const kit2 = [
    { nome: 'Peça de Bife Ancho (1)', imagem: Bife },
    { nome: 'Pão de Alho (1)', imagem: PaoDeAlho },
    { nome: 'Coxinha da Asa - Pif Paf (1)', imagem: CoxinhaDaAsa },
    { nome: 'Linguiça - Pif Paf (1)', imagem: Linguiça },
    { nome: "Carvão 2KG", imagem: Carvão },

  ];


  const handleAdicionarKit = () => {
    const kitBasico = {
      name: 'Kit Churrasco (Para dividir com a família) - Serve até 8 pessoas',
      price: 154.90,
    };
    adicionarAoCarrinho(kitBasico);
  };

  const handleAdicionarKit2 = () => {
    const kitBasico = {
      name: 'Kit Churrasco (Para resenha com os amigos) - Serve até 5 pessoas',
      price: 154.90,
    };
    adicionarAoCarrinho(kitBasico);
  };

  return (
    <div className='elite'>
      <div className="chirrasco-container">

        <div className='image-churrasco'>
          <img src={Churrasco} alt="" />
        </div>

        <div className="kit-container">

          <div className='card01'>
            <h1 className="kit-title">Kit Churrasco (Para dividir com a família)</h1>
            <div className="kit-cards">
              {kit1.map((item, index) => (
                <div className="kit-card" key={index}>
                  <div className="kit-image-wrapper">
                    <img className="kit-image" src={item.imagem} alt={item.nome} />
                  </div>
                  <p className="kit-name">{item.nome}</p>
                </div>
              ))}
            </div>

            {/* Botão Adicionar Kit */}
            <div className="chirrasco-kit-button">
              <button onClick={handleAdicionarKit}>Adicionar Kit Churrasco (Família) - R$ 249,90</button>
            </div>
          </div>

          <div className="card02">
            <h1 className="kit-title">Kit Churrasco (Para resenha com amigos)</h1>

            <div className="kit-cards">
              {kit2.map((item, index) => (
                <div className="kit-card2" key={index}>
                  <div className="kit-image-wrapper2">
                    <img className="kit-image2" src={item.imagem} alt={item.nome} />
                  </div>
                  <p className="kit-name2">{item.nome}</p>
                </div>
              ))}
            </div>

            {/* Botão Adicionar Kit */}


            <div className="chirrasco-kit-button">
              <button onClick={handleAdicionarKit2}>Adicionar Kit Churrasco (Resenha) - R$154,90</button>
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