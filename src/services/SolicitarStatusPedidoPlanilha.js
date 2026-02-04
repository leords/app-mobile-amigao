import Constants from "expo-constants";

export const SolicitarStatusPedidoPlanilha = async (idsPedidos) => {
  const URL_API_STATUS_PEDIDO = process.env.EXPO_PUBLIC_URL_API_STATUS_PEDIDO
  try {
    const response = await fetch(URL_API_STATUS_PEDIDO, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Aqui enviamos um objeto com:
      // - action = indica qual operação queremos na API
      // - ids = lista de IDs dos pedidos (não enviamos os pedidos completos!)
      body: JSON.stringify({
        ids: idsPedidos,
        action: "statusPedidos",
      }),
    });

    const json = await response.json(); // <- agora pega objeto, não texto
    console.log("Retorno da API de status:", json);

    // Retorna para quem chamou (DescargaPedido)
    // Esperado algo do tipo:
    // {
    //   ok: true,
    //   encontrados: [
    //     { id: "abc123", encontrado: true },
    //     { id: "xyz789", encontrado: false }
    //   ]
    // }
    return json;
  } catch (error) {
    console.error("Erro ao enviar para planilha:", error);
    throw error;
  }
};
