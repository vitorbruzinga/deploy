// config/dbConfig.js
import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config(); // Carrega as variáveis de ambiente

const config = {
    user: process.env.DB_USER, // Use a variável de ambiente
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, // Use a variável de ambiente
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false, // Use true se você estiver se conectando ao Azure
        enableArithAbort: true
    }
};

async function connectToDatabase() {
    try {
        const pool = await sql.connect(config);
        console.log('Conexão com o banco de dados bem-sucedida');
        return pool;
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    }
}

export { connectToDatabase, sql };
