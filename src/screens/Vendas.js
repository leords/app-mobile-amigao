import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import VendaCard from "../components/VendaCard";
import colors from "../styles/colors";
import Cabecalho from "../components/Cabecalho";
import { useAuth } from "../context/AuthContext";
import { buscarVendasDaAPI } from "../services/VendasService";

export default function Vendas() {
  const [vendas, setVendas] = useState([]);
  const [indexSelecionado, setIndexSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [recarregar, setRecarregar] = useState(true);
  const { user } = useAuth();

  const image = require("../assets/logo.png");

  useEffect(() => {
    const buscarVendas = async () => {
      try {
        await buscarVendasDaAPI(
          user,
          setVendas,
          setLoading,
          setRecarregar,
          setErro
        );
      } catch (error) {
        console.error("Erro ao buscar as vendas:", error);
      }
    };

    buscarVendas();
  }, [recarregar]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.danger }}>{erro}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Cabecalho
        onPress={() => setRecarregar(!recarregar)}
        icone={"reload"}
        descriptionIcone={"Atualizar"}
        image={image}
      />
      <FlatList
        data={vendas}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item, index }) => (
          <VendaCard
            item={item}
            isExpanded={indexSelecionado === index}
            onPress={() =>
              setIndexSelecionado(index === indexSelecionado ? null : index)
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
