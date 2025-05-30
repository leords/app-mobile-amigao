// reformular a função para que a mesma seja generica para qualquer busca no storage;
export const buscarStorage = async () => {
  try {
    const dados = await AsyncStorage.getItem("@pedidos");
    return dados ? JSON.parse(dados) : [];
  } catch (error) {
    console.error("Erro ao buscar pedidos do storage:", error);
    return [];
  }
};
