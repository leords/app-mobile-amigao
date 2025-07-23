import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function BotaoPaginaInicio({
  BGcolor,
  destinationPage,
  image,
  name,
}) {
  const navegacao = useNavigation();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: BGcolor }]}
      onPress={() => navegacao.navigate(destinationPage)}
    >
      <View style={styles.iconWrapper}>{image}</View>
      <Text style={styles.text}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "48%", // Para caber 2 por linha com margem
    height: 140,
    borderRadius: 10,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginBottom: 0,
  },
  iconWrapper: {
    width: "100%",
    marginBottom: 2,
    marginLeft: 4,
  },
  text: {
    color: "white",
    fontSize: 15,
    width: "100%",
  },
});
