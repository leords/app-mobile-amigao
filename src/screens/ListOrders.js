import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";

export default function ListOrder() {
  const [pedidos, setPedidos] = useState([]);
  const image = require("../assets/logo.png");

  useEffect(() => {
    async function carregarPedidos() {
      const dados = await AsyncStorage.getItem("@pedidos");
      const lista = dados ? JSON.parse(dados) : [];
      setPedidos(lista);
    }

    carregarPedidos();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Header
        onPress={() => " "}
        icone={""} /* enviar o nome do icone a ser renderizado no header */
        descriptionIcone={""} /* enviar a descrição do botão */
        image={image} /* enviar a imagem */
      />

      {pedidos.map((pedido, index) => (
        <View key={index} style={styles.pedidoContainer}>
          <Text style={styles.NumPedido}>Nº: {index + 1}</Text>
          <Text style={styles.cliente}>
            Cliente: {pedido.cabecalho?.[1] ?? "Desconhecido"}
          </Text>

          {Array.isArray(pedido.itensPedido) &&
            pedido.itensPedido.map((item, i) => (
              <View key={i} style={styles.itemRow}>
                <Text style={styles.col1}>{item.quantidade}</Text>
                <Text style={styles.col2}>{item.nome}</Text>
                <Text style={styles.col3}>R$ {item.preco.toFixed(2)}</Text>
                <Text style={styles.col4}>R$ {item.total.toFixed(2)}</Text>
              </View>
            ))}

          <View style={styles.resumo}>
            <Text style={styles.pagamento}>
              PAGAMENTO: {pedido.rodape?.[3] ?? "Não informado"}
            </Text>
            <Text style={styles.pagamento}>
              TOTAL: R$ {(pedido.rodape?.[1]).toFixed(2) ?? "0,00"}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  reset: {
    color: "red",
    fontWeight: "bold",
    marginBottom: 16,
  },
  NumPedido: {
    textAlign: "right",
    fontSize: 12,
    marginRight: 5,
    color: "#494747",
  },
  pedidoContainer: {
    marginBottom: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cccbcb",
    padding: 10,
    backgroundColor: "white",
  },
  cliente: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 30,
    marginTop: 20,
    textAlign: "left",
    marginLeft: 20,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "100%",
    borderWidth: 1,
    borderRadius: 3,
    borderColor: "#eee6e6",
    padding: 4,
  },
  col1: {
    fontSize: 12,
    width: "5%",
    color: "#494747",
  },
  col2: {
    width: "50%",
    fontSize: 12,
    color: "#494747",
  },
  col3: {
    fontSize: 12,
    width: "18%",
    textAlign: "right",
    color: "#494747",
  },
  col4: {
    fontSize: 12,
    width: "20%",
    textAlign: "right",
    color: "#494747",
  },
  resumo: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 14,
  },
  pagamento: {
    fontSize: 13,
    fontWeight: "400",
    //color: '#494747'
  },
});
