import { View, StyleSheet, Image } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
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
          BGcolor={"#4A4A4A"}
          destinationPage={"SalesDay"}
          image={<FontAwesome name="bar-chart" size={30} color="white" />}
          name={"Minhas vendas"}
        />
        <BotaoPaginaInicio
          BGcolor={"#FFA500"}
          destinationPage={"Client"}
          image={<Entypo name="address" size={32} color="white" />}
          name={"Minha rota"}
        />
        <BotaoPaginaInicio
          BGcolor={"#F26B1D"}
          destinationPage={"Product"}
          image={<Entypo name="dropbox" size={32} color="white" />}
          name={"Produtos"}
        />
        <BotaoPaginaInicio
          BGcolor={"#EF3C28"}
          destinationPage={"ListOrder"}
          image={<FontAwesome name="list-ol" size={30} color="white" />}
          name={"Meus pedidos"}
        />
        <BotaoPaginaInicio
          BGcolor={"#4A4A4A"}
          destinationPage={"Info"}
          image={<AntDesign name="idcard" size={32} color="white" />}
          name={"Informações"}
        />
        <BotaoPaginaInicio
          BGcolor={"#FFA500"}
          destinationPage={"Communication"}
          image={<AntDesign name="cloudupload" size={34} color="white" />}
          name={"Comunicação"}
        />
        <BotaoPaginaInicio
          BGcolor={"#F26B1D"}
          destinationPage={"GerarQRCode"}
          image={<FontAwesome6 name="pix" size={34} color="white" />}
          name={"Gerar pagamentos"}
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
