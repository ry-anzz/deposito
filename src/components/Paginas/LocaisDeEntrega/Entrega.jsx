import React from 'react';
import './Entrega.css'; // Usaremos este novo ficheiro CSS

const LocaisDeEntrega = () => {
  const locais = [
    { nome: 'Novo Cavaleiros', preco: '6,00' },
    { nome: 'Cavaleiros', preco: '6,00' },
    { nome: 'Granja dos Cavaleiros', preco: '6,00' },
    { nome: 'São Marcos', preco: '6,00' },
    { nome: 'Praia do Pecado', preco: '6,00' },
    { nome: 'Bairro da Glória', preco: '6,00' },
    { nome: 'Vale Encantado', preco: '8,00' },
    { nome: 'Vale dos Cristais', preco: '10,00' },
    { nome: 'Vale das Palmeiras', preco: '10,00' },
    { nome: 'Mirante da lagoa', preco: '10,00' },
    { nome: 'Imboassica', preco: '10,00' },
    { nome: 'Guanabara', preco: '10,00' },
    { nome: 'Costa do Sol', preco: '10,00' },
    { nome: 'Riviera', preco: '10,00' }
  ];

  return (
    <div className="locais-page-container">
      {/* --- Banner do Topo --- */}
      <header className="locais-header">
        <div className="locais-header-content">
          <h1>Área de Entrega</h1>
          <p>CONSULTE OS BAIRROS E TAXAS ATENDIDOS</p>
        </div>
      </header>

      {/* --- Conteúdo Principal --- */}
      <main className="locais-main-content">
        <div className="locais-alert">
          <p><strong>Atenção:</strong> Favor verificar e consultar o valor da taxa de entrega ao finalizar seu pedido.</p>
        </div>

        <div className="locais-grid">
          {locais.map((local, index) => (
            <div className="local-card" key={index}>
              <div className="local-info">
                <span className="local-icon">📍</span>
                <span className="local-name">{local.nome}</span>
              </div>
              <div className="local-price">
                <span>R$ {local.preco}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LocaisDeEntrega;