import { useState } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Keyboard,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import QRCode from "react-native-qrcode-svg";
import Cabecalho from "../components/Cabecalho";
import { GerarPayloadPix } from "../services/GerarPayloadPix";
import { dataFormatada } from "../utils/Data";

export default function GerarQRCode() {
  const [valorComFormatacao, setValorComFormatacao] = useState();
  const [valor, setValor] = useState();
  const [novoQRCode, setNovoQRCode] = useState();

  const imagem = require("../assets/logo.png");

  const gerarTixd = () => {
    const data = dataFormatada(); //pegando a data atual pela função
    const dataLimpa = data.replaceAll("/", ""); //trocando a / por " "
    const valorLimpo = parseFloat(valor).toFixed(2).replace(".", ""); //limpando o valor, somente números.
    return `PIX${valorLimpo}${dataLimpa}`.slice(0, 35); // garante que não passa de 35
  };

  const gerarNovoQRCode = () => {
    if (valor && !isNaN(valor)) {
      Keyboard.dismiss(); // fecha o teclado
      const novoTxid = gerarTixd();
      setNovoQRCode(GerarPayloadPix(valor, novoTxid));
    } else {
      Alert.alert("Favor informar o valor correto");
    }
  };

  const formatarMoeda = (texto) => {
    // Remove tudo que não for número
    const numero = texto.replace(/\D/g, ""); // ex: "1250" (de 12,50)

    // Cria o número real com duas casas (ex: "12.50")
    const valorNumerico = (Number(numero) / 100).toFixed(2); // ex: "12.50"
    setValor(valorNumerico); // ← valor puro (usado no QRCode)

    // Formata como moeda BRL para mostrar no TextInput
    const valorFormatado = Number(valorNumerico).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    setValorComFormatacao(valorFormatado); // ← visível no input
  };

  // função que copia o link do pagamento
  const copiarPayload = async (texto) => {
    await Clipboard.setStringAsync(texto);
    Alert.alert("Sucesso", "Payload copiado para a área de transferência!");
  };

  return (
    <View style={styles.container}>
      <Cabecalho icone={""} image={imagem} onPress={""} descriptionIcone={""} />
      <View style={styles.dados}>
        <Text style={styles.texto}>Informe o valor para gerar o QRCode.</Text>
        <TextInput
          keyboardType="numeric"
          style={styles.valor}
          placeholder="R$ 0.00"
          value={valorComFormatacao}
          onChangeText={formatarMoeda}
        ></TextInput>
        <TouchableOpacity style={styles.botao} onPress={gerarNovoQRCode}>
          <Text style={styles.textoBotao}>Gerar QRCode</Text>
        </TouchableOpacity>
        <Text style={styles.textoDescricao}>
          O valor possivelmente pago por este QRCode será destinado à conta da
          empresa Distribuidora de Bebidas Amigão.
        </Text>
      </View>
      <View style={styles.containerQR}>
        <QRCode value={novoQRCode} size={230} />
      </View>
      {/* Botão para copiar o payload */}
      {novoQRCode && (
        <View style={styles.containerLink}>
          <TouchableOpacity
            style={styles.botaoLink}
            onPress={() => copiarPayload(novoQRCode)}
          >
            <Text style={styles.textoBotao}>Copiar link Pix</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  dados: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  texto: {
    fontSize: 18,
    fontWeight: 300,
  },
  valor: {
    width: 280,
    textAlign: "center",
    fontSize: 24,
    padding: 20,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  botao: {
    width: 280,
    height: 40,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
    backgroundColor: "#F15B6C",
  },
  textoBotao: {
    fontSize: 14,
    color: "white",
  },
  textoDescricao: {
    marginTop: 10,
    width: 280,
    textAlign: "justify",
    fontSize: 10,
  },
  containerQR: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },
  containerLink: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  botaoLink: {
    alignItems: "center",
    justifyContent: "center",
    width: 230,
    height: 40,
    borderRadius: 10,

    backgroundColor: "#3A5AFF",
  },
});
