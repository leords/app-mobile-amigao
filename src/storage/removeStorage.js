import AsyncStorage from "@react-native-async-storage/async-storage";

//Esta função espera o local do storage tipo string = ex: '@pedidos'
export const ApagarStorage = async (localStorage) => {
  try {
    const dados = await AsyncStorage.getItem(localStorage);

    if (dados) {
      await AsyncStorage.removeItem(localStorage);
      return "Carga nos pedidos ok!";
    } else {
      return "Sua lista de pedido já está vazia!";
    }
  } catch (error) {
    throw new Error("Não foi possivel apagar os pedidos do dia ...");
  }
};
