var funcDiscount = require("./modules/calDiscount")

console.log("Olá Senac");

var client = 'Senac Campinas';

console.log(`Cliente: ${client}`);

var valProduct = 100;
var valDiscount = 37;

var finalValue = funcDiscount(valProduct, valDiscount)

console.log(`Valor do Produto com Desconto: R$ ${finalValue}`)