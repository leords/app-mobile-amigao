import { TouchableOpacity, StyleSheet, View, Text, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ApagarStorage } from "../storage/removeStorage";
import { format } from "date-fns";

export default function Communication() {
  const [pedidos, setPedidos] = useState([]);
  const navigation = useNavigation();
  const image = require("../assets/logo.png");

  useEffect(() => {
    buscarPedidos();
  }, []);

  const pegarDataAtual = () => {
    return format(new Date(), "dd/MM/yyyy");
  };

  const buscarPedidos = async () => {
    const dados = await AsyncStorage.getItem("@pedidos");
    if (dados) setPedidos(JSON.parse(dados));
  };

  const validarCarga = async () => {
    const existePedido = pedidos.some(
      (pedido) => pedido.cabecalho?.[0] < pegarDataAtual()
    );
    if (existePedido) {
      await ApagarStorage("@pedidos");
    } else {
      return "Tem pedidos com a mesma data de hoje!";
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
                {
                  text: "Sim",
                  onPress: () => {
                    "CHAMANDO FUNÇÃO PARA DESCARREGAR";
                  },
                },
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
