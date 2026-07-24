import Constants from "expo-constants";

export const BuscarCNPJ = async (cnpj) => {
  const URL_API_CNPJ  = process.env.EXPO_PUBLIC_URL_API_CNPJ
  try {
    const response = await fetch(`${URL_API_CNPJ}${cnpj}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Erro na requisição");
    }

    const data = await response.json();

    if (response.status === 404) {
      throw new Error("CNPJ não encontrado");
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar CNPJ da API:", error);
    throw error;
  }
};
