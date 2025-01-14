// models/usuariosModel.js
import { connectToDatabase } from '../config/dbConfig';
import bcrypt from 'bcrypt';

class UsuarioModel {
    async cadastrarUsuario(nome, dataNascimento, email, senha) {
        const pool = await connectToDatabase();
        try {
            const query = `
            INSERT INTO usuarios (nome, email, senha, DataNascimento)
            VALUES (@nome, @email, @senha, @DataNascimento)
            `;
            const result = await pool.request()
                .input('nome', nome)
                .input('dataNascimento', dataNascimento)
                .input('email', email)
                .input('senha', senha)
                .query(query);
            return result.rowsAffected;
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            throw new Error('Erro ao cadastrar usuário.');
        }
    }

    async login(email, senha) {
        const pool = await connectToDatabase();
        try {
            const usuario = await this.buscarUsuarioPorEmail(email);
            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                throw new Error('Senha incorreta');
            }

            return usuario;
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            throw new Error('Erro ao fazer login.');
        }
    }

    async buscarUsuarioPorEmail(email) {
        const pool = await connectToDatabase();
        try {
            const query = 'SELECT * FROM usuarios WHERE email = @email;';
            const result = await pool.request()
                .input('email', email)
                .query(query);
            return result.recordset[0];
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            throw new Error('Erro ao buscar usuário.');
        }
    }

    async atualizarSenha(id, novaSenha) {
        const pool = await connectToDatabase();
        try {
            const query = 'UPDATE usuarios SET senha = @novaSenha WHERE id = @id;';
            await pool.request()
                .input('id', id)
                .input('novaSenha', novaSenha)
                .query(query);
        } catch (error) {
            console.error('Erro ao atualizar senha:', error);
            throw new Error('Erro ao atualizar senha.');
        }
    }

    async deletarUsuario(id) {
        const pool = await connectToDatabase();
        try {
            const query = 'DELETE FROM usuarios WHERE id = @id;';
            const result = await pool.request()
                .input('id', id)
                .query(query);
            return result;
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            throw new Error('Erro ao deletar usuário.');
        }
    }

    async definirCodigoRecuperacao(email, codigoRecuperacao) {
        const pool = await connectToDatabase();
        try {
            const query = 'UPDATE usuarios SET codigo_recuperacao = @codigoRecuperacao WHERE email = @Email;';
            await pool.request()
                .input('codigoRecuperacao', codigoRecuperacao)
                .input('email', email)
                .query(query);
        } catch (error) {
            console.error('Erro ao definir código de recuperação:', error);
            throw new Error('Erro ao definir código de recuperação.');
        }
    }
}

export default new UsuarioModel();
