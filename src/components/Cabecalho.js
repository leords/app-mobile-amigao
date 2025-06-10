import colors from "../styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Cabecalho({ onPress, icone, descriptionIcone, image }) {
  const navegacao = useNavigation();

  return (
    <View style={styles.container}>
      {/* Botão voltar */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navegacao.navigate("Home")}
      >
        <Ionicons name="arrow-back" size={28} />
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>

      <Image source={image} style={styles.logo} />

      {/* Botão menu */}
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Ionicons name={icone} size={28} />
        <Text style={styles.buttonText}>{descriptionIcone}</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 4,
    marginHorizontal: 12,
  },
  logo: {
    width: 90,
    height: 80,
    resizeMode: "cover",
    marginRight: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
  },
  buttonText: {
    fontSize: 10,
  },
});
