const { SerialPort } = require('serialport');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

const PORT = 9101;

const porta = new SerialPort({
  path: 'COM4',
  baudRate: 115200
});

let buffer = '';
let ultimoPeso = 0;

porta.on('open', () => {
  console.log('Balança conectada na COM4');
});

porta.on('data', (dados) => {
  buffer += dados.toString();

  const linhas = buffer.split('\n');
  buffer = linhas.pop();

  for (const linha of linhas) {
    const texto = linha.trim();

    if (texto !== '') {
      const peso = parseFloat(texto);

      if (!isNaN(peso)) {
        ultimoPeso = peso;
        console.log('Peso recebido:', ultimoPeso);
      }
    }
  }
});

app.get('/peso', (req, res) => {
  res.json({
    peso: ultimoPeso
  });
});

app.listen(PORT, () => {
  console.log(`Servidor da balança rodando em http://localhost:${PORT}`);
});