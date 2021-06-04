const jwt = require('jsonwebtoken')

class LoginService{
    logar(login, senha){
        //TODO: verificar se o usuário está cadastrado no banco de dados
        const usuario = {
            id: 1
        }
        //gera o token de acesso usando o jwt
        jwt.sign({
            _id: usuario.id
        }, process.env.CHAVE_SECRETA_JWT);
        //devolve as informações do usuário autenticado com o seu token de acesso
        return {
            id: 1,
            nome: 'Usuário x',
            email: login,
            token: 'token'
        }
    }
}

module.exports = LoginService;