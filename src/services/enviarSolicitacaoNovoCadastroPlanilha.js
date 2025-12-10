import Constants from "expo-constants";

export const enviarSolicitacaoNovoCadastroPlanilha = async (cadastro) => {
  const { URL_API_NOVO_CADASTRO } = Constants.expoConfig.extra;
  try {
    const response = await fetch(URL_API_NOVO_CADASTRO, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cadastro,
      }),
    });

    const json = await response.json(); // <- agora pega objeto, não texto

    return json; // retorna o objeto { ok: true, message: "OK" }
  } catch (error) {
    console.error("Erro ao enviar para planilha:", error);
    throw error;
  }
};
