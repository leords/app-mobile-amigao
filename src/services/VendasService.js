import { buscarStorage } from "../storage/ControladorStorage";
import Constants from "expo-constants";

export const buscarVendasDaAPI = async (
  vendedor,
  setvendas,
  setLoading,
  setRecarregar,
  setErro
) => {
  const { URL_API_VENDAS } = Constants.expoConfig.extra;

  const userStorage = await buscarStorage("@user");

  try {
    console.log("Usuario logado: ", vendedor);
    console.log("Usuario Storage: ", userStorage);

    const response = await fetch(URL_API_VENDAS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vendedor }),
    });

    const data = await response.json();
    console.log("Resposta da API", data);

    if (Array.isArray(data.saida)) {
      setvendas(data.saida);
    } else {
      console.warn("Resposta inesperada:", data);
    }
  } catch (error) {
    console.error("Erro ao buscar vendas da API:", error);
    setErro("Erro ao carregar dados");
  } finally {
    setLoading(false);
    setRecarregar(true);
  }
};
