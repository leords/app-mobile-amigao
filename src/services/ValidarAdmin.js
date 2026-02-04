import { Alert } from "react-native";
import Constants from "expo-constants";

export const ValidarAdmin = async (usuario, senha) => {
  const URL_API_LOGIN= process.env.EXPO_PUBLIC_URL_API_LOGIN

  try {
    const response = await fetch(URL_API_LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuario, senha }),
    });

    const texto = await response.text();

    if (texto === "ok") {
      Alert.alert("Acesso admin liberado!");
      return { status: "ADMIN" };
    } else {
      Alert.alert("Acesso admin não liberado!");
      return { status: "erro", message: "Senha incorreta" };
    }
  } catch (error) {
    Alert.alert("erro", "Falha de comunicação com o servidor");
    return { status: "erro", message: "Falha de comunicação com o servidor" };
  }
};
