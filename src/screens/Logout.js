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
  const [carregando, setCarregando] = useState(false);
  const { setUser } = useAuth();
  const imagem = require("../assets/logo.png");

  const sair = async () => {
    try {
      setCarregando(true);
      const validacao = await ValidarAdmin("ADMIN", senha);

      if (validacao.status === "ADMIN") {
        await removerStorage("@user");
        setUser(null);
        await removerStorage("@clientes");
        setCarregando(false);
        Alert.alert("Usuário desconectado com sucesso!");
      } else {
        Alert.alert("Senha incorreta!");
        console.log("Senha incorreta!");
        setCarregando(false);
      }
    } catch (error) {
      Alert.alert("Erro ao se conectar com o servidor");
      setCarregando(false);
    }
  };

  return (
    <View style={estilos.container}>
      <Cabecalho
        onPress={""}
        icone={""} /* enviar o nome do ícone a ser renderizado no header */
        descriptionIcone={""} /* enviar a descrição do botão */
        image={imagem} /* enviar a imagem */
      />
      {carregando ? (
        <ActivityIndicator size="large" color="red" marginTop={30} />
      ) : (
        <View style={estilos.containerSenha}>
          <Text style={estilos.legenda}>
            Senha restrita. Solicite autorização ao administrador do sistema.
          </Text>
          <Text style={estilos.titulo}>Senha admin</Text>
          <TextInput
            style={estilos.entradaTexto}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
          <TouchableOpacity style={estilos.botao} onPress={sair}>
            <Text style={estilos.textoBotao}>Enviar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    padding: 20,
  },
  containerSenha: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    backgroundColor: "#fff",
    paddingVertical: 40,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  legenda: {
    textAlign: "center",
    marginBottom: 80,
    width: "80%",
  },
  titulo: {
    fontSize: 16,
    textAlign: "center",
  },
  textoBotao: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
  },
  entradaTexto: {
    height: 52,
    width: "80%",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "white",
    textAlign: "center",
  },
  botao: {
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
