import Constants from "expo-constants";

export const buscarVendasDaAPI = async (
  vendedor,
  setvendas,
  setLoading,
  setRecarregar,
  setErro
) => {
  const { URL_API_VENDAS } = Constants.expoConfig.extra;

  try {
    const response = await fetch(URL_API_VENDAS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vendedor }),
    });

    const data = await response.json();

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
