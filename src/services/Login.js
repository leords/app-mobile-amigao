import Constants from "expo-constants";
import {
  buscarStorage,
  removerStorage,
  salvarStorage,
} from "../storage/ControladorStorage";

export const Login = async (usuario, senha) => {
  const { URL_API_LOGIN } = Constants.expoConfig.extra;

  try {
    const response = await fetch(URL_API_LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuario, senha }),
    });

    const texto = await response.text();
    console.log("Resposta da API", texto);

    if (texto === "ok") {
      const usuarioLogado = { nome: usuario };
      await salvarStorage("@user", usuarioLogado.nome);
      return { status: "ok", usuarioLogado };
    } else {
      await removerStorage("@user");
      return { status: "erro", message: "Usuário não encontrado" };
    }
  } catch (error) {
    return { status: "erro", message: "Erro de comunicação com o servidor" };
  }
};
