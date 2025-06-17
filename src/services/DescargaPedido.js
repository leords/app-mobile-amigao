import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EnviarSolicitacaoPedidoPlanilha } from "./EnviarSolicitacaoPedidoPlanilha";
import { buscarStorage, salvarStorage } from "../storage/ControladorStorage";

export const DescargaPedido = async () => {
  // busca pedidos salvos no storage
  const pedidos = await buscarStorage("@pedidosLineares");

  // separar pedidos
  const pedidosNaoEnviados = pedidos.filter((p) => !p.enviado);
  const pedidosEnviados = pedidos.filter((p) => p.enviado);

  //Ela extrai de cada objeto p (pedido) apenas o conteúdo que será enviado à planilha — que está armazenado no campo linhaFinal dentro de cada pedido.
  const linhasParaEnviar = pedidosNaoEnviados.map((p) => p.linhaFinal); // ou p.dadosPlanilha, como estiver nomeado

  // validando se tem pedidos não enviados.
  if (linhasParaEnviar.length > 0) {
    try {
      console.log(`Enviando ${pedidosNaoEnviados.length} pedidos...`);
      // enviando para a requisição
      await EnviarSolicitacaoPedidoPlanilha(pedidosNaoEnviados);

      // marca todos os pedidos do array pedidosNaoEnviados como enviados.
      const marcados = pedidosNaoEnviados.map((p) => ({
        ...p,
        enviado: true,
      }));
      // criando um novo array com todos os pedidos, independente do status de enviado ou não.
      const todos = [...pedidosEnviados, ...marcados];

      // salvando novamente no storage de pedidosLineares todos os pedidos
      await salvarStorage("@pedidosLineares", todos);
      Alert.alert("Pedidos enviados com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar pedidos:", error);
      Alert.alert("Erro ao enviar alguns pedidos.");
    }
  } else {
    Alert.alert("Nenhum pedido novo para enviar.");
  }
};
