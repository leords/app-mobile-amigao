import { Alert } from "react-native";
import { EnviarSolicitacaoPedidoPlanilha } from "./EnviarSolicitacaoPedidoPlanilha";
import { buscarStorage, salvarStorage } from "../storage/ControladorStorage";
import { SolicitarStatusPedidoPlanilha } from "./SolicitarStatusPedidoPlanilha";
import { DescargaGPS } from "../services/DescargaGPS";

// Flag global para prevenir execução simultânea
let isProcessing = false;

export const DescargaPedido = async () => {
  // Previne múltiplas execuções simultâneas
  if (isProcessing) {
    console.log("Descarga já em andamento, aguarde...");
    return;
  }

  isProcessing = true;

  try {
    console.log("Iniciando processo de envio...");

    // Busca todos os pedidos armazenados no AsyncStorage
    let pedidos = await buscarStorage("@pedidosLineares");

    // Verifica se existe algum pedido
    if (!pedidos || pedidos.length === 0) {
      Alert.alert("Nenhum pedido novo para enviar.");
      return;
    }

    // Pega apenas pedidos que não estão como "enviado"
    let pedidosNaoEnviados = pedidos.filter((p) => p.meta.status !== "enviado");

    if (pedidosNaoEnviados.length === 0) {
      Alert.alert("Nenhum pedido novo para enviar.");
      return;
    }

    //------------------------------------------
    // ETAPA 1: Verificar os pedidos "pendentes"
    //------------------------------------------
    const pedidosPendentes = pedidosNaoEnviados.filter(
      (p) => p.meta.status === "pendente"
    );

    if (pedidosPendentes.length > 0) {
      console.log("Pedidos pendentes: ", pedidosPendentes.length);
      try {
        // Consulta na planilha se esses ID já estão no histórico de hoje
        const retorno = await SolicitarStatusPedidoPlanilha(
          pedidosPendentes.map((p) => p.meta.id)
        );

        const pedidosAtualizados = pedidos.map((p) => {
          const status = retorno.encontrados.find((r) => r.id === p.meta.id);

          if (status) {
            if (status.encontrado) {
              return {
                ...p,
                meta: {
                  ...p.meta,
                  status: "enviado",
                },
              };
            } else {
              // Não encontrado -> marca como digitado para reenvio
              return {
                ...p,
                meta: {
                  ...p.meta,
                  status: "digitado",
                },
              };
            }
          }

          return p;
        });

        await salvarStorage("@pedidosLineares", pedidosAtualizados);
        console.log("Pendentes processados", retorno);

        // 🔥 IMPORTANTE: Recarrega os pedidos atualizados
        pedidos = pedidosAtualizados;
        pedidosNaoEnviados = pedidos.filter((p) => p.meta.status !== "enviado");
      } catch (error) {
        console.log("Erro ao verificar pendentes:", error);
      }
    }

    // ------------------------------------
    // ETAPA 2: Enviar pedidos "digitados"
    // ------------------------------------
    // 🔥 IMPORTANTE: Filtra novamente dos pedidos atualizados
    const pedidosDigitados = pedidosNaoEnviados.filter(
      (p) => p.meta.status === "digitado"
    );

    if (pedidosDigitados.length === 0) {
      console.log("Nenhum pedido digitado para enviar.");
      return;
    }

    console.log("Pedidos digitados para enviar: ", pedidosDigitados.length);

    try {
      // Pegando apenas a parte dos dados de cada pedido
      const dadosParaEnvio = pedidosDigitados.map((p) => p.dados);

      // Envia os pedidos para a API
      const retornoAPI = await EnviarSolicitacaoPedidoPlanilha(dadosParaEnvio);

      // Descarrega o array de GPS
      try {
        await DescargaGPS();
      } catch (gpsError) {
        console.log("Falha ao enviar GPS:", gpsError.message);
      }

      if (retornoAPI.ok) {
        // Marca os pedidos como enviados
        const pedidosAtualizados = pedidos.map((p) =>
          pedidosDigitados.some((d) => d.meta.id === p.meta.id)
            ? {
                ...p,
                meta: {
                  ...p.meta,
                  status: "enviado",
                },
              }
            : p
        );

        await salvarStorage("@pedidosLineares", pedidosAtualizados);
        Alert.alert(
          "Sucesso",
          `Seus ${pedidosDigitados.length} pedido(s) foram enviados com sucesso.`
        );
      } else {
        // Rollback para pendente
        const pedidosRollback = pedidos.map((p) =>
          pedidosDigitados.some((d) => d.meta.id === p.meta.id)
            ? {
                ...p,
                meta: {
                  ...p.meta,
                  status: "pendente",
                },
              }
            : p
        );

        await salvarStorage("@pedidosLineares", pedidosRollback);
        Alert.alert(
          "Erro ao enviar pedidos",
          retornoAPI.message || "Erro desconhecido."
        );
      }
    } catch (error) {
      // Rollback para pendente
      const rollback = pedidos.map((p) =>
        pedidosDigitados.some((d) => d.meta.id === p.meta.id)
          ? {
              ...p,
              meta: {
                ...p.meta,
                status: "pendente",
              },
            }
          : p
      );

      await salvarStorage("@pedidosLineares", rollback);
      Alert.alert(
        "Erro",
        "Falha ao enviar pedidos. Eles foram desmarcados e poderão ser reenviados na próxima tentativa."
      );
    }
  } finally {
    // Libera o lock
    isProcessing = false;
  }
};
