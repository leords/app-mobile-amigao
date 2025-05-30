import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

//função que limpa storage, espera a chave por parametro.
export const ApagarStorage = async (localStorage) => {
  try {
    const dados = await AsyncStorage.getItem(localStorage);

    if (dados) {
      await AsyncStorage.removeItem(localStorage);
      Alert.alert("Carga nos pedidos ok!");
    } else {
      Alert.alert("Sua lista de pedido já está vazia!");
    }
  } catch (error) {
    throw new Error("Não foi possivel apagar os pedidos do dia ...");
  }
};
