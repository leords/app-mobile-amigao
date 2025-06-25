import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Alert,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  Modal,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from "@react-navigation/native";
import { GpsCliente } from "../utils/GeradorGPSCliente";
import {
  atualizarStorage,
  criarCallbackAdicionarPedido,
} from "../storage/ControladorStorage";

export default function Pedido() {
  const [produtos, setProdutos] = useState([]);
  const [produtoQuery, setProdutoQuery] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState("");
  const [itensPedido, setItensPedido] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState("A VISTA");

  const navegacao = useNavigation();
  const route = useRoute();
  const { cliente } = route.params;

  useEffect(() => {
    const carregarProdutos = async () => {
      const dados = await AsyncStorage.getItem("@produtos");
      if (dados) setProdutos(JSON.parse(dados));
    };
    carregarProdutos();
  }, []);

  const adicionarItem = () => {
    if (!produtoSelecionado || !quantidade) return;
    const preco = parseFloat(produtoSelecionado["Valor"]);
    const qtd = parseInt(quantidade);
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
    const dataFormatada = dataAtual.toLocaleDateString("pt-BR");

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
    setProdutoQuery("");
    setProdutoSelecionado(null);
    setQuantidade("");
    setModalVisible(false);
  };

  const filtrarProdutos = (query) => {
    if (!query) return [];
    return produtos.filter(
      (p) =>
        p?.Produto &&
        typeof p.Produto === "string" &&
        p.Produto.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.titulo}>CLIENTE {cliente.Cliente}</Text>

          <Text style={styles.label}>Selecione o produto</Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.input}
          >
            <Text>
              {produtoSelecionado
                ? produtoSelecionado.Produto
                : "Digite ou selecione um produto"}
            </Text>
          </TouchableOpacity>

          <View style={styles.quantidade}>
            <Text style={styles.label}>Quantidade</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.inputText}
              placeholder="?"
              value={quantidade}
              onChangeText={setQuantidade}
            />
          </View>

          {produtoSelecionado && quantidade ? (
            <Text style={styles.total}>
              Item: R${" "}
              {(produtoSelecionado["Valor"] * parseInt(quantidade)).toFixed(2)}
            </Text>
          ) : null}

          <TouchableOpacity style={styles.botaoSave} onPress={adicionarItem}>
            <Text style={styles.botaoTexto}>Adicionar Produto</Text>
          </TouchableOpacity>

          <FlatList
            data={itensPedido}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemLinha}>
                <Text>
                  {item.quantidade}x {item.nome} - R$ {item.total.toFixed(2)}
                </Text>
                <TouchableOpacity onPress={() => removerItem(item.id)}>
                  <Text style={{ color: "red" }}>Remover</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <Text style={styles.total}>
            Total Pedido: R${" "}
            {itensPedido.reduce((acc, i) => acc + i.total, 0).toFixed(2)}
          </Text>

          <Text style={styles.label}>Forma de Pagamento</Text>
          <FlatList
            data={["A VISTA", "CARTÃO", "PIX", "CHEQUE"]}
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

          <View style={styles.containerButton}>
            <TouchableOpacity
              style={[styles.botaoCondition, { backgroundColor: "red" }]}
              onPress={() => {
                Alert.alert(
                  "Confirmar Cancelar",
                  "Deseja realmente cancelar o pedido?",
                  [
                    { text: "Não", style: "cancel" },
                    {
                      text: "Sim",
                      onPress: () => navegacao.navigate("Home"),
                    },
                  ]
                );
              }}
            >
              <Text style={styles.botaoTexto}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botaoCondition, { backgroundColor: "green" }]}
              onPress={() => {
                Alert.alert(
                  "Confirmar Salvar",
                  `Deseja realmente salvar o pedido no ${formaPagamento}?`,
                  [
                    { text: "Não", style: "cancel" },
                    { text: "Sim", onPress: () => salvarPedido() },
                  ]
                );
              }}
            >
              <Text style={styles.botaoTexto}>Salvar Pedido</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal funcional de seleção de produto */}

        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
          transparent={Platform.OS === "ios" ? true : false} // TRANSPARENTE SOMENTE NO IOS
        >
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 100}
              style={styles.modalContainer}
            >
              <TextInput
                style={styles.input}
                placeholder="Digite o nome do produto"
                value={produtoQuery}
                onChangeText={(text) => setProdutoQuery(text)}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
              <FlatList
                data={filtrarProdutos(produtoQuery)}
                keyExtractor={(item) => item.Id.toString()}
                keyboardShouldPersistTaps="handled"
                removeClippedSubviews={false}
                style={styles.listaProdutos}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.sugestaoItem}
                    onPress={() => {
                      setProdutoSelecionado(item);
                      setProdutoQuery(item.Produto);
                      setModalVisible(false);
                    }}
                  >
                    <Text>{item.Produto}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={{ padding: 10, textAlign: "center" }}>
                    Nenhum produto encontrado
                  </Text>
                }
              />

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.botaoSave, { marginTop: 20 }]}
              >
                <Text style={styles.botaoTexto}>Fechar</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
    fontWeight: "600",
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
    marginTop: 40,
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
    marginVertical: 10,
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
    marginTop: 20,
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
  },
  containerButton: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  opcaoPagamento: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    marginLeft: 13,
  },
  opcaoSelecionada: {
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },
  opcaoTexto: {
    color: "#333",
    fontWeight: "bold",
  },
  sugestaoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Platform.OS === "ios" ? "rgba(0,0,0,0.4)" : "#fff", // branco no Android para modal sólida
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: "100%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  listaProdutos: {
    maxHeight: 250,
    marginTop: 10,
  },
});
