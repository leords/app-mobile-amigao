import AsyncStorage from "@react-native-async-storage/async-storage";
import { ObterLocalizacaoAtual } from "../services/ObterLocalizacaoAtual";
import { dataFormatada } from "./Data";

export const GpsCliente = async (pedidoFinal) => {
  try {
    //pegando as coordenadas do momento.
    const localizacao = await ObterLocalizacaoAtual();

    //validando se existe localizacao
    if (!localizacao) {
      console.warn("Localização não disponivel!");
      return;
    }
    //pegando o cliente do pedido
    const nomeCliente = pedidoFinal?.cabecalho?.[1] || "Cliente desconhecido";

    //criando um novo array com os dados = [cliente, dados de localização, data]
    const novoGPS = [
      nomeCliente,
      localizacao.latitude,
      localizacao.longitude,
      dataFormatada(),
    ];

    //pegando os dados do storage de gps
    const DadosGPS = JSON.parse(await AsyncStorage.getItem("@gps")) || [];
    //passando o novo gps
    await AsyncStorage.setItem("@gps", JSON.stringify([...DadosGPS, novoGPS]));
  } catch (error) {
    console.error("Erro ao salvar localização:", error);
  }
};
