import React from "react";
import colors from "../styles/colors";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function SaleCard({ item, isExpanded, onPress }) {
  // Formatando a data
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, isExpanded && styles.expanded]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>VDE: {item.Vendedor}</Text>
        <Text style={styles.date}>{formatDate(item.Data)}</Text>
      </View>
      <Text style={styles.amount}>
        R${" "}
        {item.ValorDeVenda.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}
      </Text>
      <Text style={styles.orders}>Total de {item.Quantidade} pedidos</Text>

      {isExpanded && (
        <View>
          <View style={styles.divider} />
          <View style={styles.details}>
            <View style={styles.column}>
              <Text style={{ color: "#198754" }}>
                À vista: {((item.AVista / item.Quantidade) * 100).toFixed(1)}%
              </Text>
              <Text style={{ color: "#FFC107" }}>
                Vale: {((item.Vale / item.Quantidade) * 100).toFixed(1)}%
              </Text>
              <Text style={{ color: "#6C757D" }}>
                Boleto: {((item.Boleto / item.Quantidade) * 100).toFixed(1)}%
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={{ color: "#0D6EFD" }}>
                Cartão: {((item.Cartao / item.Quantidade) * 100).toFixed(1)}%
              </Text>
              <Text style={{ color: "#6610F2" }}>
                Cheque: {((item.Cheque / item.Quantidade) * 100).toFixed(1)}%
              </Text>
              <Text style={{ color: "#20C997" }}>
                Pix: {((item.Pix / item.Quantidade) * 100).toFixed(1)}%
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text
            style={[
              styles.returnOrders,
              item.Devolucao === 0
                ? { color: "#212529" }
                : { color: "#DC3545" },
            ]}
          >
            Devolução: {item.Devolucao}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DEE2E6",
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 8,
    padding: 20,
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  expanded: {
    transform: [{ scale: 1 }],
    opacity: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "500",
    fontStyle: "italic",
    fontSize: 13,
    color: "#495057",
  },
  date: {
    fontStyle: "italic",
    fontSize: 13,
    color: "#6C757D",
  },
  amount: {
    fontSize: 22,
    fontWeight: "500",
    marginVertical: 6,
    textAlign: "center",
    marginTop: 16,
    color: "#212529",
  },
  divider: {
    height: 1,
    backgroundColor: "#CED4DA",
    width: "100%",
    marginVertical: 16,
  },
  orders: {
    fontSize: 16,
    fontWeight: "400",
    marginVertical: 4,
    textAlign: "center",
    color: "#495057",
  },
  details: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  column: {
    flexDirection: "column",
    flex: 1,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
  },
  returnOrders: {
    marginTop: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
});
