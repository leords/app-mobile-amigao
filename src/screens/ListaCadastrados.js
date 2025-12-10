import { FlatList, StyleSheet, View, Text } from "react-native";
import Cabecalho from "../components/Cabecalho";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { buscarStorage } from "../storage/ControladorStorage";

export default function ListaCadastro() {
  const imagem = require("../assets/logo.png");

  const [novosCadastros, setNovosCadastros] = useState([]);

  const buscarNovosCadastros = async () => {
    const dados = await buscarStorage("@cadastro");
    setNovosCadastros(dados);
  };

  useFocusEffect(
    useCallback(() => {
      buscarNovosCadastros();
    }, [])
  );

  const renderizarCadastro = ({ item }) => (
    <View style={estilos.cartao}>
      <Text style={estilos.cartaoTitulo}>{item.nome}</Text>
      <Text style={estilos.cartaoData}>{item.data}</Text>

      <Text style={estilos.descricao}>Nome</Text>
      <Text style={estilos.dados}>{item.nome}</Text>
      <Text style={estilos.descricao}>CPF/CNPJ</Text>
      <Text style={estilos.dados}>{item.identificadorUnico}</Text>
      <Text style={estilos.descricao}>Cidade</Text>
      <Text style={estilos.dados}>{item.cidade}</Text>
      <Text style={estilos.descricao}>Endereço</Text>
      <Text style={estilos.dados}>{item.endereco}</Text>

      <View style={estilos.bloco}>
        <View style={estilos.blocoA}>
          <Text style={estilos.descricao}>Telefone</Text>
          <Text style={estilos.dados}>{item.telefone}</Text>
          <Text style={estilos.descricao}>Atendimento</Text>
          <Text style={estilos.dados}>{item.atendimento}</Text>
        </View>
        <View style={estilos.blocoB}>
          <Text style={estilos.descricao}>Usuário</Text>
          <Text style={estilos.dados}>{item.user}</Text>
          <Text style={estilos.descricao}>Frequência</Text>
          <Text style={estilos.dados}>{item.frequencia}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={estilos.container}>
      <Cabecalho
        onPress={() => {}}
        icone=""
        descriptionIcone=""
        image={imagem}
      />
      <View style={estilos.containerLista}>
        <FlatList
          data={novosCadastros}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderizarCadastro}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: "center",
                marginTop: 32,
                color: "#353131ff",
                fontSize: 16,
              }}
            >
              Nenhum cadastro realizado hoje!
            </Text>
          }
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
    marginTop: 10,
  },
  containerLista: {
    paddingHorizontal: 16,
    paddingBottom: 60,
    paddingTop: 30,
    backgroundColor: "#f7f2f2ff",
    borderRadius: 10,
    marginBottom: 20,
  },
  cartao: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16, // espaçamento entre os cards
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // sombra no Android
  },

  bloco: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  blocoA: {
    justifyContent: "center",
  },
  blocoB: {
    justifyContent: "center",
  },

  cartaoTitulo: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  cartaoData: {
    fontSize: 12,
    fontWeight: "200",
    marginTop: 2,
    marginBottom: 14,
  },

  descricao: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 10,
  },
  dados: {
    fontSize: 14,
    fontWeight: "200",
  },
});
