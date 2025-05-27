import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Autocomplete from "react-native-autocomplete-input";
import { useRoute } from "@react-navigation/native";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Pedido() {
  const [produtos, setProdutos] = useState([]);
  const [produtoQuery, setProdutoQuery] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState("");
  const [itensPedido, setItensPedido] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState("A VISTA");

  const navigation = useNavigation();

  const route = useRoute();
  const { cliente } = route.params;

  useEffect(() => {
    const carregarProdutos = async () => {
      const dados = await AsyncStorage.getItem("@produtos");
      if (dados) setProdutos(JSON.parse(dados));
    };
    carregarProdutos();
  }, []);

  // função que salva a array do pedido na planilha
  const enviarParaPlanilha = async (linhaFinal) => {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwQbDJGwPblkVDTlGu0FJf3RFvaWKnWEASZQlwE3qrQRnC94GTYk6wcy-oj9m042jMf/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ linhaFinal }),
        }
      );

      const texto = await response.text();
      console.log("Resposta da planilha:", texto);
    } catch (err) {
      console.error("Erro ao enviar para planilha:", err);
    }
  };

  // função que adiciona um novo item no array em orçamento de produtos.
  const adicionarItem = () => {
    if (!produtoSelecionado || !quantidade) return;

    const preco = parseFloat(produtoSelecionado["Valor"]);
    const qtd = parseInt(quantidade);
    const total = preco * qtd;

    const novoItem = {
      id: Date.now(), // resolve como um ID
      quantidade: qtd,
      nome: produtoSelecionado.Produto,
      preco,
      total,
    };

    setItensPedido([...itensPedido, novoItem]);
    setProdutoSelecionado(null);
    setProdutoQuery("");
    setQuantidade("");
    setMostrarSugestoes(false); // Impede que a lista reabra
  };

  //Função que remove um item do orçamento do array do produtos
  const removerItem = (id) => {
    const novaLista = itensPedido.filter((item) => item.id !== id);
    setItensPedido(novaLista);
  };

  //Função que salva o orçamento como pedido
  const salvarPedido = async () => {
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString("pt-BR");

    //Busca por API vendedor ao fazer o login
    const vendedor = "LEONARDO";

    //Criando o cabeçalho que é padrão da planilha = data - cliente - vendedor
    const cabecalho = [dataFormatada, cliente.Cliente, vendedor];

    // ele achata os dados para uma única linha, ou seja um array inteiro de objetos em uma unica linha = [1, array1, 2, array2, ...]
    // necessario para salvar em planilhas!!!!
    const produtosLinearizados = itensPedido.flatMap((item, index) => [
      item.quantidade,
      item.nome,
      item.preco,
      item.total,
    ]);

    //Quantidade máxima de produtos (19) × 4 colunas = 76 colunas
    //Caso ter menos que isso de produtos, considere como branco a lacuna.
    while (produtosLinearizados.length < 76) {
      produtosLinearizados.push("", "", "", "");
    }
    //percorrendo os item para fazer o total
    //reduce percorre o objeto para acumular resultados, neste caso o acumulador vai somar os item.total do array itensPedido!!!
    const totalGeral = itensPedido.reduce((acc, item) => acc + item.total, 0);
    //criando o rodapé final do array
    const rodape = ["TOTAL", totalGeral, "PAGAMENTO", formaPagamento];

    //Faz a junção para criar linha final no padrão data-cliente-vendedor-produtos...
    //os 3 pontos é um = spread: desestrutura\espalha os elementos do array, possibilitando juntar todos os elementos de cada array e apenas um array, mantendo a ordem.
    //Usando spread operator para concatenar três arrays diferentes em um único array plano:
    const linhaFinal = [...cabecalho, ...produtosLinearizados, ...rodape];

    //Criando um array de objetos para organizar as partes do pedido separadamente:
    //Apenas para conseguir listar no APP
    const pedidoFinal = {
      cabecalho,
      itensPedido,
      rodape,
    };

    console.log("pedido final: ", pedidoFinal);

    //Salvar no AsyncStorage pedidos estruturados com destino apenas de lista no APP.
    const pedidosAntigos =
      JSON.parse(await AsyncStorage.getItem("@pedidos")) || [];
    await AsyncStorage.setItem(
      "@pedidos",
      JSON.stringify([...pedidosAntigos, pedidoFinal])
    );

    console.log("pedido Async", pedidosAntigos);

    //Salvar no AsyncStorage pedidos lineares com destino somente para a Planilha.
    const pedidosAntigosLineares =
      JSON.parse(await AsyncStorage.getItem("@pedidosLineares")) || [];
    await AsyncStorage.setItem(
      "@pedidosLineares",
      JSON.stringify([...pedidosAntigosLineares, linhaFinal])
    );

    //console.log('Pedido formatado para exportação:', pedidosAntigos);

    //Chamando a função que salva o array do pedido na planilha
    enviarParaPlanilha(linhaFinal);

    //Resetar as variaveis
    setItensPedido([]);
    setProdutoQuery("");
    setProdutoSelecionado(null);
    setQuantidade("");
    setMostrarSugestoes(false);
  };

  return (
    <View style={styles.container}>
      {/* TITULO + CLIENTE SELECIONADO */}
      <Text style={styles.titulo}>CLIENTE {cliente.Cliente}</Text>

      {/* LISTA PARA SELECIONAR PRODUTOS */}
      <Text style={styles.label}>Selecione o produto</Text>
      <Autocomplete
        data={
          produtoSelecionado || !mostrarSugestoes
            ? []
            : produtos.filter(
                (p) =>
                  typeof p.Produto === "string" &&
                  p.Produto.toLowerCase().includes(
                    (produtoQuery || "").toLowerCase()
                  )
              )
        }
        defaultValue={produtoQuery}
        onChangeText={(text) => {
          setProdutoQuery(text);
          setProdutoSelecionado(null);
          setMostrarSugestoes(true);
        }}
        keyExtractor={(item) => item.Id.toString()}
        flatListProps={{
          keyExtractor: (item) => item.Id.toString(),
          renderItem: ({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setProdutoSelecionado(item);
                setProdutoQuery(item.Produto);
                setMostrarSugestoes(false);
              }}
            >
              <Text style={styles.item}>{item.Produto}</Text>
            </TouchableOpacity>
          ),
        }}
        inputContainerStyle={styles.input}
      />

      {/* INPUT DE QUANTIDADE */}
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

      {/* TOTAL DO ITEM SELECIONADO */}
      {produtoSelecionado && quantidade ? (
        <Text style={styles.total}>
          Item: R${" "}
          {(produtoSelecionado["Valor"] * parseInt(quantidade)).toFixed(2)}
        </Text>
      ) : null}

      <TouchableOpacity style={styles.botaoSave} onPress={adicionarItem}>
        <Text style={styles.botaoTexto}>Adicionar Produto</Text>
      </TouchableOpacity>

      {/* LISTA DE PRODUTOS COLOCADOS NO PEDIDO */}
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

      {/* TOTAL DO PEDIDO */}
      <Text style={styles.total}>
        Total Pedido: R${" "}
        {itensPedido.reduce((acc, i) => acc + i.total, 0).toFixed(2)}
      </Text>

      {/* FORMA DE PAGAMENTO */}
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

      {/* BOTOES DE CANCELAR E SALVAR */}
      <View style={styles.containerButton}>
        <TouchableOpacity
          style={[styles.botaoCondition, { backgroundColor: "red" }]}
          onPress={() => {
            Alert.alert(
              "Confirmar Cancelar",
              "Deseja realmente cancelar o pedido?",
              [
                { text: "Não", style: "cancel" },
                { text: "Sim", onPress: () => navigation.navigate("Home") },
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
    fontWeight: 600,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  quantidade: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
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
    fontWeight: 600,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
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
  itemLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
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
});
