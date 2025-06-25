import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Cabecalho from "../components/Cabecalho";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { DescargaPedido } from "../services/DescargaPedido";
import { testeConexao } from "../services/TesteConexao";
import { pegarDataAtual } from "../utils/Data";
import { DescargaGPS } from "../services/DescargaGPS";
import { buscarStorage } from "../storage/ControladorStorage";
import { limparStorageComCarga } from "../services/limparStorageComCarga";

export default function Sincronizacao() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navegacao = useNavigation();
  const imagem = require("../assets/logo.png");

  useEffect(() => {
    buscarPedidos();
  }, []);

  const buscarPedidos = async () => {
    const dados = await buscarStorage("@pedidosLineares");
    if (dados) setPedidos(dados);
  };

  // Está função valida a conexao e faz as descargas de GPS e pedido.
  const tentarEnviarPedidos = async () => {
    const online = await testeConexao();
    if (!online) {
      Alert.alert(
        "Sem conexão com a internet. Tente novamente assim que se conectar à internet."
      );
      return;
    }
    try {
      // Descarrega o array de pedidos.
      await DescargaPedido();
      // Descarrega o array de GPS.
      await DescargaGPS();

      Alert.alert("Pedidos enviando com sucesso!");
    } catch (error) {
      console.log("Erro ao enviar os pedidos!", error);
      Alert.alert("Erro ao enviar os pedidos. Tente novamente!");
    }
  };

  // essa função valida se dentro do array tem algum item com a data igual a atual e retorna true!
  const validarDescarga = async () => {
    const existePedido = pedidos.some(
      (pedido) => pedido?.[0]?.[0] ?? null === pegarDataAtual()
    );
    console.log("validacao: ", existePedido);
    if (existePedido) {
      await tentarEnviarPedidos();
    } else {
      Alert.alert("você não tem nenhum pedido com a data de hoje");
    }
  };

  // essa função valida a carga de pedidos.
  const validarCarga = async () => {
    await limparStorageComCarga(setLoading);
  };

  return (
    <View style={styles.container}>
      <Cabecalho
        onPress={() => {
          navegacao.navigate("Home");
        }}
        icone={""} // correção no nome 'realod' se necessário
        descriptionIcone={""}
        image={imagem}
      />
      {loading ? (
        <ActivityIndicator size="large" color="red" marginTop="30" />
      ) : (
        <View style={styles.containerButton}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#5dc770" }]}
            onPress={() => {
              Alert.alert("Confirmar Carga", "Deseja realmente dar carga?", [
                { text: "Não", style: "cancel" },
                { text: "Sim", onPress: () => validarCarga() },
              ]);
            }}
          >
            <View style={styles.icone}>
              <Ionicons name="cloud-upload-outline" size={55} color="white" />
            </View>
            <Text style={styles.text}>Carregar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#2498e8" }]}
            onPress={() => {
              Alert.alert(
                "Confirmar Descarga",
                "Deseja realmente dar descarga?",
                [
                  { text: "Não", style: "cancel" },
                  { text: "Sim", onPress: () => validarDescarga() },
                ]
              );
            }}
          >
            <View styles={styles.icone}>
              <Ionicons name="cloud-download-outline" size={55} color="white" />
            </View>
            <Text style={styles.text}>Descarregar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  containerButton: {
    marginTop: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  button: {
    width: "90%",
    height: "40%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: 500,
    marginTop: 10,
  },
});
