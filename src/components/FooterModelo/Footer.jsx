import React from 'react'
import logo from  '../../assets/logo.png'
import email from '../../assets/o-email.png'
import localização from '../../assets/localizacao.png'
import Tel from '../../assets/tel.png'
import Lin from '../../assets/lin.png'
import Intagram from '../../assets/instagram.png'
import Brasil from '../../assets/barsil.png'
import Eua from '../../assets/eua.png'
import Espanha from '../../assets/spa.png'
import './Footer.css';

const Footer = () => {
  return (
    <div className='footercontainer'>
      <div className='footerconteudo'>
        <div className='footer01'>
          <div>
            <img src={logo} alt="" />
            <div>
              <img src={email} alt="" />
              <p>depositolagoa2022@gmail.com</p>
            </div>
            <div>
              <img src={Tel} alt="" />
              <p>(22) 99950-0660 </p>
            </div>
            <div>
              <img src={localização} alt="" />
              <p>
              Endereço: Alameda Pres. Itamar Franco, 26 - Novo Cavaleiros, Macaé - RJ, 27930-130
              </p>
            </div>
          </div>
        </div>

        <div className='footer02'>
          <p>Trabalhe Conosco</p>
          <img src={Intagram} alt="" />
          <p>deposito_dalagoa</p>
        </div>

        <div className='footer03'>
          <img src={Brasil} alt="" />
          <img src={Eua} alt="" />
          <img src={Espanha} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Footer