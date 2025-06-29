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

//Cria o cliente gRPC a partir da definição de serviço carregada
const ShippingService = grpc.loadPackageDefinition(packageDefinition).ShippingService;

//Instancia o cliente gRPC conectado ao serviço de frete na porta 3001
const client = new ShippingService('127.0.0.1:3001', grpc.credentials.createInsecure());