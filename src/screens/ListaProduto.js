import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Cabecalho from "../components/Cabecalho";
import { buscarProdutosDaAPI } from "../services/ProdutosService";
import { buscarStorage } from "../storage/ControladorStorage";

export default function ListaProduto() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);

  const imagem = require("../assets/vasilhames.png");

  useEffect(() => {
    carregarProdutosLocais();
  }, []);

  useEffect(() => {
    filtrarProdutos();
  }, [busca, produtos]);

  const carregarProdutosLocais = async () => {
    try {
      const jsonValue = await buscarStorage("@produtos");
      if (jsonValue != null) {
        setProdutos(jsonValue);
      } else {
        await buscarProdutosDaAPI(setProdutos);
      }
    } catch (e) {
      console.error("Erro ao carregar produtos locais:", e);
    }
  };

  const filtrarProdutos = () => {
    const texto = busca.toLowerCase();
    const filtrados = produtos.filter(
      (p) =>
        typeof p.Produto === "string" && p.Produto.toLowerCase().includes(texto)
    );
    setProdutosFiltrados(filtrados);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.containerDescription}>
        <Text style={styles.nome}>{item.Produto}</Text>
        <Text style={styles.segmento}>{item.Segmento}</Text>
      </View>
      <View style={styles.containerPrice}>
        <Text style={styles.preco}>R$ {item["Valor"].toFixed(2)}</Text>
        <View style={styles.und}>
          <Text style={styles.quantidade}>{item["Quantidade"]} und x </Text>
          <Text style={styles.precoUnd}>R$ {item["Valor Und"].toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Cabecalho
        onPress={() => " "}
        icone={""} /* enviar o nome do icone a ser renderizado no header */
        descriptionIcone={""} /* enviar a descrição do botão */
        image={imagem} /* enviar a imagem */
      />
      <TextInput
        placeholder="Buscar produto"
        value={busca}
        onChangeText={setBusca}
        style={styles.input}
      />
      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.Id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhum produto encontrado</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },
  logo: {
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    flex: 1,
    backgroundColor: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  item: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  nome: {
    fontSize: 16,
    fontWeight: "600",
  },
  segmento: {
    fontSize: 12,
    fontWeight: "400",
  },
  containerDescription: {
    width: "50%",
  },
  containerPrice: {
    width: "50%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  preco: {
    fontSize: 17,
    fontWeight: "600",
  },
  und: {
    flexDirection: "row",
  },
  vazio: {
    textAlign: "center",
    marginTop: 32,
    color: "#888",
  },
});
