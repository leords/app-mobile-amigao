import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Cabecalho from "../components/Cabecalho";
import { buscarProdutosDaAPI } from "../services/ProdutosService";
import { buscarStorage } from "../storage/ControladorStorage";

export default function ListaProduto() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [carregando, setCarregando] = useState(false);

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
      if (Array.isArray(jsonValue) && jsonValue.length > 0) {
        setProdutos(jsonValue);
      } else {
        setCarregando(true);
        await buscarProdutosDaAPI(setProdutos);
        setCarregando(false);
      }
    } catch (e) {
      console.error("Erro ao carregar produtos locais:", e);
      setCarregando(false);
    }
  };

  const filtrarProdutos = () => {
    const texto = busca.toLowerCase();
    const filtrados = produtos.filter(
      (p) =>
        typeof p?.Produto === "string" &&
        p.Produto.toLowerCase().includes(texto)
    );
    setProdutosFiltrados(filtrados);
  };

  const renderizarItem = ({ item }) => (
    <View style={estilos.item}>
      <View style={estilos.containerDescricao}>
        <Text style={estilos.nome}>{item.Produto}</Text>
        <Text style={estilos.segmento}>{item.Segmento}</Text>
      </View>
      <View style={estilos.containerPreco}>
        <Text style={estilos.preco}>R$ {item["Valor"].toFixed(2)}</Text>
        <View style={estilos.unidade}>
          <Text style={estilos.quantidade}>{item["Quantidade"]} und x </Text>
          <Text style={estilos.precoUnidade}>
            R$ {item["Valor Und"].toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={estilos.container}>
      {carregando ? (
        <ActivityIndicator size="large" color="red" marginTop={30} />
      ) : (
        <>
          <Cabecalho
            onPress={() => " "}
            icone={""}
            descriptionIcone={""}
            image={imagem}
          />
          <TextInput
            placeholder="Buscar produto"
            value={busca}
            onChangeText={setBusca}
            style={estilos.entrada}
          />
          <FlatList
            data={produtosFiltrados}
            keyExtractor={(item) => item.Id.toString()}
            renderItem={renderizarItem}
            ListEmptyComponent={
              <Text style={estilos.vazio}>Nenhum produto encontrado</Text>
            }
          />
        </>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },
  entrada: {
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
  containerDescricao: {
    width: "50%",
  },
  containerPreco: {
    width: "50%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  preco: {
    fontSize: 17,
    fontWeight: "600",
  },
  unidade: {
    flexDirection: "row",
  },
  quantidade: {},
  precoUnidade: {},
  vazio: {
    textAlign: "center",
    marginTop: 32,
    color: "#888",
  },
});
