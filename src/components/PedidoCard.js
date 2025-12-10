import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { buscarStorage } from "../storage/ControladorStorage";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";

// Componente exportado como Reac.memo, evita que o mesmo
// seja re-renderizado caso não haja nenhuma alteração em suas props.

function PedidoCard({ pedido, index, refs, baixarImagem, apagarPedido }) {
  const [statusPedido, setStatusEnviado] = useState("digitado");

  useFocusEffect(
    useCallback(() => {
      const buscarPedidosLineares = async () => {
        //coleto o pedidosLineares por causa que são eles que apagamos e deletamos antes de enviar para API.
        const storagePedidosLineares = await buscarStorage("@pedidosLineares");

        if (Array.isArray(storagePedidosLineares)) {
          const pedidoAtual = storagePedidosLineares[index];
          if (pedidoAtual?.meta?.status === "enviado") {
            setStatusEnviado("enviado");
          } else if (pedidoAtual?.meta?.status === "pendente") {
            setStatusEnviado("pendente");
          } else {
            setStatusEnviado("digitado");
          }
        }
      };
      buscarPedidosLineares();
    }, [index])
  );

  return (
    <View
      ref={(el) => (refs.current[index] = el)}
      collapsable={false}
      style={styles.pedidoBox}
    >
      <View style={styles.pedidoHeader}>
        <Text style={styles.numeroPedido}>{pedido.cabecalho?.[0]}</Text>
        <Text style={styles.numeroPedido}>Nº: {index + 1}</Text>
      </View>

      <Text style={styles.tituloNota}>CÓPIA DE NOTA DE PEDIDO</Text>
      <Text style={styles.nomeEmpresa}>
        AMIGAO DISTRIBUIDORA DE BEBIDAS LTDA
      </Text>
      <Text style={styles.cnpj}>CNPJ: 41.836.758/0001-41</Text>
      <Text style={styles.endereco}>
        R. Pastor George Weger, 120 - Centro, Canoinhas - SC, 89460-144
      </Text>

      <View style={styles.titulosColunas}>
        <Text style={styles.colunaLabel}>Destinatário/Remetente</Text>
        <Text style={styles.colunaLabel}>Vendedor</Text>
      </View>

      <View style={styles.infoColunas}>
        <Text style={styles.infoColuna}>
          {pedido.cabecalho?.[1] ?? "Desconhecido"}
        </Text>
        <Text style={styles.infoColuna}>
          {pedido.cabecalho?.[2] ?? "Desconhecido"}
        </Text>
      </View>

      <View style={styles.tabelaTitulos}>
        <Text style={styles.colunaTitulo}>QTD</Text>
        <Text style={styles.colunaTitulo}>PRODUTO</Text>
        <Text style={styles.colunaTitulo}>R$ UND</Text>
        <Text style={styles.colunaTitulo}>TOTAL</Text>
      </View>

      {Array.isArray(pedido.itensPedido) &&
        pedido.itensPedido.map((item, i) => (
          <View key={i} style={styles.itemLinha}>
            <Text style={styles.itemQtd}>{item.quantidade}</Text>
            <Text style={styles.itemNome}>{item.nome}</Text>
            <Text style={styles.itemPreco}>R$ {item.preco.toFixed(2)}</Text>
            <Text style={styles.itemTotal}>R$ {item.total.toFixed(2)}</Text>
          </View>
        ))}

      <View style={styles.resumoPedido}>
        <Text style={styles.resumoTexto}>
          PAGAMENTO: {pedido.rodape?.[3] ?? "Não informado"}
        </Text>
        <Text style={styles.resumoTexto}>
          TOTAL: R$ {pedido.rodape?.[1]?.toFixed(2) ?? "0,00"}
        </Text>
      </View>

      <View style={styles.acoesPedido}>
        {statusPedido === "digitado" ? (
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Confirmar Apagar",
                "Deseja realmente apagar pedido?",
                [
                  { text: "Não", style: "cancel" },
                  { text: "Sim", onPress: () => apagarPedido(index) },
                ]
              );
            }}
          >
            <FontAwesome name="trash-o" size={22} color="red" />
          </TouchableOpacity>
        ) : statusPedido === "enviado" ? (
          <FontAwesome name="check-square-o" size={22} color="green" />
        ) : (
          <FontAwesome name="warning" size={22} color="orange" />
        )}

        <TouchableOpacity onPress={() => baixarImagem(index)}>
          <FontAwesome5 name="file-download" size={21} color="green" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 10,
  },
  pedidoBox: {
    marginBottom: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cccbcb",
    padding: 10,
    backgroundColor: "white",
  },
  pedidoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  numeroPedido: {
    fontSize: 12,
    textAlign: "right",
    color: "#494747",
  },
  tituloNota: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
    color: "#494747",
    marginBottom: 4,
  },
  nomeEmpresa: {
    textAlign: "center",
    fontSize: 14,
    color: "#494747",
  },
  cnpj: {
    textAlign: "center",
    fontSize: 12,
    color: "#494747",
  },
  endereco: {
    textAlign: "center",
    fontSize: 10,
    color: "#494646",
    marginTop: 10,
    borderBottomWidth: 1,
    paddingBottom: 20,
    borderColor: "#cccbcb",
  },
  titulosColunas: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoColunas: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#cccbcb",
    marginBottom: 10,
  },
  colunaLabel: {
    fontSize: 10,
    marginVertical: 10,
    marginHorizontal: 5,
    color: "#494646",
  },
  infoColuna: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 10,
    marginHorizontal: 5,
  },
  tabelaTitulos: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    marginBottom: 10,
  },
  colunaTitulo: {
    fontSize: 8,
    paddingHorizontal: 5,
    color: "#494646",
  },
  itemLinha: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    width: "100%",

    gap: 12,
  },
  itemQtd: {
    fontSize: 12,
    width: "10%",
    color: "#494747",
  },
  itemNome: {
    fontSize: 12,
    width: "35%",
    color: "#494747",
  },
  itemPreco: {
    fontSize: 12,
    width: "18%",
    textAlign: "right",
    color: "#494747",
  },
  itemTotal: {
    fontSize: 12,
    width: "22%",
    textAlign: "right",
    color: "#494747",
  },
  resumoPedido: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    borderTopWidth: 1,
    borderColor: "#cccbcb",
    paddingTop: 10,
  },
  resumoTexto: {
    fontSize: 12,
    color: "#494747",
  },
  acoesPedido: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingBottom: 5,
  },
});

export default React.memo(PedidoCard);
