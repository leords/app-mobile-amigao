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
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const [usuario, setUsuario] = useState();
  const [senha, setSenha] = useState();
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    const resultado = await Login(usuario, senha);

    if (resultado.status === "ok") {
      setUser(resultado.usuario);
      Alert.alert("Login efetuado com sucesso");
    } else {
      Alert.alert("Erro", resultado.message);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require("../assets/logo_name_vertical.png")} // coloque sua imagem aqui
          style={styles.logo}
          resizeMode="contain"
        />

        <TextInput
          placeholder="USUÁRIO"
          style={styles.input}
          placeholderTextColor="#888"
          value={usuario}
          onChangeText={(text) => setUsuario(text.toUpperCase())}
          autoCapitalize="characters"
        />
        <TextInput
          placeholder="SENHA"
          style={styles.input}
          secureTextEntry
          placeholderTextColor="#888"
          value={senha}
          onChangeText={(text) => setSenha(text.toUpperCase())}
          autoCapitalize="characters"
        />
        {loading ? (
          <ActivityIndicator size="large" color="red" marginTop="30" />
        ) : (
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <Text style={styles.textFooter}>Desenvolvido por Leonardo Rodrigues</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
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
  input: {
    width: "100%",
    padding: 14,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#DC3545",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  textFooter: {
    fontSize: 12,
    color: "grey",
    textAlign: "center",
  },
});
