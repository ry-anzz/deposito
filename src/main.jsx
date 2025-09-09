import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { CarrinhoProvider } from './components/context/CarrinhoContext.jsx'; // Certifique-se de usar a extensão correta

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CarrinhoProvider>
      <App />
    </CarrinhoProvider>
  </StrictMode>
);
