import AsyncStorage from "@react-native-async-storage/async-storage";

export const buscarPedidos = async () => {
  const dados = await AsyncStorage.getItem("@pedidos");
  return dados ? JSON.parse(dados) : [];
};
