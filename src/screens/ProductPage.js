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
import Header from "../components/Header";

export default function ProductPage() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);

  const image = require("../assets/vasilhames.png");

  useEffect(() => {
    carregarProdutosLocais();
  }, []);

  useEffect(() => {
    filtrarProdutos();
  }, [busca, produtos]);

  const carregarProdutosLocais = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@produtos");
      if (jsonValue != null) {
        const data = JSON.parse(jsonValue);
        setProdutos(data);
      } else {
        buscarProdutosDaApi(); // Se não houver no AsyncStorage, busca na API
      }
    } catch (e) {
      console.error("Erro ao carregar produtos locais:", e);
    }
  };

  const buscarProdutosDaApi = async () => {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwjMFZ9wWaUEQICGpO7qPaNCtQuOLr7N9hVxDJGmffeDdNN4Odx0mdbsB0JV-oNP1H8/exec"
      ); // Substitua pela URL correta
      const data = await response.json();

      if (Array.isArray(data.saida)) {
        await AsyncStorage.setItem("@produtos", JSON.stringify(data.saida));
        setProdutos(data.saida);
      } else {
        console.warn("Resposta inesperada:", data);
      }
    } catch (e) {
      console.error("Erro ao buscar da API:", e);
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
      <Header
        onPress={() => " "}
        icone={""} /* enviar o nome do icone a ser renderizado no header */
        descriptionIcone={""} /* enviar a descrição do botão */
        image={image} /* enviar a imagem */
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
