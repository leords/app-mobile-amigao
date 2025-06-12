import React, { useEffect, useState, useRef } from "react";
import { ScrollView, StyleSheet } from "react-native";
import Cabecalho from "../components/Cabecalho";
import { PermissaoAcessoGaleria } from "../services/PermissaoAcessoGaleria";
import { buscarStorage } from "../storage/ControladorStorage";
import PedidoCard from "../components/PedidoCard";

export default function ListaPedido() {
  const [pedidos, setPedidos] = useState([]);
  const imagem = require("../assets/logo.png");

  useEffect(() => {
    async function carregarPedidos() {
      const dados = await buscarStorage("@pedidos");
      setPedidos(dados);
    }

    carregarPedidos();
  }, []);

  const refs = useRef([]); // array de refs para os pedidos

  const baixarImagem = async (index) => {
    console.log("entrei na baixar imagem");
    // ref de flatList dos pedidos.
    const viewRef = refs.current[index];
    // passando a viewRed para a função que valida a permissao e faz o download da imagem gerada!
    await PermissaoAcessoGaleria(viewRef);
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <Cabecalho
        onPress={() => " "}
        icone={""}
        descriptionIcone={""}
        image={imagem}
      />

      {pedidos.map((pedido, index) => (
        <PedidoCard
          key={`${pedido.rodape?.[1] ?? 0}-${index}`}
          pedido={pedido}
          index={index}
          refs={refs}
          baixarImagem={baixarImagem}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 10,
  },
  pedidoBox: {
    marginBottom: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cccbcb",
    padding: 10,
    backgroundColor: "white",
  },
  pedidoHeader: {
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
  colunaLabel: {
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
  tabelaTitulos: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  colunaTitulo: {
    fontSize: 8,
    paddingHorizontal: 5,
    color: "#494646",
  },
  itemLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "100%",
    padding: 4,
  },
  itemQtd: {
    fontSize: 12,
    width: "5%",
    color: "#494747",
  },
  itemNome: {
    fontSize: 12,
    width: "50%",
    color: "#494747",
  },
  itemPreco: {
    fontSize: 12,
    width: "18%",
    textAlign: "right",
    color: "#494747",
  },
  itemTotal: {
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
  resumoTexto: {
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
