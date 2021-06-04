const { json } = require('express');
const jwt = require('jsonwebtoken');
//define a lista de rotas públicas da aplicação
const rotasPublicas = [
    {
        url: '/api/login',
        metodo: 'POST'
    },
    {
        url:'/api/docs/*',
        metodo: 'GET'
    },
    {
        url: '/api/usuario',
        metodo: 'POST'
    }
    
]

module.exports = (req, res, next) => {
    req.logger.info('verificando permissão de acesso a rota', `rota=${req.url}`);

    req.logger.debug(JSON.stringify(req.headers));
    //verifica se a requisição recebida é de alguma rota pública
    const rotaPublica = rotasPublicas.find(rota => {
        const rotaPublicaContemWidcard = rota.url.indexOf('*') !== -1;
        const urlRequisicaoContemParteDaRotaPublica = req.url.indexOf(rota.url.replace('*', '')) !== -1

        return (
            rota.url === req.url
            || (
                rotaPublicaContemWidcard
                && urlRequisicaoContemParteDaRotaPublica
            )
        ) 
        && rota.metodo === req.method.toUpperCase()
    });
    if(rotaPublica){
        req.logger.info('rota pública, requisição liberada');
        return next();
    }
    const authorization = req.headers.authorization;
    if(!authorization){
        req.logger.info('acesso negado, sem header de autorização');
        return res.status(401).json({
            status: 401,
            erro: 'acesso negado, você precisa enviar o header authorization'
        });
    }

    const token = authorization.substr(7);
    if(!token){
        req.logger.info('requisição sem token de acesso');
        return res.status(401).json({
            status:401,
            erro: 'acesso negado, o token de acesso não foi informado!'
        });

       
    }

     //verificar se o token é válido e foi gerado usando nossa chave secreta
     jwt.verify(token, process.env.CHAVE_SECRETA_JWT, (err, decoded) => {
         if(err){
             req.logger.error('Erro ao decodificar o token jwt', `token=${token}`);
             return res.status(401).json({
                 status: 401,
                 erro: 'acesso negado, problema ao decodificar o seu token de autorização'
             });
         }
         req.logger.debug('token jwt decodificado', `idUsuario=${decoded._id}`);
         //carregar o usuario a partir do banco de dados
         const usuario = {
             id: decoded._id
         }
         //atribui a p´roppriedade usuario da requisição quem é o usuario autenticado
         req.usuario = usuario;
         next();
     });

}