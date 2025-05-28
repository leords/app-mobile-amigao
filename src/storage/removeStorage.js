import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

//Esta função espera o local do storage tipo string = ex: '@pedidos'
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
