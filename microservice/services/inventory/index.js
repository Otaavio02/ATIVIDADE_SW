//importa a biblioteca gRPC para node.js
const grpc = require('@grpc/grpc-js');

//importa a biblioteca que carrega arquivos .proto (interface do serviço gRPC)
const protoLoader = require('@grpc/proto-loader');

//importa a lista de produtos de um arquivo JSON local
const products = require('./products.json');

//carrega a definição do protocolo gRPC do arquivo .proto
const packageDefinition = protoLoader.loadSync('proto/inventory.proto', {
    keepCase: true, //mantém o estilo de case original do .proto
    longs: String, //converte valores longos para strings
    enums: String, //converte enums para strings
    arrays: true //garante que campos repetidos sejam arrays
});

//constroi o objeto do pacote gRPC a partir da definição carregada
const inventoryProto = grpc.loadPackageDefinition(packageDefinition);

//cria um novo servidor gRPC
const server = new grpc.Server();

//registra o serviço InventoryService no servidor, implementando seus métodos
server.addService(inventoryProto.InventoryService.service, {
    //implementação do método searchAllProducts
    //esse metodo ignora o request (_) e retorna a lista de produtos
    searchAllProducts: (_, callback) => {
        callback(null, {
            products: products, //retorna todos os produtos carregados do JSON
        });
    },

    SearchProductByID: (payload, callback) => {
    const product = products.find((product) => product.id == payload.request.id);
    callback(null, product);
},
});

//inicia o servidor gRPC na porta 3002 e exibe uma mensagem de status no console
server.bindAsync('127.0.0.1:3002', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Inventory Service running at http://127.0.0.1:3002');
    server.start(); //inicia o servidor gRPC
});