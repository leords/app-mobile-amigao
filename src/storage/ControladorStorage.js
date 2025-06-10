import AsyncStorage from "@react-native-async-storage/async-storage";

// Buscar dados
export const buscarStorage = async (chave) => {
  try {
    const dados = await AsyncStorage.getItem(chave);
    return dados ? JSON.parse(dados) : [];
  } catch (error) {
    console.error(`Erro ao buscar dados da chave ${chave}`, error);
    return [];
  }
};
// Salvar dados
export const salvarStorage = async (chave, valor) => {
  try {
    await AsyncStorage.setItem(chave, JSON.stringify(valor));
  } catch (error) {
    console.error(`Erro ao salvar dados na chave ${chave}:`, error);
  }
};

// Remover dados
export const removerStorage = async (chave) => {
  try {
    await AsyncStorage.removeItem(chave);
  } catch (error) {
    console.error(`Erro ao remover a chave ${chave}:`, error);
  }
};

// Callback personalizado para pedidos.
// Esta é uma função de alta ordem (função que retorna outra função).
//
// Usa o conceito de "closure": a função interna lembra o ambiente onde foi criada.
// Ou seja, ao chamarmos:
//    const callback = criarCallbackAdicionarPedido(itens);
// o valor de `itens` é "lembrado" pela função retornada, mesmo depois que a função externa já terminou.
//
// Depois podemos fazer:
//    const novosItens = callback(pedidosAtuais);
// E isso funciona porque a função interna ainda "lembra" do `itens` que foi passado anteriormente.

export const criarCallbackAdicionarPedido = (novoPedido) => {
  return (listaAtual) => [...listaAtual, novoPedido];
};

export const atualizarStorage = async (chave, callback) => {
  try {
    const dadosAtuais = await buscarStorage(chave);
    const novosDados = callback(dadosAtuais);
    await salvarStorage(chave, novosDados);
  } catch (error) {
    console.error(`Erro ao atualizar a chave ${chave}:`, error);
  }
};
