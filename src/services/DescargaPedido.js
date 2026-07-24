import { Alert } from "react-native";
import { buscarStorage, salvarStorage } from "../storage/ControladorStorage";
import { DescargaGPS } from "../services/DescargaGPS";
import { EnviarPedidoGateway } from "./EnviarPedidoGateway";

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
    const pedidos = await buscarStorage("@pedidosLineares");

    // Verifica se existe algum pedido
    if (!pedidos || pedidos.length === 0) {
      Alert.alert("Nenhum pedido novo para enviar.");
      return;
    }
    // opções de status: enviado | digitado | pendente
    // Pega apenas pedidos que não estão como "enviado"
    const pedidosNaoEnviados = pedidos.filter((p) => p.meta.status !== "enviado");

    if (pedidosNaoEnviados.length === 0) {
      Alert.alert("Nenhum pedido novo para enviar.");
      return;
    }

    console.log("Pedidos para enviar: ", pedidosNaoEnviados.length);

    try {

      // Envia para a API que valida e salva na planilha

      const retornoAPI = await EnviarPedidoGateway(pedidosNaoEnviados);

      console.log('Retorno da API:', retornoAPI)

      // Descarrega o array de GPS
      try {
        await DescargaGPS();
      } catch (gpsError) {
        console.log("Falha ao enviar GPS:", gpsError.message);
      }
      // -------------------------

      if (retornoAPI.sucesso && retornoAPI.resultado) {
        const { salvo = [], duplicado = [], falhou = [] } = retornoAPI.resultado;
        const { resumo } = retornoAPI;

        // Atualiza o status de cada pedido baseado no retorno da API
        const pedidosAtualizados = pedidos.map((p) => {
          const pedidoId = p.meta.id;

          // Se foi salvo com sucesso ou é duplicado (já existia)
          if (salvo.includes(pedidoId) || duplicado.includes(pedidoId)) {
            return {
              ...p,
              meta: {
                ...p.meta,
                status: "enviado",
              },
            };
          }

          // Se foi cancelado ou problemas ao salvar no sheets.
          if (falhou.includes(pedidoId)) {
            return {
              ...p,
              meta: {
                ...p.meta,
                status: "pendente",
              },
            };
          }

        
          return p;
        });

        await salvarStorage("@pedidosLineares", pedidosAtualizados);

        // Monta mensagem de sucesso detalhada
        let mensagem = `${resumo.salvos} pedido(s) enviado(s) com sucesso.`;
        
        if (resumo.duplicados > 0) {
          mensagem += `\n${resumo.duplicados} pedido(s) já existia(m) no sistema.`;
        }
        
        if (resumo.falharam > 0) {
          mensagem += `\n${resumo.falharam} pedido(s) falharam e serão reenviados na próxima descarga.`;
        }

        Alert.alert("Sucesso", mensagem);
      } else {
        Alert.alert(
          "Erro ao enviar pedidos",
          retornoAPI.message || "Erro desconhecido."
        );
      }
    } catch (error) {
      console.log("Erro no envio:", error);
      Alert.alert(
        "Erro",
        "Falha ao enviar pedidos. Tente novamente mais tarde."
      );
    }
  } finally {
    // Libera o lock
    isProcessing = false;
  }
};