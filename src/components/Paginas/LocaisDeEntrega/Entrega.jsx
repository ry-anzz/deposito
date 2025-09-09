import React from 'react';

const Locais = () => {
  const locais = [
    { nome: 'Novo Cavaleiros - 6,00' },
    { nome: 'Cavaleiros - 6,00' },
    { nome: 'Granja dos Cavaleiros - 6,00' },
    { nome: 'São Marcos - 6,00' },
    { nome: 'Vale dos Cristais - 10,00' },
    { nome: 'Vale das Palmeiras - 10,00' },
    { nome: 'Praia do Pecado - 6,00' },
    { nome: 'Bairro da Glória - 6,00' },
    { nome: 'Mirante da lagoa - 10,00' },
    { nome: 'Imboassica - 10,00' },
    { nome: 'Guanabara - 10,00' },
    { nome: 'Costa do sol -10,00' },
    { nome: 'Vale encantado - 8,00' },
    { nome: 'Riviera - 10,00' }
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Área de Abrangência</h2>
      <p
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          color: '#555',
          fontSize: '20px',
        }}
      >
        ⚠️ Favor verificar e consultar o valor da taxa de entrega. ⚠️
      </p>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          
        }}
      >
        {locais.map((local, index) => (
          <li
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px',
              padding: '10px 15px',
              borderRadius: '10px',
              backgroundColor: '#6b3624', // Fundo vermelho escuro
              width: '300px',
              maxWidth: '400px', // Limita a largura do item
              color: '#fff', // Texto branco
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            }}
          >
            <span
              style={{
                display: 'flex',
                width: '40px',
                height: '40px',
                backgroundColor: '#fff',
                borderRadius: '50%',
                
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '10px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              }}
            >
              <img
                src="https://img.icons8.com/ios-filled/50/000000/marker.png"
                alt="Local"
                style={{ width: '20px', height: '20px' }}
              />
            </span>
            <span>{local.nome}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default Locais;

