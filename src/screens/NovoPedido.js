import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { GpsCliente } from "../utils/GeradorGPSCliente";
import {
  atualizarStorage,
  buscarStorage,
  criarCallbackAdicionarPedido,
} from "../storage/ControladorStorage";
import { buscarProdutosDaAPI } from "../services/ProdutosService";
import ModalSelecionarProduto from "../components/ModalSelecionarProduto";

export default function Pedido() {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [produtoQuery, setProdutoQuery] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [itensPedido, setItensPedido] = useState([]);
  const [formaPagamento, setFormaPagamento] = useState("A VISTA");
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { cliente } = route.params;

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const dados = await buscarStorage("@produtos");
        if (dados && Array.isArray(dados) && dados.length > 0) {
          setProdutos(dados);
        } else {
          const daAPI = await buscarProdutosDaAPI();
          setProdutos(daAPI);
        }
      } catch (error) {
        console.log("Erro ao carregar produtos", error);
        Alert.alert("Erro", "Falha ao carregar os produtos.");
      }
    };
    carregarProdutos();
  }, []);

  const adicionarItem = () => {
    if (!produtoSelecionado || !quantidade) return;
    Keyboard.dismiss();
    const preco = parseFloat(produtoSelecionado["Valor"]);
    // usado replace para alterar de virgula para ponto!!!
    const qtd = parseFloat(quantidade.replace(",", "."));
    const total = preco * qtd;

    const novoItem = {
      id: Date.now(),
      quantidade: qtd,
      nome: produtoSelecionado.Produto,
      preco,
      total,
    };

    setItensPedido([...itensPedido, novoItem]);
    setProdutoSelecionado(null);
    setProdutoQuery("");
    setQuantidade("");
    setModalVisible(false);
  };

  const removerItem = (id) => {
    const novaLista = itensPedido.filter((item) => item.id !== id);
    setItensPedido(novaLista);
  };

  const salvarPedido = async () => {
    const dataAtual = new Date();

    const cabecalho = [
      dataAtual.toLocaleDateString("pt-BR"),
      cliente.Cliente,
      cliente.Vendedor,
    ];
    const produtosLinearizados = itensPedido.flatMap((item) => [
      item.quantidade,
      item.nome,
      item.preco,
      item.total,
    ]);

    while (produtosLinearizados.length < 76) {
      produtosLinearizados.push("", "", "", "");
    }

    const totalGeral = itensPedido.reduce((acc, item) => acc + item.total, 0);
    const rodape = ["TOTAL", totalGeral, "PAGAMENTO", formaPagamento];
    const linhaFinal = [...cabecalho, ...produtosLinearizados, ...rodape];

    const pedidoFinal = {
      cabecalho,
      itensPedido,
      rodape,
    };

    const callbackPedidos = criarCallbackAdicionarPedido(pedidoFinal);
    await atualizarStorage("@pedidos", callbackPedidos);
    await GpsCliente(pedidoFinal);

    const callbackPedidosLineares = criarCallbackAdicionarPedido(linhaFinal);
    await atualizarStorage("@pedidosLineares", callbackPedidosLineares);

    setItensPedido([]);
    setProdutoSelecionado(null);
    setProdutoQuery("");
    setQuantidade("");
    setModalVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={[styles.container, { flex: 1 }]}>
            {/* TOPO FIXO */}
            <Text style={styles.titulo}>CLIENTE {cliente.Cliente}</Text>

            <Text style={styles.label}>Selecione o produto</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.input}
            >
              <Text>
                {produtoSelecionado
                  ? produtoSelecionado.Produto
                  : "Clique para selecionar"}
              </Text>
            </TouchableOpacity>

            <View style={styles.quantidade}>
              <Text style={styles.label}>Quantidade</Text>
              <TextInput
                keyboardType="numeric"
                style={styles.inputText}
                placeholder="0"
                value={quantidade}
                onChangeText={setQuantidade}
              />
            </View>

            {produtoSelecionado && quantidade ? (
              <Text style={styles.total}>
                Item:{" "}
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(
                  parseFloat((quantidade || "0").replace(",", ".")) *
                    parseFloat(produtoSelecionado["Valor"] || 0)
                )}
              </Text>
            ) : null}

            <TouchableOpacity style={styles.botaoSave} onPress={adicionarItem}>
              <Text style={styles.botaoTexto}>Adicionar Produto</Text>
            </TouchableOpacity>

            {/* LISTA ROLÁVEL */}
            <FlatList
              data={itensPedido}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={true}
              scrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              contentContainerStyle={{ paddingBottom: 20 }}
              style={{ flex: 1 }} // 👈 rola apenas a FlatList
              renderItem={({ item }) => (
                <View style={styles.itemLinha}>
                  <View style={styles.produtoLinha}>
                    <Text>
                      {item.quantidade}x - {item.nome} - R${" "}
                      {item.total.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.botaoRemoverProdutoLinha}>
                    <TouchableOpacity
                      onPress={() =>
                        Alert.alert("Cancelar", "Deseja remover este item?", [
                          { text: "Não", style: "cancel" },
                          {
                            text: "Sim",
                            onPress: () => removerItem(item.id),
                          },
                        ])
                      }
                    >
                      <Text style={{ color: "red" }}>Remover</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />

            {/* RODAPÉ FIXO */}
            <Text style={styles.total}>
              Total Pedido: R${" "}
              {itensPedido.reduce((acc, i) => acc + i.total, 0).toFixed(2)}
            </Text>

            <View style={styles.ultimoContainer}>
              <Text style={styles.label}>Forma de Pagamento</Text>
              <FlatList
                data={["A VISTA", "PIX", "VALE", "CARTÃO", "BOLETO", "CHEQUE"]}
                keyExtractor={(item) => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.opcaoPagamento,
                      formaPagamento === item && styles.opcaoSelecionada,
                    ]}
                    onPress={() => setFormaPagamento(item)}
                  >
                    <Text style={styles.opcaoTexto}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            <View style={styles.containerButton}>
              <TouchableOpacity
                style={[styles.botaoCondition, { backgroundColor: "red" }]}
                onPress={() => {
                  Alert.alert("Cancelar", "Deseja cancelar o pedido?", [
                    { text: "Não", style: "cancel" },
                    {
                      text: "Sim",
                      onPress: () => navigation.navigate("Client"),
                    },
                  ]);
                }}
              >
                <Text style={styles.botaoTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.botaoCondition, { backgroundColor: "green" }]}
                onPress={() => {
                  Alert.alert("Salvar", "Deseja salvar o pedido?", [
                    { text: "Não", style: "cancel" },
                    { text: "Sim", onPress: () => salvarPedido() },
                  ]);
                }}
              >
                <Text style={styles.botaoTexto}>Salvar Pedido</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* MODAL PRODUTO */}
          <ModalSelecionarProduto
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            produtos={produtos}
            query={produtoQuery}
            setQuery={setProdutoQuery}
            onSelecionar={(item) => {
              setProdutoSelecionado(item);
              setProdutoQuery(String(item.Produto));
            }}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "400",
    marginBottom: 10,
    textAlign: "center",
  },
  label: {
    marginTop: 4,
    marginBottom: 4,
    fontWeight: "400",
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  quantidade: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  inputText: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
    width: "20%",
    height: 50,
    textAlign: "center",
    fontSize: 30,
    fontWeight: "600",
    backgroundColor: "#fff",
  },
  itemLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  botaoSave: {
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 10,
  },
  botaoCondition: {
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    width: "45%",
  },
  botaoTexto: {
    color: "white",
    textAlign: "center",
  },
  total: {
    fontWeight: "bold",
    marginTop: 15,
    textAlign: "center",
    fontSize: 18,
    marginBottom: 10,
  },
  containerButton: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  opcaoPagamento: {
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: 70,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    marginLeft: 8,
  },
  opcaoSelecionada: {
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },
  opcaoTexto: {
    color: "#333",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  sugestaoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  ultimoContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  produtoLinha: {
    width: "83%",
  },
  botaoRemoverProdutoLinha: {
    width: "18%",
  },
});
