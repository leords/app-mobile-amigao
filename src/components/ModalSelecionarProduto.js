// components/ModalSelecionarProduto.js
import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";

export default function ModalSelecionarProduto({
  visible,
  onClose,
  produtos,
  query,
  setQuery,
  onSelecionar,
}) {
  const filtrarProdutos = (busca) => {
    if (!busca) return [];
    return produtos.filter(
      (p) =>
        p?.Produto &&
        typeof p.Produto === "string" &&
        p.Produto.toLowerCase().includes(busca.toLowerCase())
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome do produto"
              value={query}
              onChangeText={setQuery}
              autoFocus
              returnKeyType="done"
            />

            <FlatList
              data={filtrarProdutos(query)}
              keyExtractor={(item) => item.Id.toString()}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.sugestaoItem}
                  onPress={() => {
                    Keyboard.dismiss();
                    onSelecionar(item); // Função recebida como prop
                    setTimeout(onClose, Platform.OS === "android" ? 250 : 0);
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
              onPress={onClose}
              style={[styles.botaoSave, { marginTop: 10 }]}
            >
              <Text style={styles.botaoTexto}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  sugestaoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  botaoSave: {
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 8,
  },
  botaoTexto: {
    color: "white",
    textAlign: "center",
  },
});
