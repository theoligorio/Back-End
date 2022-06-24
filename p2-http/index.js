// https://nodejs.org/dist/latest-v16.x/docs/api/synopsis.html

const http = require('http');
const port = 3500;

const server = http.createServer( (req,res)  => {
    res.end("Página Inicial do Servidor NodeJS")
});

server.listen(port, () => {
    console.log(`Servidor Iniciado na porta ${port}: http://localhost:${port}`)
})