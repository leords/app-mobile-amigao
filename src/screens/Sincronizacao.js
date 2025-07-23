import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Cabecalho from "../components/Cabecalho";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { DescargaPedido } from "../services/DescargaPedido";
import { testeConexao } from "../services/TesteConexao";
import { pegarDataAtual } from "../utils/Data";
import { DescargaGPS } from "../services/DescargaGPS";
import { buscarStorage } from "../storage/ControladorStorage";
import { limparStorageComCarga } from "../services/LimparStorageComCarga";
import { buscarClientesDaAPI } from "../services/ClientesService";
import { buscarProdutosDaAPI } from "../services/ProdutosService";

export default function Sincronizacao() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [remetenteLoading, setRemetente] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const navegacao = useNavigation();
  const imagem = require("../assets/logo.png");

  useEffect(() => {
    buscarPedidos();
  }, []);

  // Está função busca pedidos no Storaged
  const buscarPedidos = async () => {
    const dados = await buscarStorage("@pedidosLineares");
    if (dados) setPedidos(dados);
  };

  // Está função valida a conexao e faz as descargas de GPS e pedidos.
  const tentarEnviarPedidos = async () => {
    const online = await testeConexao();
    if (!online) {
      setLoading(false);
      Alert.alert(
        "Sem conexão com a internet. Tente novamente assim que se conectar à internet."
      );
      return;
    }
    try {
      // Descarrega o array de pedidos.
      await DescargaPedido();
      // Descarrega o array de GPS.
      await DescargaGPS();

      Alert.alert("Pedidos enviado com sucesso!");
    } catch (error) {
      console.log("Erro ao enviar os pedidos!", error);
      Alert.alert("Erro ao enviar os pedidos. Tente novamente!");
    } finally {
      setLoading(false);
    }
  };

  // essa função valida se dentro do array tem algum item com a data igual a atual e retorna true!
  const validarDescarga = async () => {
    const existePedido = pedidos.some(
      (pedido) => pedido?.[0]?.[0] ?? null === pegarDataAtual()
    );

    if (existePedido) {
      setRemetente("descarga");
      setLoading(true);
      await tentarEnviarPedidos();
    } else {
      Alert.alert("você não tem nenhum pedido com a data de hoje");
    }
  };

  // essa função valida a carga do aplicativo, zerando pedidos e recarregando produtos e clientes.
  const validarCarga = async () => {
    try {
      setRemetente("carga");
      setLoading(true);
      await limparStorageComCarga();

      try {
        const usuario = await buscarStorage("@user");

        await buscarProdutosDaAPI(setProdutos);
        if (!produtos && !Array.isArray(produtos) && produtos.length == 0) {
          throw new Error("Nenhum produto carregado!");
        }

        if (usuario) {
          const isAdmin = usuario.toLowerCase() === "admin";
          await buscarClientesDaAPI(isAdmin ? null : usuario, setClientes);

          if (!clientes && !Array.isArray(clientes) && clientes.length == 0) {
            throw new Error("Nenhum cliente carregado!");
          }
        } else {
          throw new Error("Usuario não encontrado.");
        }
      } catch (error) {
        throw error;
      }
      Alert.alert("Carga realizada com sucesso!");
    } catch (error) {
      console.log(error);
      Alert.alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Cabecalho
        onPress={() => {
          navegacao.navigate("Home");
        }}
        icone={""} // correção no nome 'realod' se necessário
        descriptionIcone={""}
        image={imagem}
      />
      {loading ? (
        <>
          <ActivityIndicator
            size="large"
            color="red"
            marginTop="30"
            style={styles.loader}
          />
          <Text
            style={{
              textAlign: "center",
              marginTop: 60,
              fontSize: 16,
              fontWeight: 400,
            }}
          >
            Processo de {remetenteLoading} em andamento, aguarde um instante...
          </Text>
        </>
      ) : (
        <View style={styles.containerBotao}>
          <TouchableOpacity
            style={[styles.botao, { backgroundColor: "#EF3C28" }]}
            onPress={() => {
              Alert.alert("Confirmar Carga", "Deseja realmente dar carga?", [
                { text: "Não", style: "cancel" },
                { text: "Sim", onPress: () => validarCarga() },
              ]);
            }}
          >
            <View style={styles.icone}>
              <Ionicons name="cloud-upload-outline" size={55} color="white" />
            </View>
            <Text style={styles.texto}>Carregar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botao, { backgroundColor: "#5dc770" }]} //#EF3C28
            onPress={() => {
              Alert.alert(
                "Confirmar Descarga",
                "Deseja realmente dar descarga?",
                [
                  { text: "Não", style: "cancel" },
                  { text: "Sim", onPress: () => validarDescarga() },
                ]
              );
            }}
          >
            <View styles={styles.icone}>
              <Ionicons name="cloud-download-outline" size={55} color="white" />
            </View>
            <Text style={styles.texto}>Descarregar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  containerBotao: {
    marginTop: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  botao: {
    width: "90%",
    height: "40%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  texto: {
    color: "white",
    fontSize: 16,
    fontWeight: 500,
    marginTop: 10,
  },
  loader: {
    marginTop: 100,
  },
});
