const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const app = express();
require('dotenv').config();
const User = require('./models/User');
const sendMail = require('./providers/mailProvider')
const { promisify } = require('util');
const { userCreateMailTemplate } = require('./template/userCreateMail')

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.get('/', function (req, res) {
    res.send('Serviço API Rest iniciada...');
});

app.get('/users', validarToken, async (req,res) => {
    await User.findAll({
        attributes: ['id', 'name', 'email', 'gender'],
        order: [['id', 'ASC']]
    })
    .then ((users) => {
        return res.json({
            erro: false,
            users
        });
    }).catch((err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} ou nenhum Usuário encontrado!!!`
        })
    })
})

app.get('/users/:id', async (req,res) => {
    const {id} = req.params;
    try {
        // await User.findAll({where: {id:id}}) (Pesquisa com uma condição)

        const users = await User.findByPk(id);
        if(!users){
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum usuário encontrado!!"
            })
        }res.status(200).json({
                erro:false,
                users
            })
    } catch (err) {
        res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err}`
        })
    }
});

app.post("/user", async (req, res) => {

    var dados = req.body;
    dados.password = await bcrypt.hash(dados.password, 8);

    await User.create(dados)
    .then( ()=>{
        /* enviar e-mail */
        let to = email;
        let cc = '';
        let subject = 'Sua conta foi criada com sucesso!';
        let mailBody = userCreateMailTemplate({
            name: dados.name,
            email: dados.email,
            gender: dados.gender
        })

        /* ************* */
        sendMail(to, cc, subject, mailBody);

        return res.json({
            erro: false,
            mensagem: 'Usuário cadastrado com sucesso!'
        });
    }).catch( (err)=>{
        return res.status(400).json({
            erro:true,
            mensagem: `Erro: Usuário não cadastrado... ${err}`
        })
    })
})

app.put("/user", async (req, res) => {
    const {id} = req.body;

    await User.update(req.body, {where: {id}})
    .then(() => {
        return res.json({
            erro: false,
            mensagem: "Usuário alterado com sucesso!!"
        })
    }).catch ((err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: Usuário não alterado.. ${err}`
        })
    })
})

app.delete("/user/:id", async (req, res) => {
    const { id } = req.params;
    await User.destroy({where: {id}})
    .then(() => {
        return res.json({
            erro: false,
            mensagem: "Usuário apagado com sucesso!"
        });
    }).catch ((err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} Usuário não apagado...`
        })
    })

})

app.post("/login", async (req, res)=>{
    const user = await User.findOne({
        attributes: ['id','name', 'email','gender','password'],
        where: {
            email: req.body.email
        }
})
if(user === null){
    return res.status(400).json({
        erro: true,
        mensagem: "Erro: Usuário ou senha incontrado"
    })
}
if(!(await bcrypt.compare(req.body.password, user.password))){
    return res.status(400).json({
        erro: true,
        mensagem:"Erro: Usuário ou senha incorreta!!!"
    })
}

var token = jwt.sign({ id: user.id}, process.env.SECRET, {
    expiresIn: 600 // 10min, '7d': 7 dias
});

return res.json({
    erro:false,
    mensagem: "Login realizado com sucesso",
    token
})
})

async function validarToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const [bearer, token] = authHeader.split(' ');

    if (!token){
        return res.status(400).json({
            erro: true,
            mensagem: 'Erro: Necessário realizar o login'
        });
    };

    try{
        const decoded = await promisify(jwt.verify)(token, process.env.SECRET)
        req.userId = decoded.id;
        console.log(req.userId);

        return next();
    } catch(err) {
        if(err){
            return res.status(400).json({
                erro: true,
                mensagem: `Erro: ${err}`
            })
        } else {
            return res.status(401).json({
                erro: true,
                mensagem: `Erro: Necessário realizar o login!`
            })
        }
    }

    // return res.json({mensagem: authHeader});
    // return next ();
    // return res.json({mensagem:'Validar Token!!'})
}

app.put('/user-senha', async (req, res) => {
    const {id, password} = req.body;
    var senhaCrypt = await bcrypt.hash(password, 8)

    await User.update({password: senhaCrypt}, {where: {id: id}})
    .then(() => {
        return res.json ({
            erro: false,
            mensagem: "Senha editada com sucesso"
        });
    }).catch( (err) => {
            return res.status(400).json({
                erro: true,
                mensagem: `Erro: ${err}... A senha não foi alterada!!!`
            })
        })
});

app.listen(process.env.PORT,() => {
    console.log(`Servico iniciado na porta ${process.env.PORT} http://localhost:${process.env.PORT}`);
});

