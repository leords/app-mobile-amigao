import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import Cabecalho from "../components/Cabecalho";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";

export default function Informativo() {
  const { URL_QR_CODE } = Constants.expoConfig.extra;
  const imagem = require("../assets/logo.png");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const openLogout = () => {
    navigation.navigate("Logout");
  };

  return (
    <View style={styles.container}>
      <Cabecalho
        onPress={""}
        icone={""} /* enviar o nome do icone a ser renderizado no header */
        descriptionIcone={""} /* enviar a descrição do botão */
        image={imagem} /* enviar a imagem */
      />

      {/* DADOS EMPRESARIAIS */}
      <View style={styles.section}>
        <Text style={styles.title}>Dados Empresariais</Text>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Nome da empresa:</Text>
          <Text style={styles.text}>Amigão Distribuidora de Bebidas</Text>

          <Text style={styles.label}>CNPJ:</Text>
          <Text style={styles.text}>41.836.758/0001-41</Text>

          <Text style={styles.label}>Endereço:</Text>
          <Text style={styles.text}>
            Rua Pastor George Weger, 120 - Centro, 89460-144
          </Text>

          <Text style={styles.label}>Telefones:</Text>
          <Text style={styles.text}>Fixo: (47) 3622-2148</Text>
          <Text style={styles.text}>Delivery: (47) 98765-0404</Text>
        </View>
      </View>

      {/* DADOS BANCÁRIOS */}
      <View style={styles.section}>
        <Text style={styles.title}>Dados Bancários</Text>

        <View style={styles.bankingInfo}>
          <View style={styles.containerImage}>
            {loading ? <ActivityIndicator size="small" color="blue" /> : null}
            <Image
              source={{
                uri: URL_QR_CODE,
              }} // Substitua pelo QR code
              style={styles.qrCode}
              onLoadEnd={() => setLoading(false)}
            />
          </View>

          <View style={styles.bankDetails}>
            <Text style={styles.label}>Banco:</Text>
            <Text style={styles.text}>Bradesco</Text>

            <Text style={styles.label}>Conta:</Text>
            <Text style={styles.text}>133456-7</Text>

            <Text style={styles.label}>Agência:</Text>
            <Text style={styles.text}>0001</Text>
          </View>
        </View>
      </View>
      <View style={styles.sectionButton}>
        <TouchableOpacity style={styles.button} onPress={openLogout}>
          <Text style={styles.textButton}>Sair da minha conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: "auto",
    backgroundColor: "#fff",
  },
  section: {
    marginBottom: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  sectionButton: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  containerCompany: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 1,
  },
  infoBlock: {
    marginLeft: 10,
    marginVertical: 5,
  },
  label: {
    fontWeight: "600",
    marginTop: 10,
    fontSize: 16,
  },
  text: {
    marginLeft: 0,
  },
  bankingInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  containerImage: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 30,
  },
  qrCode: {
    width: 140,
    height: 140,
    resizeMode: "contain",
  },
  bankDetails: {
    width: "50%",
    height: 200,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 20,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    height: 40,
    width: "80%",
    borderRadius: 10,
  },
  textButton: {
    fontSize: 16,
    color: "white",
  },
});
