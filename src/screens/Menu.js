import { View, StyleSheet, Image, Text } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import BotaoPaginaInicio from "../components/BotaoPaginaInicio";

export default function Menu() {
  const imagem = require("../assets/logo_name_horizontal.png");
  return (
    <View style={estilos.container}>
      <View style={estilos.cabecalho}>
        <Image source={imagem} style={estilos.logo} />
      </View>
      <View style={estilos.containerBotoes}>
        <BotaoPaginaInicio
          BGcolor={"#F15B6C"}
          destinationPage={"SalesDay"}
          image={<FontAwesome name="bar-chart" size={30} color="white" />}
          name={"Minhas vendas"}
        />
        <BotaoPaginaInicio
          BGcolor={"#3A5AFF"}
          destinationPage={"Client"}
          image={<Entypo name="address" size={32} color="white" />}
          name={"Minha rota"}
        />
        <BotaoPaginaInicio
          BGcolor={"#AF52DE"}
          destinationPage={"Product"}
          image={<Entypo name="dropbox" size={32} color="white" />}
          name={"Produtos"}
        />
        <BotaoPaginaInicio
          BGcolor={"orange"}
          destinationPage={"ListOrder"}
          image={<FontAwesome name="list-ol" size={30} color="white" />}
          name={"Meus pedidos"}
        />
        <BotaoPaginaInicio
          BGcolor={"#6C757D"}
          destinationPage={"Info"}
          image={<AntDesign name="idcard" size={32} color="white" />}
          name={"Informações"}
        />
        <BotaoPaginaInicio
          BGcolor={"#3A5AFF"}
          destinationPage={"Communication"}
          image={<AntDesign name="cloudupload" size={34} color="white" />}
          name={"Comunicação"}
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },
  cabecalho: {
    alignItems: "center",
    justifyContent: "center",
    height: "12%",
  },
  containerBotoes: {
    flex: 1,
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  logo: {
    width: 200,
    height: 80,
    resizeMode: "cover",
    marginTop: 10,
  },
});
