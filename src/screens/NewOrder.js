import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Autocomplete from 'react-native-autocomplete-input';
import { useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Pedido() {
  const [produtos, setProdutos] = useState([]);
  const [produtoQuery, setProdutoQuery] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState('');
  const [itensPedido, setItensPedido] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

  const navigation = useNavigation();

  const route = useRoute();
  const { cliente } = route.params;

  useEffect(() => {
    const carregarProdutos = async () => {
      const dados = await AsyncStorage.getItem('@produtos');
      if (dados) setProdutos(JSON.parse(dados));
    };
    carregarProdutos();
  }, []);

  const adicionarItem = () => {
    if (!produtoSelecionado || !quantidade) return;

    const preco = parseFloat(produtoSelecionado['Valor Und']);
    const qtd = parseInt(quantidade);
    const total = preco * qtd;

    const novoItem = {
      id: Date.now(),
      nome: produtoSelecionado.Produto,
      preco,
      quantidade: qtd,
      total,
    };

    setItensPedido([...itensPedido, novoItem]);
    setProdutoSelecionado(null);
    setProdutoQuery('');
    setQuantidade('');
    setMostrarSugestoes(false); // Impede que a lista reabra
  };

  const removerItem = (id) => {
    const novaLista = itensPedido.filter(item => item.id !== id);
    setItensPedido(novaLista);
  };

  const salvarPedido = async () => {
    const pedido = {
      id: Date.now(),
      cliente,
      itens: itensPedido,
      total: itensPedido.reduce((acc, i) => acc + i.total, 0),
    };

    const pedidosAntigos = JSON.parse(await AsyncStorage.getItem('@pedidos')) || [];
    await AsyncStorage.setItem('@pedidos', JSON.stringify([...pedidosAntigos, pedido]));

    // Resetar
    setItensPedido([]);
    setProdutoQuery('');
    setProdutoSelecionado(null);
    setQuantidade('');
    setMostrarSugestoes(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>CLIENTE {cliente.Cliente}</Text>

      {/* Produto */}
      <Text style={styles.label}>Selecione o produto</Text>
      <Autocomplete
        data={
          produtoSelecionado || !mostrarSugestoes
            ? []
            : produtos.filter(p =>
                typeof p.Produto === 'string' &&
                p.Produto.toLowerCase().includes((produtoQuery || '').toLowerCase())
              )
        }
        defaultValue={produtoQuery}
        onChangeText={text => {
          setProdutoQuery(text);
          setProdutoSelecionado(null); 
          setMostrarSugestoes(true);
        }}
        keyExtractor={(item) => item.Id.toString()}
        flatListProps={{
          keyExtractor: (item) => item.Id.toString(),
          renderItem: ({ item }) => (
            <TouchableOpacity onPress={() => {
              setProdutoSelecionado(item);
              setProdutoQuery(item.Produto);
              setMostrarSugestoes(false);
            }}>
              <Text style={styles.item}>{item.Produto}</Text>
            </TouchableOpacity>
          ),
        }}
        inputContainerStyle={styles.input}
      />

      {/* Quantidade */}
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
      {/* Total item */}
      {produtoSelecionado && quantidade ? (
        <Text style={styles.total}>Item: R$ {(produtoSelecionado['Valor'] * parseInt(quantidade)).toFixed(2)}</Text>
      ) : null}

      <TouchableOpacity style={styles.botaoSave} onPress={adicionarItem}>
        <Text style={styles.botaoTexto}>Adicionar Produto</Text>
      </TouchableOpacity>

      {/* Lista de produtos adicionados */}
      <FlatList
        data={itensPedido}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemLinha}>
            <Text>{item.quantidade}x {item.nome} - R$ {item.total.toFixed(2)}</Text>
            <TouchableOpacity onPress={() => removerItem(item.id)}>
              <Text style={{ color: 'red' }}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Text style={styles.total}>Total Pedido: R$ {itensPedido.reduce((acc, i) => acc + i.total, 0).toFixed(2)}</Text>
        <View style={styles.containerButton}>

          <TouchableOpacity 
            style={[styles.botaoCondition, { backgroundColor: 'red' }]} 
            onPress={ () => {
              Alert.alert(
                "Confirmar Cancelar",
                "Deseja realmente cancelar o pedido?",
                [
                  { text: "Não", style: "cancel" },
                  { text: "Sim", onPress: () => navigation.navigate('Home') }
                ]
              );
            } }>
              <Text style={styles.botaoTexto}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.botaoCondition, { backgroundColor: 'green' }]} 
            onPress={() => {
              Alert.alert(
                "Confirmar Salvar",
                "Deseja realmente salvar o pedido?",
                [
                  { text: "Não", style: "cancel" },
                  { text: "Sim", onPress: () => salvarPedido() }
                ]
              );
            }}>
            <Text style={styles.botaoTexto}>Salvar Pedido</Text>
          </TouchableOpacity>

        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20 
  },
  titulo: {
    fontSize: 20, 
    fontWeight: '400', 
    marginBottom: 10,
    textAlign: 'center'
  },
  label: { 
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 600
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 5,
  },
  quantidade: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  inputText: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 8, 
    marginBottom: 10, 
    borderRadius: 5,
    width: '20%',
    height: 80,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 600
  },
  item: { 
    padding: 10, 
    borderBottomWidth: 1, 
    borderColor: '#eee' 
  },
  botaoSave: { 
    backgroundColor: '#444', 
    padding: 12, 
    borderRadius: 8, 
    marginVertical: 10 
  },
  botaoCondition: {
    backgroundColor: '#444', 
    padding: 12, 
    borderRadius: 8, 
    marginVertical: 10,
    width: '45%'
  },
  botaoTexto: { 
    color: 'white', 
    textAlign: 'center' 
  },
  itemLinha: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 8,
  },
  total: { 
    fontWeight: 'bold', 
    marginTop: 20,
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20
  },
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }

});
