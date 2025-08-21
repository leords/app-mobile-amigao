import { Alert } from "react-native";
import Constants from "expo-constants";

export const EnviarSolicitacaoPedidoPlanilha = async (pedidos) => {
  const { URL_API_NOVO_PEDIDO } = Constants.expoConfig.extra;
  try {
    const response = await fetch(URL_API_NOVO_PEDIDO, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pedidos }),
    });

    const json = await response.json(); // <- agora pega objeto, não texto
    console.log(json);

    return json; // retorna o objeto { ok: true, message: "OK" }
  } catch (error) {
    console.error("Erro ao enviar para planilha:", error);
    throw error;
  }
};
