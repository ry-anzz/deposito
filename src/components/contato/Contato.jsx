// components/contato/Contato.js
import React from 'react';
import email from '../../assets/o-email.png';
import Tel from '../../assets/tel.png'
import localizacao from '../../assets/localizacao.png';
import './Contato.css';

const Contato = () => {
  return (
    <div className="contato-container">
      
      {/* Primeira Seção: Informações de Contato */}

      <div className='primeira'>
      <div className="contato-section contato-info">
        <h2>Informações de Contato!</h2>
        <p>Precisa de mais informação ou quer nos conhecer melhor?</p>
        <p><img src={Tel} alt="" />(22) 99950-0660</p>

        <p> <img src={email} alt="Email" />depositolagoa2022@gmail.com</p>
      </div>

      {/* Segunda Seção: Localização */}
      <div className="contato-section contato-mapa">
        <h2>Onde Estamos?</h2>
        <p>
          <img src={localizacao} alt="Location" className='localize-mapas'/> Alameda Pres. Itamar Franco, 26 - Novo Cavaleiros, Macaé - RJ, 27930-130
        </p>
        <br />
        <iframe
   

          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3688.5731775080258!2d-41.81075370000001!3d-22.407442499999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x963132995f9d39%3A0xfae2e3d41f7adda7!2sAlameda%20Pres.%20Itamar%20Franco%2C%2026%20-%20Novo%20Cavaleiros%2C%20Maca%C3%A9%20-%20RJ%2C%2027930-000!5e0!3m2!1spt-PT!2sbr!4v1731975231516!5m2!1spt-PT!2sbr"
          allowFullScreen=""
          loading="lazy"
          title="Localização"
        ></iframe>
      </div>
      </div>
      <div className='segunda'>
      <div className="contato-section contato-form">
        <h2>Envie-nos uma Mensagem</h2>
        <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
          <label>
            Nome:
            <input type="text" name="name" required />
          </label>
          <label>
            Email:
            <input type="email" name="email" required />
          </label>
          <label>
            Mensagem:
            <textarea name="message" required></textarea>
          </label>
          <button type="submit">Enviar</button>
        </form>
      </div>
      </div>
    

      {/* Terceira Seção: Formulário de Contato */}
     
    </div>
  );
};

export default Contato;
