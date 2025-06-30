import { useState } from "react";
import { Login } from "../services/Login";
import {
  Text,
  TextInput,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Keyboard,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function TelaLogin() {
  const [usuario, setUsuario] = useState();
  const [senha, setSenha] = useState();
  const [carregando, setCarregando] = useState(false);
  const { setUser } = useAuth();

  const realizarLogin = async () => {
    Keyboard.dismiss();
    setCarregando(true);
    const resultado = await Login(usuario.trim(), senha.trim());
    console.log(resultado);

    if (resultado.status === "ok") {
      console.log("Login correto, retorno: ", resultado.usuarioLogado.nome);
      setUser(resultado.usuarioLogado.nome);
      Alert.alert("Login efetuado com sucesso");
    } else {
      Alert.alert("Erro", resultado.message);
    }
    setCarregando(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={estilos.container}
    >
      <ScrollView
        contentContainerStyle={estilos.containerScroll}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require("../assets/logo_name_vertical.png")}
          style={estilos.logo}
          resizeMode="contain"
        />

        <TextInput
          placeholder="USUÁRIO"
          style={estilos.entrada}
          placeholderTextColor="#888"
          value={usuario}
          onChangeText={(text) => setUsuario(text.toUpperCase())}
          autoCapitalize="characters"
        />
        <TextInput
          placeholder="SENHA"
          style={estilos.entrada}
          secureTextEntry
          placeholderTextColor="#888"
          value={senha}
          onChangeText={(text) => setSenha(text.toUpperCase())}
          autoCapitalize="characters"
        />
        {carregando ? (
          <ActivityIndicator size="large" color="red" marginTop={30} />
        ) : (
          <TouchableOpacity onPress={realizarLogin} style={estilos.botao}>
            <Text style={estilos.textoBotao}>Entrar</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <Text style={estilos.rodape}>Desenvolvido por Leonardo Rodrigues</Text>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerScroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 60,
  },
  logo: {
    width: "80%",
    height: 200,
    marginBottom: 60,
  },
  entrada: {
    width: "100%",
    padding: 14,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  botao: {
    backgroundColor: "#DC3545",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    width: "100%",
    alignItems: "center",
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  rodape: {
    fontSize: 12,
    color: "grey",
    textAlign: "center",
  },
});
