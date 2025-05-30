import { Alert } from "react-native";

export const SendRequestGPSSpreadsheet = async (gps) => {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbxQsal1q3TaFkGBKdip92BJ7pZItT36-Xl4RmQ_-LVub7_2WZHspVMt4zQO3jShkn_7yQ/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gps }),
      }
    );

    const texto = await response.text();
    console.log("Resposta da planilha:", texto);

    if (texto.trim() !== "OK") {
      // Se não retornou OK, trata como erro
      throw new Error("Resposta da planilha não OK: " + texto);
    }
  } catch (err) {
    console.error("Erro ao enviar para planilha:", err);
    throw err; // relança o erro para o chamador tratar
  }
};
