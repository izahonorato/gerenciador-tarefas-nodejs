const HttpController = require('./HttpController');
const LoginService = require('../services/LoginService')

class LoginController extends HttpController{
    //sobrescreve o método da classe base HttpController.js
    configurarRotas(baseUrl){
        //define a rota e o manipulador da classe login
        //passando o método login como referência e informando que o contexto que deve ser
        //usado é do próprio objeto da classe LoginController.js
        this.express.post(`${baseUrl}/login`, this.login.bind(this));
    }

    login(req, res){
        //atribui op corpo da solicitação para a variável body
        const body = req.body;

        //valida se foi passado no body os campos de login e senha
        if(!body || !body.login || !body.senha){
            //retorna um erro para quem chamou a API
            return res.status(400).json({
                status: 400,
                erro: "Parâmetros de entrada inválidos"
            });
        }

        const service = new LoginService();
        const resultado = service.logar(body.login, body.senha);

        //devolve a resposta mockada do login em formato json
        res.json(resultado);
    }
}

module.exports = LoginController;