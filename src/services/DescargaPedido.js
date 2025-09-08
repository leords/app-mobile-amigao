import { Alert } from "react-native";
import { EnviarSolicitacaoPedidoPlanilha } from "./EnviarSolicitacaoPedidoPlanilha";
import { buscarStorage, salvarStorage } from "../storage/ControladorStorage";

/**
 * Função robusta para enviar pedidos para a planilha do Google Sheets
 * - Garante que pedidos enviados sejam marcados como 'enviado'
 * - Mantém ordem original
 * - Evita duplicatas
 * - Tenta enviar em lote, mas preserva pedidos não enviados se houver falha
 */
export const DescargaPedido = async () => {
  console.log("[DescargaPedido] Iniciando processo de envio...");

  // Busca todos os pedidos armazenados no AsyncStorage
  const pedidos = await buscarStorage("@pedidosLineares");
  console.log(
    "[DescargaPedido] Pedidos encontrados no storage:",
    pedidos?.length
  );

  if (!pedidos || pedidos.length === 0) {
    console.log("[DescargaPedido] Nenhum pedido novo para enviar.");
    Alert.alert("Nenhum pedido novo para enviar.");
    return;
  }

  // Filtra apenas os pedidos que ainda não foram enviados
  const pedidosNaoEnviados = pedidos.filter((p) => !p.meta.enviado);
  console.log(
    "[DescargaPedido] Pedidos não enviados:",
    pedidosNaoEnviados.map((p) => p.meta.id)
  );

  if (pedidosNaoEnviados.length === 0) {
    console.log("[DescargaPedido] Todos os pedidos já foram enviados.");
    Alert.alert("Nenhum pedido novo para enviar.");
    return;
  }

  try {
    console.log(
      `[DescargaPedido] Tentando enviar ${pedidosNaoEnviados.length} pedidos...`
    );
    const dadosParaEnvio = pedidosNaoEnviados.map((p) => p.dados);

    console.log("[DescargaPedido] Dados para envio:", dadosParaEnvio);

    const retornoAPI = await EnviarSolicitacaoPedidoPlanilha(dadosParaEnvio);

    console.log("[DescargaPedido] Retorno da API:", retornoAPI);

    if (retornoAPI.ok) {
      // Marca os pedidos como enviados
      const pedidosAtualizados = pedidos.map((p) =>
        pedidosNaoEnviados.some((n) => n.meta.id === p.meta.id)
          ? { ...p, meta: { ...p.meta, enviado: true } }
          : p
      );
      console.log(
        "[DescargaPedido] Atualizando pedidos como enviados:",
        pedidosNaoEnviados.map((p) => p.meta.id)
      );
      await salvarStorage("@pedidosLineares", pedidosAtualizados);
      console.log(
        "[DescargaPedido] Pedidos marcados como enviados com sucesso."
      );
      Alert.alert(
        "Sucesso",
        `${pedidosNaoEnviados.length} pedido(s) enviados com sucesso.`
      );
    } else {
      console.log(
        "[DescargaPedido] Erro ao enviar pedidos para API:",
        retornoAPI
      );
      Alert.alert(
        "Erro ao enviar pedidos",
        retornoAPI.message || "Erro desconhecido."
      );
    }
  } catch (error) {
    console.error("[DescargaPedido] Erro inesperado ao enviar pedidos:", error);
    Alert.alert(
      "Erro",
      "Falha ao enviar pedidos. Nenhum pedido foi marcado como enviado."
    );
  }
};
