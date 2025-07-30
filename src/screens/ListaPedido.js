import React, { useEffect, useState, useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Cabecalho from "../components/Cabecalho";
import { PermissaoAcessoGaleria } from "../services/PermissaoAcessoGaleria";
import {
  buscarStorage,
  removerPedidoPorIndiceDoStorage,
} from "../storage/ControladorStorage";
import PedidoCard from "../components/PedidoCard";

export default function ListaPedido() {
  const [pedidos, setPedidos] = useState([]);
  const [atualizar, setAtualizar] = useState(0);
  const imagem = require("../assets/logo.png");

  useEffect(() => {
    async function carregarPedidos() {
      const dados = await buscarStorage("@pedidos");
      setPedidos(dados);
    }

    carregarPedidos();
  }, [atualizar]);

  const referencias = useRef([]); // array de refs para os pedidos

  const baixarImagem = async (indice) => {
    const refView = referencias.current[indice];
    await PermissaoAcessoGaleria(refView);
  };

  const apagarPedido = async (index) => {
    if (index !== null) {
      await removerPedidoPorIndiceDoStorage(index);
      // está forma de atualiza, usando prev garante que pegamos o ultimo valor atualizado desse state!!!
      setAtualizar((prev) => prev + 1);
      /// continuar o processo para enviar para a planilha.
    } else {
      Alert.alert("Erro ao encontrar o pedido");
    }
  };

  return (
    <View style={estilos.container}>
      <Cabecalho
        onPress={() => " "}
        icone={""}
        descriptionIcone={""}
        image={imagem}
      />

      {pedidos ? (
        <ScrollView style={estilos.containerScroll}>
          {pedidos.map((pedido, indice) => {
            try {
              return (
                <PedidoCard
                  key={`${pedido.rodape?.[1] ?? 0}-${indice}`}
                  pedido={pedido}
                  index={indice}
                  refs={referencias}
                  baixarImagem={baixarImagem}
                  apagarPedido={apagarPedido}
                />
              );
            } catch (err) {
              console.error("Erro ao renderizar pedido:", err);
              return <Text>Erro no pedido #{indice}</Text>;
            }
          })}
        </ScrollView>
      ) : (
        <Text
          style={{
            textAlign: "center",
            marginTop: 60,
            fontSize: 16,
            fontWeight: 400,
          }}
        >
          Ops! Ainda não temos pedidos feitos hoje.
        </Text>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    height: "92%",
    padding: 16,
  },
  containerScroll: {
    padding: 2,
  },
  caixaPedido: {
    marginBottom: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cccbcb",
    padding: 10,
    backgroundColor: "white",
  },
  cabecalhoPedido: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  numeroPedido: {
    fontSize: 12,
    textAlign: "right",
    color: "#494747",
  },
  tituloNota: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
    color: "#494747",
    marginBottom: 4,
  },
  nomeEmpresa: {
    textAlign: "center",
    fontSize: 14,
    color: "#494747",
  },
  cnpj: {
    textAlign: "center",
    fontSize: 12,
    color: "#494747",
  },
  endereco: {
    textAlign: "center",
    fontSize: 10,
    color: "#494646",
    marginTop: 10,
    borderBottomWidth: 1,
    paddingBottom: 20,
    borderColor: "#cccbcb",
  },
  titulosColunas: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoColunas: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#cccbcb",
    marginBottom: 10,
  },
  etiquetaColuna: {
    fontSize: 10,
    marginVertical: 10,
    marginHorizontal: 5,
    color: "#494646",
  },
  infoColuna: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 10,
    marginHorizontal: 5,
  },
  titulosTabela: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  linhaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "100%",
    padding: 4,
  },
  qtdItem: {
    fontSize: 12,
    width: "5%",
    color: "#494747",
  },
  nomeItem: {
    fontSize: 12,
    width: "50%",
    color: "#494747",
  },
  precoItem: {
    fontSize: 12,
    width: "18%",
    textAlign: "right",
    color: "#494747",
  },
  totalItem: {
    fontSize: 12,
    width: "20%",
    textAlign: "right",
    color: "#494747",
  },
  resumoPedido: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    borderTopWidth: 1,
    borderColor: "#cccbcb",
    paddingTop: 10,
  },
  textoResumo: {
    fontSize: 12,
    color: "#494747",
  },
  acoesPedido: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingBottom: 5,
  },
});
