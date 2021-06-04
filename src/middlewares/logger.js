module.exports = (req, res, next) => {
    const traceId = Math.random()*99999;
    const logger = {
        //exibe msgs de erro
        error: (mensagem, ...parametrosExtras) => {
            console.error(`[ERROR] traceId=${traceId}, msg=${mensagem}`, ...parametrosExtras);
        },
        //exibe msgs de depuração
        debug: (mensagem, ...parametrosExtras) => {
            console.log(`[DEBUG] traceId=${traceId}, msg=${mensagem}`, ...parametrosExtras);
        },
        //exibe msgs informativas
        info: (mensagem, ...parametrosExtras) => {
            console.info(`[INFO] traceId=${traceId}, msg=${mensagem}`, ...parametrosExtras);
        }
    }
    logger.info(`requisição recebida, url = ${req.url}. método http = ${req.method}`);
    req.logger = logger;
    next();
}