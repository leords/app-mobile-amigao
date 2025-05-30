import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentLocation } from "../services/getCurrentLocation";
import { pegarDataHoraAtual } from "./date";

export const GpsCliente = async (pedidoFinal) => {
  try {
    // pegando as coordenadas do momento.
    const location = await getCurrentLocation();

    // validando se existe location
    if (!location) {
      console.warn("Localização não disponivel!");
      return;
    }
    // pegando o cliente do pedido
    const clientName = pedidoFinal?.cabecalho?.[1] || "Cliente desconhecido";

    // criando um array com os dados = [cliente, dados de localização, data]
    const newEntry = [
      clientName,
      location.latitude,
      location.longitude,
      pegarDataHoraAtual(),
    ];

    //pegando o storage de gps
    const existingData = JSON.parse(await AsyncStorage.getItem("@gps")) || [];
    // setando o novo array junto com os antigo
    await AsyncStorage.setItem(
      "@gps",
      JSON.stringify([...existingData, newEntry])
    );
  } catch (error) {
    console.error("Erro ao salvar localização:", error);
  }
};
