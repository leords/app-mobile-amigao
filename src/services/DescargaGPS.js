import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EnviarSolicitacaoGPSPlanilha } from "./EnviarSolicitacaoGPSPlanilha";
import { salvarStorage } from "../storage/ControladorStorage";

export const DescargaGPS = async () => {
  // busca pedidos salvos no storage
  const listGPS = JSON.parse(await AsyncStorage.getItem("@gps")) || [];

  // separar pedidos
  const GPSNaoEnviados = listGPS.filter((p) => !p.enviado);
  const GPSEnviados = listGPS.filter((p) => p.enviado);

  // validando se tem pedidos não enviados.
  if (GPSNaoEnviados.length > 0) {
    try {
      console.log(`Enviando ${GPSNaoEnviados.length} pedidos...`);
      // enviando para a requisição
      await EnviarSolicitacaoGPSPlanilha(GPSNaoEnviados);

      // marca todos os pedidos do array pedidosNaoEnviados como enviados.
      const marcados = GPSNaoEnviados.map((p) => ({
        ...p,
        enviado: true,
      }));
      // criando um novo array com todos os pedidos, independente do status de enviado ou não.
      const todos = [...GPSEnviados, ...marcados];

      // salvando novamente no storage de pedidosLineares todos os pedidos
      //await AsyncStorage.setItem("@gps", JSON.stringify(todos));

      await salvarStorage("@gps", todos);

      Alert.alert("Pedidos enviados com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar GPS:", error);
      Alert.alert("Erro ao enviar alguns GPS.");
    }
  } else {
    Alert.alert("Nenhum GPS novo para enviar.");
  }
};
