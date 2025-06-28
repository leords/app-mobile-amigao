import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Cabecalho from "../components/Cabecalho";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { buscarClientesDaAPI } from "../services/ClientesService";
import { buscarStorage } from "../storage/ControladorStorage";
import { useAuth } from "../context/AuthContext";

export default function ListaCliente() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [positivados, setPositivados] = useState([]);
  const [atualizarPositivacao, setAtualizarPositivacao] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const { user } = useAuth();
  const navegacao = useNavigation();

  const imagem = require("../assets/clientes.png");

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
      buscarClientesPositivados();
    }, [])
  );

  const buscarClientesPositivados = async () => {
    const dados = await buscarStorage("@pedidos");
    setPositivados(dados);

    const resultado = dados.length;

    setAtualizarPositivacao(resultado);
  };

  const carregarClientesLocais = async () => {
    try {
      const jsonValue = await buscarStorage("@clientes");
      if (jsonValue && jsonValue.length > 0) {
        setClientes(jsonValue);
      } else {
        setCarregando(true);
        if (user?.toLowerCase() === "admin") {
          await buscarClientesDaAPI(null, setClientes);
        } else {
          await buscarClientesDaAPI(user, setClientes);
        }
        setCarregando(false);
      }
    } catch (e) {
      console.error("Erro ao carregar clientes locais:", e);
      setCarregando(false);
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

  const renderizarItem = ({ item }) => {
    const positivou = positivados?.some(
      (pedido) => pedido?.cabecalho?.[1] === item?.Cliente
    );

    return (
      <TouchableOpacity
        style={[estilos.item, positivou && estilos.positivado]}
        onPress={() => navegacao.navigate("Order", { cliente: item })}
      >
        <View style={estilos.containerDescricao}>
          <Text style={estilos.nome}>{item.Cliente}</Text>
          <Text style={estilos.dados}>
            {item.Dados.length > 11
              ? `CNPJ: ${item.Dados}`
              : `CPF: ${item.Dados}`}
          </Text>
        </View>
        <Text style={estilos.endereco}>
          {item.Endereco} - {item.Cidade}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={estilos.container}>
      <Cabecalho
        onPress={() => {
          // Exemplo: setAtualizarPositivacao(prev => !prev)
        }}
        icone={"reload"}
        descriptionIcone={"Atualizar"}
        image={imagem}
      />
      <TextInput
        placeholder="Buscar Cliente"
        value={busca}
        onChangeText={setBusca}
        style={estilos.entrada}
      />
      {carregando ? (
        <ActivityIndicator size="large" color="red" marginTop={30} />
      ) : (
        <View>
          <View style={estilos.containerPositivacao}>
            <Text style={estilos.tituloPositivacao}>Positivados do dia: </Text>
            <Text style={estilos.valorPositivacao}>{atualizarPositivacao}</Text>
          </View>
          <FlatList
            style={estilos.lista}
            data={clientesFiltrados}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderizarItem}
            ListEmptyComponent={
              <Text style={estilos.vazio}>Nenhum cliente encontrado</Text>
            }
          />
        </View>
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
  lista: {
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
  containerDescricao: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  dados: {
    textAlign: "left",
    fontWeight: "200",
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
  tituloPositivacao: {
    textAlign: "center",
    fontSize: 14,
  },
  valorPositivacao: {
    textAlign: "center",
    fontSize: 16,
    marginLeft: 4,
    fontWeight: "600",
  },
});
