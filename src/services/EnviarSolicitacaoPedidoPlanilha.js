import Constants from "expo-constants";

export const EnviarSolicitacaoPedidoPlanilha = async (pedidos) => {
  const URL_API_NOVO_PEDIDO = process.env.EXPO_PUBLIC_URL_API_NOVO_PEDIDO

  try {
    const response = await fetch(URL_API_NOVO_PEDIDO, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pedidos,
        action: "criarPedido",
      }),
    });

    console.log("URL: ", process.env.EXPO_PUBLIC_URL_API_NOVO_PEDIDO);

    const json = await response.json(); // <- agora pega objeto, não texto
    console.log(json);

    return json; // retorna o objeto { ok: true, message: "OK" }
  } catch (error) {
    console.error("Erro ao enviar para planilha:", error);
    throw error;
  }
};
