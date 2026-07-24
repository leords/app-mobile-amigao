

export const EnviarPedidoGateway = async (pedidos) => {
    const URL_API_GATEWAY = process.env.EXPO_PUBLIC_URL_API_GATEWAY
    try {
        const response = await fetch(URL_API_GATEWAY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pedidos: pedidos }),
      });

      const json = await response.json(); // <- agora pega objeto, não texto

      return json
        
    } catch (error) {
        console.log("Erro ao enviar para gateway:", error)
        throw error
    }

}