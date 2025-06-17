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

    const texto = await response.text();
    Alert.alert(texto);
    console.log(texto);

    if (texto.trim() !== "OK") {
      // Se não retornou OK, trata como erro
      throw new Error("Resposta da planilha não OK: " + texto);
    }
  } catch (err) {
    console.error("Erro ao enviar para planilha:", err);
    throw err; // relança o erro para o chamador tratar
  }
};
