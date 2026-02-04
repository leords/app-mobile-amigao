import { salvarStorage } from "../storage/ControladorStorage";
import Constants from "expo-constants";

export const buscarProdutosDaAPI = async (setProdutos) => {
  const URL_PRODUTOS = process.env.EXPO_PUBLIC_URL_PRODUTOS

  try {
    const response = await fetch(URL_PRODUTOS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (Array.isArray(data.saida)) {
      await salvarStorage("@produtos", data.saida);
      setProdutos(data.saida);
    } else {
      console.warn("Resposta inesperada:", data);
    }
  } catch (error) {
    console.error("Erro ao buscar produtos da API:", error);
  }
};
