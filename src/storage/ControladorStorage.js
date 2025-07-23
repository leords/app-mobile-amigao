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
  if (novoPedido instanceof Promise) {
    throw new Error("Não é permitido adicionar uma Promise ao storage.");
  }
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

export const removerPedidoPorIndiceDoStorage = async (indice) => {
  try {
    const pedidos = await buscarStorage("@pedidos");
    const pedidosLineares = await buscarStorage("@pedidosLineares");
    console.log("Lineares", pedidosLineares);

    if (!pedidos || pedidos.length === 0) {
      console.log("Nenhum pedido encontrado.");
      return;
    }

    console.log("indice", indice);

    if (indice < 0 || indice >= pedidos.length) {
      console.warn("Índice inválido.");
      console.log("Índice inválido.");
      return;
    }

    // (_, i) => i !== indice = callback do filter

    //criando array novo sem o array do index passado e atualiando os storage
    const pedidosAtualizados = pedidos.filter((_, i) => i !== indice);
    await salvarStorage("@pedidos", pedidosAtualizados);

    const pedidosLinearesAtualizados = pedidosLineares.filter(
      (_, i) => i !== indice
    );
    await salvarStorage("@pedidosLineares", pedidosLinearesAtualizados);

    // em ultimos caso, caso haver apenas 1 pedido na lista no momento de deletar o pedido, apagar o storage inteiro!!!!!

    //cria um historico de pedidos que foram deletados.
    const pedidosDeletadosAnteriores = await buscarStorage("@pedidosDeletados");
    const pedidoDeletado = pedidos.filter((_, i) => i === indice);
    const novosDeletados = [...pedidosDeletadosAnteriores, ...pedidoDeletado];

    // atualiza lista de pedidosDeletados com array novo
    await salvarStorage("@pedidosDeletados", novosDeletados);

    //cria um historico de pedidos lineares que foram deletados.
    const pedidosLinearesDeletadosAnteriores = await buscarStorage(
      "@pedidosLinearesDeletados"
    );
    const pedidoLinearDeletado = pedidosLineares.filter((_, i) => i === indice);
    const novosLinearesDeletados = [
      ...pedidosLinearesDeletadosAnteriores,
      ...pedidoLinearDeletado,
    ];

    // atualiza lista de pedidosLinearesDeletados com array novo
    await salvarStorage("@pedidosLinearesDeletados", novosLinearesDeletados);

    console.log("Pedido deletado com sucesso.");
  } catch (error) {
    console.error("Erro ao deletar o pedido", error);
  }
};
