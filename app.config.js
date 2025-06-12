import "dotenv/config";

export default ({ config }) => ({
  ...config,
  extra: {
    URL_API_LOGIN: process.env.URL_API_LOGIN,
    URL_API_NOVO_PEDIDO: process.env.URL_API_NOVO_PEDIDO,
    URL_API_NOVO_GPS: process.env.URL_API_NOVO_GPS,
    URL_CLIENTES: process.env.URL_CLIENTES,
    URL_PRODUTOS: process.env.URL_PRODUTOS,
    URL_QR_CODE: process.env.URL_QR_CODE,
    URL_API_VENDAS: process.env.URL_API_VENDAS,
    URL_API_PEDIDOS_DELETADOS: process.env.URL_API_PEDIDOS_DELETADOS,
  },
});
