import { removerStorage, buscarStorage } from "../storage/ControladorStorage";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const limparStorageComCarga = async () => {
  const chaves = [
    "@pedidosLineares",
    "@pedidos",
    "@clientes",
    "@pedidosLinearesDeletados", //
    "@pedidosDeletados", //
    "@cadastro",
  ];

  try {
    for (const chave of chaves) {
      await removerStorage(chave);
      console.log(`Removida a chave: ${chave}`);
      await delay(100);
    }

    // resultado cria um array com as promessas de 'Promise.all' e faz um map de chaves chamando buscarStorage passando chave por parametro.
    const resultados = await Promise.all(
      chaves.map((chave) => buscarStorage(chave))
    );
    // every = testa todos os elementos do array que todos sejam null, assim retornando true! obs: caso 1 deles não seja null, ele retornaria false.
    const todasRemovidas = resultados.every(
      (item) => item === null || (Array.isArray(item) && item.length === 0)
    );

    if (todasRemovidas) {
      console.log("Carga realizada com sucesso!");
      //Alert.alert("Carga em andanmento!");
    } else {
      console.log(resultados);
      console.warn("Algumas chaves não foram removidas!");
      throw new Error("Nem todas as chaves foram removidas corretamente.");
    }
  } catch (error) {
    throw new Error(`Erro na remoção/verificação das chaves: ${error.message}`);
  }
};
