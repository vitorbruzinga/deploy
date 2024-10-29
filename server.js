// server.js
import express from 'express';
import next from 'next';
import dotenv from 'dotenv'; // Importa dotenv
import { connectToDatabase, sql } from './config/dbConfig.js'; // Adicione '.js' ao final


dotenv.config(); // Carrega as variáveis de ambiente

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => { // Mudamos a função para async
    const server = express();

    // Conectar ao banco de dados ao iniciar o servidor
    await connectToDatabase(); // Aguarda a conexão antes de iniciar o servidor

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`> Pronto para rodar na porta ${PORT}`);
    });
});
