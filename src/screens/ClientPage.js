import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

export default function ClientPage() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [positivados, setPositivados] = useState([]);
  const [atualizarPositivados, setAtualizarPositivados] = useState(false);
  const navigation = useNavigation();

  const image = require("../assets/clientes.png");

  useEffect(() => {
    carregarClientesLocais();
  }, []);

  useEffect(() => {
    filtrarClientes();
  }, [busca, clientes]);

  useEffect(() => {
    buscarClientePositivados();
  }, [atualizarPositivados]);

  // função que vai criar um array com clientes que já tem pedido realizado!
  const buscarClientePositivados = async () => {
    const dados = await AsyncStorage.getItem("@pedidos");
    if (dados) setPositivados(JSON.parse(dados));
  };

  // busca clientes do AsyncStorage, caso não encontrar ele chama da API novamente.
  const carregarClientesLocais = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@clientes");
      if (jsonValue != null) {
        const data = JSON.parse(jsonValue);
        setClientes(data);
      } else {
        buscarClientesDaApi();
      }
    } catch (e) {
      console.error("Erro ao carregar clientes locais:", e);
    }
  };

  // return dias[new Date().getDay()]. new Date().getDay() = é 0 domingo, 1 segunda ...
  const pegarDiaSemanaHoje = () => {
    const dias = [
      "DOMINGO",
      "SEGUNDA",
      "TERÇA",
      "QUARTA",
      "QUINTA",
      "SEXTA",
      "SÁBADO",
    ];
    return dias[new Date().getDay()];
  };

  // chamando a API do sheets conforme os parametros.
  // OBS: precisa arrumar conforme o retorno da API de login que vai ser criada
  const buscarClientesDaApi = async () => {
    try {
      const dia = pegarDiaSemanaHoje(); // chamada da função corretamente
      const response = await fetch(
        // `https://script.google.com/macros/s/AKfycbwTjAF9x6LuaW6gwlxwV-lIVyX5hZfbLwGQkSoPe_AhuSQFL0wo_HQ3Av4AA4Hv3c9pvA/exec?vendedor=${vendedor}&dia=${dia}`
        `https://script.google.com/macros/s/AKfycbwTjAF9x6LuaW6gwlxwV-lIVyX5hZfbLwGQkSoPe_AhuSQFL0wo_HQ3Av4AA4Hv3c9pvA/exec?vendedor=EMERSON&dia=SEGUNDA`
      );
      const data = await response.json();

      // verifica se data.saida é um array.
      if (Array.isArray(data.saida)) {
        await AsyncStorage.setItem("@clientes", JSON.stringify(data.saida));
        setClientes(data.saida);
      } else {
        console.warn("Resposta inesperada:", data);
      }
    } catch (e) {
      console.error("Erro ao buscar da API:", e);
    }
  };

  // filtro que busca clientes na array de clientes.
  const filtrarClientes = () => {
    const texto = busca.toLowerCase();
    const filtrados = clientes.filter(
      (p) =>
        typeof p.Cliente === "string" && p.Cliente.toLowerCase().includes(texto)
    );
    setClientesFiltrados(filtrados);
  };

  const renderItem = ({ item }) => {
    const positivou = positivados?.some(
      (pedido) => pedido?.cabecalho?.[1] === item?.Cliente
    );

    return (
      <TouchableOpacity
        style={[styles.item, positivou && styles.positivado]}
        onPress={() => navigation.navigate("Order", { cliente: item })}
      >
        <View style={styles.containerDescription}>
          <Text style={styles.nome}>{item.Cliente}</Text>
          <Text style={styles.dados}>
            {item.Dados.length > 11
              ? `CNPJ: ${item.Dados}`
              : `CPF: ${item.Dados}`}
          </Text>
        </View>
        <Text style={styles.endereco}>
          {item.Endereco} - {item.Cidade}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        onPress={() => {
          // tem a mesma função que o ! porém, garante que o valor seja trocado ao clicar duas vezes muito rápido!
          setAtualizarPositivados((prev) => !prev);
        }}
        icone={"reload"} // correção no nome 'realod' se necessário
        descriptionIcone={"Atualizar"}
        image={image}
      />
      <TextInput
        placeholder="Buscar Cliente"
        value={busca}
        onChangeText={setBusca}
        style={styles.input}
      />
      <FlatList
        style={styles.list}
        data={clientesFiltrados}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhum cliente encontrado</Text>
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
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  list: {
    padding: 4,
  },
  item: {
    flexDirection: "column",
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#EEE",
    marginTop: 10,
  },
  nome: {
    fontSize: 16,
    fontWeight: "600",
  },
  endereco: {
    fontSize: 12,
    fontWeight: "200",
    marginTop: 4,
  },
  containerDescription: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  containerInfo: {
    alignItems: "center",
    justifyContent: "center",
  },
  vendedor: {
    textAlign: "right",
  },
  dados: {
    textAlign: "left",
    fontWeight: "200",
  },
  containerEndereco: {
    flexDirection: "column",
    textAlign: "right",
    marginTop: 6,
  },
  vazio: {
    textAlign: "center",
    marginTop: 32,
    color: "#888",
  },
  positivado: {
    backgroundColor: "#5dc770",
  },
});
