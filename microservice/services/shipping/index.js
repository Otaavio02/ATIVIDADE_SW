//importa a bilioteca gRPC para criar o arquivo .proto
const grpc = require('@grpc/proto-loader');

//importa a biblioteca para carregar o arquivo .proto
const protoLoader = require('@grpc/proto-loader');

//Carrega e processa o arquivo shipping.proto, que define o serviço e as mensagens
const packageDefinition = protoLoader.loadSync('proto/shipping.proto', {
    keepCase: true, //mantem os nomes dos campos como estão no .proto
    longs: String, //converte tipos longos para String
    enums: String, //converte enums para String
    arrays: true //Interpreta campos repeated como arrays
});

//carrega o pacote grpc com base na definição
const shippingProto = grpc.loadPackageDefinition(packageDefinition);

//cria uma nova instância do servidor grpc
const server = new grpc.Server();

//Adiciona o serviço ShippingService ao servidor, implementando o método GetShippingRate
server.addService(shippingProto.ShippingService.service, {
    //implementação da função GetShippingRate
    //Simula um valor de frete gerando um numéro aleatório entre 1 e 100
    GetShippingRate: (_, callback) => {
        const shippingValue = Math.random() * 100 + 1; //valor aleatório de R$1 a R$100

        //retorna o valor do frete ao cliente via callback
        callback(null, {
            value: shippingValue,
        });
    },
});

//define a porta e endereço onde o servidor grpc ficará listening (0.0.0.0 permite conexões externas)
server.bindAsync('0.0.0.0:3001', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Shipping Service running at http:127.0.0.1:3001');
    server.start(); //inicia o servidor
});