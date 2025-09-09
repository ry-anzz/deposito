import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Importações de componentes
import { CarrinhoProvider } from "./components/context/CarrinhoContext";

import Destaquebar from "./components/Destaques/DestaqModelo/Destaquebar";
import DestaqueMercearia from "./components/Destaques/DestaqMercearia/DestaqueMercearia";
import DestaqueVinho from "./components/Destaques/DestaqVinho/DestaqueVinho";
import DestaqueEspumante from "./components/Destaques/DestaqEspumante/DestaqueEspumante";

import Produtos from "./components/Paginas/Mercearia/Produtos";
import Petshop from "./components/Paginas/Petshop/Petshop";
import Espumantes from "./components/Paginas/Espumantes/Espumante";
import Vodkas from "./components/Paginas/Vodkas/Vodkas";
import Energeticos from "./components/Paginas/Energeticos/Energeticos";
import Destilados from "./components/Paginas/Destilados/Destilados";
import Vinhos from "./components/Paginas/Vinhos/Vinho";
import Cervejas from "./components/Paginas/Cervejas/Cerveja";
import KitsEPromocoes from "./components/Paginas/KitsEPromocoes/KitsEPromocoes";
import LocaisDeEntrega from "./components/Paginas/LocaisDeEntrega/Entrega";

import PromocoesEBebidas from "./components/Paginas/PromocoesEBebidas/PromocoesEBebidas";
import Gelos from "./components/Paginas/Gelos/Gelos";


import Footer from "./components/FooterModelo/Footer";
import Navsbars from "./components/HeaderBar/Navsbars";
import Banner from "./components/banner/Banner";
import Barra from "./components/barra/Barra";
import Contato from "./components/contato/Contato";
import Carrinho from "./components/carrinho/Carrinho";
import BotaoCarrinho from "./components/botaoCarrinho/BotaoCarrinho";

import "./App.css";

const App = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já confirmou a idade
    const isAdult = localStorage.getItem("isAdult");
    if (!isAdult) {
      setShowModal(true);
    }
  }, []);

  const handleConfirmAge = () => {
    localStorage.setItem("isAdult", "true");
    setShowModal(false);
  };

  const handleDenyAccess = () => {
    alert("Você precisa ter 18 anos ou mais para acessar este site.");
    window.location.href = "https://www.google.com"; // Redireciona o usuário
  };

  return (
    <CarrinhoProvider>
      <Router>
        <div className="container">
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Confirmação de Idade</h2>
                <p>Você tem 18 anos ou mais?</p>
                <button onClick={handleConfirmAge}>Sim</button>
                <button onClick={handleDenyAccess}>Não</button>
              </div>
            </div>
          )}
          {!showModal && (
            <>
             
              <Navsbars />
              <BotaoCarrinho />
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <Banner />
                      <Barra />
                      <Destaquebar />
                      <DestaqueMercearia />
                      <DestaqueVinho />
                      <DestaqueEspumante />
                      <Footer />
                    </>
                  }
                />

                <Route path="/mercearia" element={<Produtos />} />
                <Route path="/petshop" element={<Petshop />} />
                <Route path="/carrinho" element={<Carrinho />} />
                <Route path="/cervejas" element={<Cervejas />} />
                <Route path="/gelos" element={<Gelos />} />
                <Route path="/kits-e-promocoes" element={<KitsEPromocoes />} />
                <Route
                  path="/promocoes-e-bebidas"
                  element={<PromocoesEBebidas />}
                />
                <Route path="/destilados" element={<Destilados />} />
                <Route path="/energeticos" element={<Energeticos />} />
                <Route path="/contato" element={<Contato />} />
                <Route path="/vinhos" element={<Vinhos />} />
                <Route path="/espumantes" element={<Espumantes />} />
                <Route path="/vodkas" element={<Vodkas />} />
                <Route
                  path="/locais-de-entrega"
                  element={<LocaisDeEntrega />}
                ></Route>
              </Routes>
            </>
          )}
        </div>
      </Router>
    </CarrinhoProvider>
  );
};

export default App;
