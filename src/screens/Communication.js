import { TouchableOpacity, StyleSheet, View, Text, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ApagarStorage } from "../storage/removeStorage";
import { DischargeOrder } from "../services/DischargeOrder";
import { ConnectionTest } from "../services/ConnectionTest";
import { pegarDataAtual } from "../utils/date";
import { DischargeGPS } from "../services/DischargeGPS";

export default function Communication() {
  const [pedidos, setPedidos] = useState([]);
  const navigation = useNavigation();
  const image = require("../assets/logo.png");

  useEffect(() => {
    buscarPedidos();
  }, []);

  const buscarPedidos = async () => {
    const dados = await AsyncStorage.getItem("@pedidosLineares");
    if (dados) setPedidos(JSON.parse(dados));
  };

  const tentarEnviarPedidos = async () => {
    const online = await ConnectionTest();
    if (!online) {
      Alert.alert(
        "Sem conexão com a internet. Tente novamente assim que se conectar à internet."
      );
      return;
    }
    try {
      // descarregando a array de pedidos
      await DischargeOrder();
      // descarregando a array de GPS
      await DischargeGPS();

      Alert.alert("Pedidos enviando com sucesso!");
    } catch (error) {
      console.log("Erro ao enviar os pedidos!", error);
      Alert.alert("Erro ao enviar os pedidos. Tente novamente!");
    }
  };

  const validarDescarga = async () => {
    console.log(pedidos);
    const existePedido = pedidos.some(
      (pedido) => pedido?.[0]?.[0] ?? null === pegarDataAtual()
    );
    if (existePedido) {
      await tentarEnviarPedidos();
    } else {
      Alert.alert("você não tem nenhum pedido com a data de hoje");
    }
  };

  const validarCarga = async () => {
    const existePedido = pedidos.some(
      //como é um array dentro um array = bidimensional
      (pedido) => pedido?.[0]?.[0] ?? null === pegarDataAtual()
    );
    if (existePedido) {
      await ApagarStorage("@pedidosLineares");
      await ApagarStorage("@pedidos");

      const dados1 = await AsyncStorage.getItem("@pedidosLineares");
      const dados2 = await AsyncStorage.getItem("@pedidos");

      if (!dados1 || (dados1 === null && !dados2) || dados2 === null) {
        Alert.alert("Sua carga foi realizada com sucesso!");
      }
    } else {
      Alert.alert(
        "Não é possivel fazer a carga no momento, você tem pedidos com a data de hoje!"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Header
        onPress={() => {
          navigation.navigate("Home");
        }}
        icone={""} // correção no nome 'realod' se necessário
        descriptionIcone={""}
        image={image}
      />
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
