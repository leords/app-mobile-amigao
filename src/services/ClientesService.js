import { salvarStorage } from "../storage/ControladorStorage";
import { pegarDiaSemanaHoje } from "../utils/Data";
import Constants from "expo-constants";

export const buscarClientesDaAPI = async (vendedor, setClientes) => {
  //const { URL_CLIENTES } = Constants.expoConfig.extra;
  const URL_CLIENTES = Constants.expoConfig.extra.URL_CLIENTES;
  try {
    // está puxando a base total do vendedor
    //const dia = pegarDiaSemanaHoje();
    const response = await fetch(URL_CLIENTES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vendedor }),
    });

    const data = await response.json();

    if (Array.isArray(data.saida)) {
      await salvarStorage("@clientes", data.saida);
      setClientes(data.saida);
    } else {
      console.warn("Resposta inesperada:", data);
    }
  } catch (error) {
    console.error("Erro ao buscar clientes da API:", error);
  }
};
