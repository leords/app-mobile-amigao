import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import Cabecalho from "../components/Cabecalho";
import { ValidarAdmin } from "../services/ValidarAdmin";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { removerStorage } from "../storage/ControladorStorage";

export default function Logout() {
  const [senha, setSenha] = useState();
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const image = require("../assets/logo.png");

  const Exit = async () => {
    try {
      setLoading(true);
      const validate = await ValidarAdmin("ADMIN", senha);

      if (validate.status === "ADMIN") {
        await removerStorage("@user");
        setUser(null);
        await removerStorage("@clientes");
        //await removerStorage("@clientes");
        setLoading(false);
        Alert.alert("Usuário desconecado com sucesso!");
      } else {
        Alert.alert("A senha incorreta!");
        console.log("A senha incorreta!");
        setLoading(false);
      }
    } catch (error) {
      Alert.alert("erro ao se conectar com o servidor");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Cabecalho
        onPress={""}
        icone={""} /* enviar o nome do icone a ser renderizado no header */
        descriptionIcone={""} /* enviar a descrição do botão */
        image={image} /* enviar a imagem */
      />
      {loading ? (
        <ActivityIndicator size="large" color="red" marginTop="30" />
      ) : (
        <View style={styles.password}>
          <Text style={styles.caption}>
            Senha restrita. Solicite autorização ao administrador do sistema.
          </Text>
          <Text style={styles.title}>Senha admin</Text>
          <TextInput
            style={styles.inputText}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={Exit}>
            <Text style={styles.text}>Enviar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  password: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    backgroundColor: "#fff",
    paddingVertical: 40,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  caption: {
    textAlign: "center",
    marginBottom: 80,
    width: "80%",
  },
  title: {
    fontSize: 16,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
  },
  inputText: {
    height: 52,
    width: "80%",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "white",
    textAlign: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
    height: 55,
    width: "80%",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 10,
    marginTop: 30,
  },
});
