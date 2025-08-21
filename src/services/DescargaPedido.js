import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EnviarSolicitacaoPedidoPlanilha } from "./EnviarSolicitacaoPedidoPlanilha";
import { buscarStorage, salvarStorage } from "../storage/ControladorStorage";

export const DescargaPedido = async () => {
  const pedidos = await buscarStorage("@pedidosLineares");

  const pedidosNaoEnviados = pedidos.filter((p) => !p.enviado);
  const pedidosEnviados = pedidos.filter((p) => p.enviado);

  if (pedidosNaoEnviados.length > 0) {
    try {
      console.log(`Enviando ${pedidosNaoEnviados.length} pedidos...`);
      const retornoAPI = await EnviarSolicitacaoPedidoPlanilha(
        pedidosNaoEnviados
      );

      // Se a API retornar OK, marca os pedidos como enviados
      console.log("retorno da API: ", retornoAPI.message);
      if (retornoAPI.ok) {
        console.log("entrei em marcar pedidos");
        const marcados = pedidosNaoEnviados.map((p) => ({
          ...p,
          enviado: true,
        }));
        const todos = [...pedidosEnviados, ...marcados];
        await salvarStorage("@pedidosLineares", todos);
      } else {
        Alert.alert("Erro ao enviar pedidos", retornoAPI.message);
      }
    } catch (error) {
      console.error("Erro ao enviar pedidos:", error);
      Alert.alert("Erro ao enviar alguns pedidos.");
    }
  } else {
    Alert.alert("Nenhum pedido novo para enviar.");
  }
};
