const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Adicione esta linha para servir arquivos estáticos da pasta 'views'
app.use(express.static(path.join(__dirname, 'view')));

// Rota para obter o conteúdo do arquivo JSON
app.get('/api/perguntas', (req, res) => {
    const filePath = path.join(__dirname, 'view/bd/perguntas.json');

    // Lê o arquivo JSON de forma assíncrona
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao ler o arquivo JSON');
            return;
        }

        // Converte o conteúdo do arquivo para JSON e envia como resposta
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server aberto na porta ${PORT}`);
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server fechado');
        process.exit(0);
    });
});