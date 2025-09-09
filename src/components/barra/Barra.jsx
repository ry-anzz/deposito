import React from 'react'
import './Barra.css';  
import sinal from  '../../assets/sinal-aprovado.png'
import carteira from  '../../assets/argent.png'
import credito from '../../assets/credit-card.png'
import delivery from '../../assets/delivery.png'

const Barra = () => {
  return (
    <div className='barra'>
        <div>
          <img src={sinal} alt="" />
          <p>Selecione o seu produto</p>
        </div>
        <div>
          <img src={carteira} alt="" />
          <p>Adicione no carrinho</p>
        </div>
        <div>
          <img src={credito} alt="" />
          <p>Finalize no WhatsApp</p>
        </div>
        <div>
          <img src={delivery} alt="" />
          <p>Entregamos em Macaé</p>
        </div>
    </div>
  )
}

export default Barra
