import { buscarStorage } from "../storage/ControladorStorage";
import { EnviarSolicitacaoApagarPedidoPlanilha } from "./EnviarSolicitacaoApagarPedidoPlanilha";

export const DescargaPedidosApagados = async () => {
  // buscar os pedidos lineares deletado
  const pedidosApagados = await buscarStorage("@pedidosLinearesDeletados");

  //separar pedidos entre já enviados e não enviados
  const pedidosApagadosNaoEnviados = pedidosApagados.filter((p) => !p.enviado);
  const pedidosApagadorEnviados = pedidosApagados.filter((p) => p.enviado);

  const linhasParaEnviar = pedidosApagadorEnviados.map((p) => p.linhaFinal);

  // validando se tem pedidos não enviados.
  if (linhasParaEnviar.length > 0) {
    try {
      console.log(`Enviando ${pedidosApagadosNaoEnviados.length} pedidos...`);
      // enviando para a requisição
      await EnviarSolicitacaoApagarPedidoPlanilha(pedidosApagadosNaoEnviados);

      // marca todos os pedidos do array pedidosNaoEnviados como enviados.
      const marcados = pedidosApagadosNaoEnviados.map((p) => ({
        ...p,
        enviado: true,
      }));
      // criando um novo array com todos os pedidos, independente do status de enviado ou não.
      const todos = [...pedidosApagadorEnviados, ...marcados];

      // salvando novamente no storage de pedidosLineares todos os pedidos
      await salvarStorage("@pedidosLinearesDeletados", todos);
      Alert.alert("Pedidos enviados com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar pedidos:", error);
      Alert.alert("Erro ao enviar alguns pedidos.");
    }
  } else {
    Alert.alert("Nenhum pedido novo para enviar.");
  }
};
