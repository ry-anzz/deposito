import jsPDF from "jspdf";

const gerarPDF = async (idPedido) => {
  const doc = new jsPDF();

  // Dados do pedido
  doc.text("Pedido", 10, 10);
  doc.text(`ID do Pedido: ${idPedido}`, 10, 20);
  doc.text(`Nome: ${nome}`, 10, 30);
  doc.text(`Endereço: ${endereco}`, 10, 40);
  doc.text(`Rua: ${rua}`, 10, 50);
  doc.text(`CEP: ${cep}`, 10, 60);

  doc.text("Produtos", 10, 80);
  carrinho.forEach((produto, index) => {
    const y = 90 + index * 10;
    doc.text(`${produto.name} - Quantidade: ${produto.quantidade} - Preço: R$${produto.price}`, 10, y);
  });

  doc.text(`Total: R$${calcularTotal().toFixed(2)}`, 10, 150);

  // Salvar PDF no Firestore Storage (ou criar um Blob para download)
  const pdfBlob = doc.output("blob");
  return pdfBlob;
};
