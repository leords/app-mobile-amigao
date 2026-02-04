import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Alert,
  ActivityIndicator,
  Animated,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Cabecalho from "../components/Cabecalho";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { DescargaPedido } from "../services/DescargaPedido";
import { testeConexao } from "../services/TesteConexao";
import { buscarStorage } from "../storage/ControladorStorage";
import { limparStorageComCarga } from "../services/limparStorageComCarga";
import { buscarClientesDaAPI } from "../services/ClientesService";
import { buscarProdutosDaAPI } from "../services/ProdutosService";
import { useAuth } from "../context/AuthContext";

export default function Sincronizacao() {
  const [pedidos, setPedidos] = useState([]);
  const [remetenteLoading, setRemetente] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const navegacao = useNavigation();
  const imagem = require("../assets/logo.png");
  const { sincronizando, setSincronizando } = useAuth();
  const [showBar, setShowBar] = useState(false);
  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    let timer;

    if (sincronizando) {
      // Se passar de 5s, ativa a barra
      timer = setTimeout(() => {
        setShowBar(true);

        // Simula o progresso até 30s
        Animated.timing(progress, {
          toValue: 1,
          duration: 25000,
          useNativeDriver: false,
        }).start();
      }, 5000);
    } else {
      setShowBar(false);
      progress.setValue(0);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [sincronizando]);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

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
      setSincronizando(false);
      Alert.alert(
        "Sem conexão com a internet. Tente novamente assim que se conectar à internet."
      );
      return;
    }
    try {
      // Descarrega o array de pedidos.
      await DescargaPedido();
      // Descarrega o array de GPS.
      //await DescargaGPS();
    } catch (error) {
      console.log("Erro ao enviar os pedidos!", error);
      Alert.alert("Erro ao enviar os pedidos. Tente novamente!");
    } finally {
      setSincronizando(false);
      navegacao.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    }
  };

  // essa função valida se dentro do array tem algum item com a data igual a atual e retorna true!
  const validarDescarga = async () => {
    // verifica se tem pedidos não enviados
    const existePedidoNaoEnviado = pedidos.some((pedido) => !pedido.enviado);

    if (existePedidoNaoEnviado) {
      setRemetente("descarga");
      setSincronizando(true);
      await tentarEnviarPedidos();
    } else {
      Alert.alert("Não há pedidos pendentes para envio.");
    }
  };

  // essa função valida a carga do aplicativo, zerando pedidos e recarregando produtos e clientes.
  const validarCarga = async () => {
    try {
      setRemetente("carga");
      setSincronizando(true);
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
      setSincronizando(false);
      navegacao.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
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

      {sincronizando ? (
        // -------------
        // MODO DESCARGA   - utilizando a barra de progresso por causa do possivel lock da api
        // -------------
        remetenteLoading === "descarga" ? (
          <View style={styles.overlay}>
            {!showBar ? (
              // Até 5s mostra só o spinner
              <>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.texto}>Processando pedidos...</Text>
              </>
            ) : (
              // Após 5s troca para barra + mensagem
              <>
                <Text style={styles.texto}>
                  Aguarde, fila de descarregamento...
                </Text>
                <Text style={styles.textoEsperar}>
                  Atenção: não saia do cliente até concluir a descarga dos
                  pedidos.
                </Text>
                <View style={styles.barraProgresso}>
                  <Animated.View
                    style={[styles.progresso, { width: barWidth }]}
                  />
                </View>
              </>
            )}
          </View>
        ) : (
          // -------------
          // MODO CARGA
          // -------------
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
              Processo de carga em andamento, aguarde um instante...
            </Text>
          </>
        )
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
    width: "75%",
    textAlign: "center",
  },
  textoEsperar: {
    color: "white",
    fontSize: 14,
    fontWeight: 500,
    marginTop: 20,
    width: "75%",
    textAlign: "center",
  },
  icone: {},
  loader: {
    marginTop: 100,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  barraProgresso: {
    width: "60%",
    height: 10,
    backgroundColor: "#444",
    borderRadius: 5,
    marginTop: 20,
    overflow: "hidden",
  },
  progresso: {
    height: "100%",
    backgroundColor: "#F26B1D",
  },
});
