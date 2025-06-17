import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, StyleSheet } from "react-native";
import Cabecalho from "../components/Cabecalho";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { buscarClientesDaAPI } from "../services/ClientesService";
import { buscarStorage } from "../storage/ControladorStorage";
import { useAuth } from "../context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function ListaCliente() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [positivados, setPositivados] = useState([]);
  const [atualizarPositivacao, setAtualizarPositivacao] = useState(false);
  const [corPositivao, setCorPositivacao] = useState();

  const { user } = useAuth();
  const navegacao = useNavigation();

  const imagem = require("../assets/clientes.png");

  // Isso garante que mesmo que a tela já foi montada a função seja chamada, assim que a tela seja o foco. Então sempre que abrir a tela essa função será chamada!!!
  useFocusEffect(
    useCallback(() => {
      carregarClientesLocais();
    }, [])
  );

  useEffect(() => {
    filtrarClientes();
  }, [busca, clientes]);

  useFocusEffect(
    useCallback(() => {
      buscarClientePositivados();
    }, [])
  );

  // função que vai criar um array com clientes que já tem pedido realizado!
  const buscarClientePositivados = async () => {
    const dados = await buscarStorage("@pedidos");
    setPositivados(dados);
    const clientes = await buscarStorage("@clientes");

    const resultado = dados.length / clientes.length;

    const cor = resultado < 3 ? "red" : resultado < 7 ? "orange" : "green";

    // formatando número decimal para porcentagem.
    const formatado = new Intl.NumberFormat("pt-BR", {
      style: "percent",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(resultado);

    setAtualizarPositivacao(formatado);
    setCorPositivacao(cor);
  };

  // busca clientes do AsyncStorage, caso não encontrar ele chama da API novamente.
  const carregarClientesLocais = async () => {
    try {
      const jsonValue = await buscarStorage("@clientes");
      if (jsonValue && jsonValue.length > 0) {
        setClientes(jsonValue);
      } else {
        await buscarClientesDaAPI(user, setClientes);
      }
    } catch (e) {
      console.error("Erro ao carregar clientes locais:", e);
    }
  };

  const filtrarClientes = () => {
    const texto = busca.toLowerCase();
    const filtrados = clientes.filter(
      (p) =>
        typeof p.Cliente === "string" && p.Cliente.toLowerCase().includes(texto)
    );
    setClientesFiltrados(filtrados);
  };

  // { item } vem do flatList, assume os itens de data.
  // e percore o array todo com o .some, validando os itens. true ou false
  const renderItem = ({ item }) => {
    const positivou = positivados?.some(
      (pedido) => pedido?.cabecalho?.[1] === item?.Cliente
    );

    return (
      <TouchableOpacity
        //valida a condição de 'positivou' para determinar qual estilo ele assumirá.
        style={[styles.item, positivou && styles.positivado]}
        onPress={() => navegacao.navigate("Order", { cliente: item })}
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
      <Cabecalho
        onPress={() => {
          // tem a mesma função que o ! porém, garante que o valor seja trocado ao clicar duas vezes muito rápido!
          //setAtualizarPositivados((prev) => !prev);
        }}
        icone={"reload"} // correção no nome 'realod' se necessário
        descriptionIcone={"Atualizar"}
        image={imagem}
      />
      <TextInput
        placeholder="Buscar Cliente"
        value={busca}
        onChangeText={setBusca}
        style={styles.input}
      />
      <View style={styles.containerPositivacao}>
        <Text style={styles.titlePositivacao}>Positivação do dia: </Text>
        <Text style={[styles.positivacao, { color: corPositivao }]}>
          {atualizarPositivacao}
        </Text>
      </View>
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
  containerPositivacao: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  titlePositivacao: {
    textAlign: "center",
    fontSize: 14,
  },
  positivacao: {
    textAlign: "center",
    fontSize: 16,
    marginLeft: 4,
    fontWeight: 600,
  },
});
