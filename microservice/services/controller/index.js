//importa o framework web Express para criar rotas HTTP
const express = require('express');

//importa o cliente gRPC para o serviço de frete
const shipping = require('.shipping');

//importa o cliente gRPC para o serviço de produtos
const inventory = require('./inventory');

//importa middleware para permitir requisições cross-origin (CORS)
const cors = require('cors');

//inicializa o aplicativo Express
const app = express();

//aplica o middleware de CORS para permitir que o frontend em outro domínio consuma a API
app.use(cors());

/**
 * Retorna a lista de produtos da loja via InventoryService
 */
app.get('/products', (req, res, next) => {
    //chama o método gRPC SearchAllProducts do microsserviço de inventário
    inventory.SearchAllProducts(null, (err, data) => {
        if (err) {
            //se houver erro, loga no console e retorna erro HTTP 500
            console.error(err);
            res.status(500).send({ error: 'algo falhou :(' });
        } else {
            //se sucesso, responde com a lista de produtos no formato JSON
            res.json(data.products);
        }
    });
});

/**
 * Consulta o frete de envio no ShippingService
 */
app.get('/shipping/:cep', (req, res, next) => {
    //chama o método gRPC GetShippingRate, passando o CEP como parametro
    shipping.GetShippingRate(
        {
            cep: req.params.cep, //Pega o cep da URL
        },
        (err, data) => {
            if (err) {
                //em caso de erro, loga e retorna 500
                console.error(err);
                res.status(500).send({ error: 'algo falhou :(' });
            } else {
                //retorna o cep consultado e o valor do frete calculado
                res.json({
                    cep: req.params.cep,
                    value: data.value,
                });
            }
        }
    );
});

app.get('/product/:id', (req, res, next) => {
    inventory.SearchProductByID({ id: parseInt(req.params.id) }, (err, product) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'something failed :(' });
        } else {
            res.json(product);
        }
    });
});

/**
 * Inicia o router (rotas)
 */
app.listen(3000, () => {
    console.log('Serviço de Controller rodando em http://127.0.0.1:3000');
});