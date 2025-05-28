export const SendRequestSpreadsheet = async (pedidos) => {
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
    console.log("Resposta da planilha:", texto);
  } catch (err) {
    console.error("Erro ao enviar para planilha:", err);
  }
};
