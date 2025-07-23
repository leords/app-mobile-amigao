import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import Cabecalho from "../components/Cabecalho";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";

export default function Informativo() {
  const { URL_QR_CODE } = Constants.expoConfig.extra;
  const imagem = require("../assets/logo.png");
  const [carregando, setCarregando] = useState(true);
  const navigation = useNavigation();

  const abrirLogout = () => {
    navigation.navigate("Logout");
  };

  return (
    <View style={estilos.containerTela}>
      <Cabecalho onPress={""} icone={""} descriptionIcone={""} image={imagem} />

      {/* DADOS EMPRESARIAIS */}
      <View style={estilos.secao}>
        <Text style={estilos.tituloSecao}>Dados Empresariais</Text>
        <View style={estilos.blocoInformacoes}>
          <Text style={estilos.etiqueta}>Nome da empresa:</Text>
          <Text style={estilos.texto}>Amigão Distribuidora de Bebidas</Text>

          <Text style={estilos.etiqueta}>CNPJ:</Text>
          <Text style={estilos.texto}>41.836.758/0001-41</Text>

          <Text style={estilos.etiqueta}>Endereço:</Text>
          <Text style={estilos.texto}>
            Rua Pastor George Weger, 120 - Centro, 89460-144
          </Text>

          <Text style={estilos.etiqueta}>Telefones:</Text>
          <Text style={estilos.texto}>Fixo: (47) 3622-2148</Text>
          <Text style={estilos.texto}>Delivery: (47) 98765-0404</Text>
          <Text style={estilos.texto}>Suporte: (47) 98412-6073</Text>

          <Text style={estilos.etiqueta}>Conta bancária:</Text>
          <Text style={estilos.texto}>17874-8</Text>

          <Text style={estilos.etiqueta}>Agência:</Text>
          <Text style={estilos.texto}>0341 - Bradesco</Text>
        </View>
      </View>

      {/* DADOS BANCÁRIOS */}

      {/* BOTÃO DE DESLOGAR */}
      <View style={estilos.containerBotaoSair}>
        <TouchableOpacity style={estilos.botaoSair} onPress={abrirLogout}>
          <Text style={estilos.textoBotaoSair}>Sair da minha conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  // Tela principal
  containerTela: {
    padding: 20,
    backgroundColor: "#fff",
  },

  // Seções de conteúdo
  secao: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },

  // Títulos e textos
  tituloSecao: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 1,
  },
  blocoInformacoes: {
    marginLeft: 10,
    marginVertical: 5,
  },
  etiqueta: {
    fontWeight: "700",
    marginTop: 13,
    fontSize: 16,
  },
  texto: {
    fontWeight: "300",
    marginLeft: 0,
    marginTop: 6,
  },

  // Botão de saída
  containerBotaoSair: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  botaoSair: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    height: 40,
    width: "80%",
    borderRadius: 10,
  },
  textoBotaoSair: {
    fontSize: 16,
    color: "white",
  },
});
