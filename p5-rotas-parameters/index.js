
const express = require('express'); // Puxando a dependencia que foi instalada (package.json)

const app = express();
const port = 3333; // Porta padrão da web é 8080

app.use(express.json());

const contatos = ['André', 'Willy', 'Samuel', 'Richard'];

app.get("/", (req, res) => {
    res.send("App Iniciado!!!");
})

app.get("/contatos", (req, res) => {
    return res.json(contatos);
})

app.get("/users/:id", (req, res) => {
    const {id} = req.params;
    const {sit, vacinado} = req.query;   

 // console.log(id)
    return res.json({
        id,
        nome: "Théo",
        email: "theo@sp.senac.br",
        sit,
        vacinado
    })
});

app.post("/contatos", (req, res) => {
    const{nome} = req.body;
    contatos.push(nome);
    return res.json(contatos);
});

app.delete("/users/:id", (req, res) => {
    contatos.pop();
    return res.json(contatos)
})

app.listen(port, () => {
    console.log(`Servidor Iniciado na Porta ${port}`);
});