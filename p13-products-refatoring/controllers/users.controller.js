const User = require("../models/User");
const bcrypt = require('bcryptjs');
const sendMail = require('../Providers/mailProvider');

exports.findAll = async (req,res) => {
    await User.findAll({
        attributes: ['id', 'name', 'email', 'gender','password'],
        order:[['name', 'ASC']]
    })
    .then( (users) =>{
        return res.json({
            erro: false,
            users
        });
    }).catch( (err) => {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} nenhum usuário foi encontrado!!!`
        })
    })
};

exports.findOne = async (req,res) => {
    const { id } = req.params;
    try {
        // await Categories.findAll({ where: {id: id}})
        const users = await User.findByPk(id);
        if(!users){
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Nenhum usuário encontrado!"
            })
        }
        res.status(200).json({
            erro:false,
            users
        })
    } catch (err){
        res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err}`
        })
    }
};

exports.create = async (req,res) => {

    var dados = req.body;
    dados.password = await bcrypt.hash(dados.password, 8);
    let email = dados.email;
    let name = dados.name;
    let gender = dados.gender;

    await User.create(dados)
    .then( ()=>{
        let to = email;
        let cc = '';
        var htmlbody = "";
        htmlbody += '<div style="background-color:#000; margin-bottom:150px;">';
        htmlbody += '<div style="margin-top:150px;">';
        htmlbody += '<p style="color:#fff; font-weight:bold;margin-top:50px;">';
        htmlbody += 'Olá {name},';
        htmlbody += '</p>';
        htmlbody += '<p style="color:#fff; font-style:italic;margin-top:50px;">';
        htmlbody += 'Sua conta foi criada com sucesso!';
        htmlbody += '</p>';
        htmlbody += '<p style="color:#fff;margin-top:50px;">';
        htmlbody += 'Seu login é o seu email: {email}';
        htmlbody += '</p>';
        htmlbody += '<p style="color:#fff;margin-top:50px;">';
        htmlbody += 'Sexo: {gender}';
        htmlbody += '</p>';
        htmlbody += '</div>';
        htmlbody += '</div>';
        htmlbody = htmlbody.replace('{name}', name);
        htmlbody = htmlbody.replace('{email}', email);
        htmlbody = htmlbody.replace('{gender}', gender);

        sendMail(to, cc, 'Sua conta foi criada com sucesso!', htmlbody);

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
};

exports.update = async (req,res) => {
    const { id } = req.body;

    await User.update(req.body, {where: {id}})
    .then(() => {
        return res.json({
            erro:false,
            mensagem: 'Usuário alterado com sucesso!'
        })
    }).catch( (err) =>{
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: Usuário não alterado ...${err}`
        })
    })
};

exports.delete = async (req,res) => {
    const { id } = req.params;
    await User.destroy({ where: {id}})
    .then( () => {
        return res.json({
            erro: false,
            mensagem: "Usuário apagado com sucesso!"
        });
    }).catch( (err) =>{
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: ${err} Usuário não apagado...`
        });
    });
};

exports.findOne2 = async (req,res) => {
    const user = await User.findOne({
        attributes: ['id','name', 'email','gender','password'],
        where: {
            email: req.body.email
        }
})
if(user === null){
    return res.status(400).json({
        erro: true,
        mensagem: "Erro: Usuário ou senha incorreto"
    })
}
if(!(await bcrypt.compare(req.body.password, user.password))){
    return res.status(400).json({
        erro: true,
        mensagem:"Erro: Usuário ou senha incorreta!!!"
    })
}
return res.json({
    erro:false,
    mensagem: "Login realizado com sucesso",
    user
})
};

exports.update2 = async (req,res) => {
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
};