import { Alert } from "react-native";

export const SendRequestOrderSpreadsheet = async (pedidos) => {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwQbDJGwPblkVDTlGu0FJf3RFvaWKnWEASZQlwE3qrQRnC94GTYk6wcy-oj9m042jMf/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pedidos }),
      }
    );

    const texto = await response.text();
    Alert.alert(texto);
    console.log(texto);

    if (texto.trim() !== "OK") {
      // Se não retornou OK, trata como erro
      Alert.alert(texto);
      throw new Error("Resposta da planilha não OK: " + texto);
    }
  } catch (err) {
    console.error("Erro ao enviar para planilha:", err);
    throw err; // relança o erro para o chamador tratar
  }
};
