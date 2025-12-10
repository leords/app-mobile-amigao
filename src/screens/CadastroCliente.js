import { useState } from "react";
import {
  Alert,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Cabecalho from "../components/Cabecalho";
import { BuscarCNPJ } from "../services/buscarCNPJ";
import { validarCNPJ } from "../utils/ValidarCNPJ";
import { validarCPF } from "../utils/ValidarCPF";
import { gerarNumeroUID } from "../utils/Uid";
import { useAuth } from "../context/AuthContext";
import { enviarSolicitacaoNovoCadastroPlanilha } from "../services/enviarSolicitacaoNovoCadastroPlanilha";
import { dataHoraFormatada } from "../utils/Data";
import { adicionarStorage } from "../storage/ControladorStorage";
import { useNavigation } from "@react-navigation/native";

export default function CadastroCliente() {
  const [identificadorUnico, setIdentificadorUnico] = useState("");
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [frequencia, setFrequencia] = useState("");
  const [atendimento, setAtendimento] = useState("");
  const [feedback, setFeedback] = useState("");
  const [editable, setEditable] = useState(false);
  const [retornoValidacao, setRetornoValidacao] = useState("");
  const [MEI, setMEI] = useState();

  const imagem = require("../assets/logo.png");

  const { user, sincronizando, setSincronizando } = useAuth();

  const navegacao = useNavigation();

  const processarCNPJ = async () => {
    try {
      if (!validarCNPJ(identificadorUnico)) {
        setFeedback("Verifique se o CNPJ está correto");
        throw new Error("CNPJ inválido");
      }
      setFeedback("");
      setEditable(false);
      const dados = await BuscarCNPJ(identificadorUnico);
      setRetornoValidacao("CNPJ válido");

      setNome(dados.nome_fantasia);
      setCidade(dados.municipio);
      setEndereco(`${dados.logradouro}, ${dados.numero} - ${dados.bairro}`);
      setTelefone(dados.ddd_telefone_1);
      setMEI(dados.opcao_pelo_mei);
      if (MEI) {
        setRetornoValidacao("CNPJ MEI válido. Preencha o nome!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const processarCPF = () => {
    try {
      if (!validarCPF(identificadorUnico)) {
        setFeedback("Verifique se o CPF está correto");
        throw new Error("CPF inválido");
      }
      setEditable(true);
      setRetornoValidacao("CPF válido. Preencha todos os dados abaixo!");
    } catch (error) {
      console.log(error);
    }
  };

  const enviarCadastro = async () => {
    setSincronizando(true);
    try {
      if (!frequencia || !atendimento) {
        Alert.alert("Atendimento e frequencia são obrigatórios!");
      }

      const novoCadastro = [
        gerarNumeroUID(),
        nome.toUpperCase(),
        identificadorUnico.toUpperCase(),
        "",
        cidade.toUpperCase(),
        endereco.toUpperCase(),
        telefone,
        user.toUpperCase(),
        atendimento.toUpperCase(),
        frequencia.toUpperCase(),
        "ATIVO",
      ];

      const novoCadastroLista = {
        data: dataHoraFormatada(),
        id: novoCadastro[0],
        nome: nome,
        identificadorUnico,
        cidade,
        endereco,
        telefone,
        user,
        atendimento,
        frequencia,
      };

      //transforma os valores do objeto em um array
      const valores = Object.values(novoCadastroLista);

      const camposValidos = valores.some(
        (c) => c === undefined || c === null || c === ""
      );

      if (camposValidos) {
        Alert.alert("Preencha todos os campos!");
        setSincronizando(false);

        return; //interrompe aqui
      }

      await adicionarStorage("@cadastro", novoCadastroLista);

      const cadastro = await enviarSolicitacaoNovoCadastroPlanilha(
        novoCadastro
      );

      if (cadastro.ok) {
        Alert.alert("Cadastro realizado com sucesso!");
        setIdentificadorUnico("");
        setNome("");
        setCidade("");
        setEndereco("");
        setTelefone("");
        setFrequencia("");
        setAtendimento("");
        setFeedback("");
        setEditable(false);

        setSincronizando(false);
      } else if (
        cadastro.ok &&
        cadastro.message === "Formato de dados inválido"
      ) {
        Alert.alert("Formato de dados inválido");
        setSincronizando(false);
      } else {
        Alert.alert("Erro ao cadastrar");
        setSincronizando(false);
      }
    } catch (error) {
      setSincronizando(false);
      console.log(error);
    }
  };

  return (
    <View style={estilos.container}>
      {sincronizando ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="red" marginTop={30} />
          <Text style={{ marginTop: 20 }}>Aguarde um momento...</Text>
        </View>
      ) : (
        <>
          <Cabecalho
            onPress={() => {
              navegacao.navigate("ListaCadastros");
            }}
            icone="list"
            descriptionIcone="Cadastros"
            image={imagem}
          />

          {/* 🔽 ScrollView aqui */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={estilos.scrollContainer}
            style={{ backgroundColor: "#f8f7f7ff", borderRadius: 5 }}
          >
            {/* Identificador Único */}
            <View style={estilos.containerCodigoUnico}>
              <Text style={estilos.label}>Digite o CNPJ ou CPF:</Text>

              <TextInput
                style={estilos.input}
                keyboardType="decimal-pad"
                placeholder="Digite sem formatação."
                value={identificadorUnico}
                onChangeText={setIdentificadorUnico}
              />

              <TouchableOpacity
                style={estilos.botao}
                onPress={() => {
                  if (identificadorUnico.length === 14) return processarCNPJ();
                  if (identificadorUnico.length === 11) return processarCPF();

                  Alert.alert(
                    "Atenção",
                    "Digite um CNPJ (14 dígitos) ou CPF (11 dígitos)."
                  );
                }}
              >
                <Text style={estilos.textoBotao}>VALIDAR</Text>
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "300",
                  marginTop: 6,
                  color: "#117e17ff",
                }}
              >
                {retornoValidacao}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "200",
                  marginTop: 4,
                  color: "red",
                }}
              >
                {feedback}
              </Text>

              <View style={estilos.divisor} />
            </View>

            {/* Campos principais */}
            <View style={estilos.containerInput}>
              {/* CamposTexto é um componente criado abaixo */}
              {MEI ? (
                <CampoTexto
                  label="Nome"
                  valor={nome}
                  editavel={true}
                  setValor={setNome}
                />
              ) : (
                <CampoTexto
                  label="Nome"
                  valor={nome}
                  editavel={editable}
                  setValor={setNome}
                />
              )}
              <CampoTexto
                label="Cidade"
                valor={cidade}
                editavel={editable}
                setValor={setCidade}
              />
              <CampoTexto
                label="Endereço"
                valor={endereco}
                editavel={editable}
                setValor={setEndereco}
              />
              <CampoTexto
                label="Telefone"
                valor={telefone}
                setValor={setTelefone}
              />
            </View>

            {/* Atendimento */}
            <View style={estilos.containerLista}>
              <Text style={estilos.label}>Atendimento:</Text>
              <FlatList
                data={["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA"]}
                keyExtractor={(item) => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      estilos.itemLista,
                      atendimento === item && estilos.itemSelecionado,
                    ]}
                    onPress={() => setAtendimento(item)}
                  >
                    <Text
                      style={[
                        estilos.textoItem,
                        atendimento === item && estilos.textoSelecionado,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Frequência */}
            <View style={estilos.containerLista}>
              <Text style={estilos.label}>Frequência:</Text>
              <FlatList
                data={["SEMANAL", "QUINZENAL"]}
                keyExtractor={(item) => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      estilos.itemLista,
                      frequencia === item && estilos.itemSelecionado,
                    ]}
                    onPress={() => setFrequencia(item)}
                  >
                    <Text
                      style={[
                        estilos.textoItem,
                        frequencia === item && estilos.textoSelecionado,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Botão Final */}
            <TouchableOpacity
              style={[estilos.botao, { marginTop: 30, marginBottom: 40 }]}
              onPress={() => enviarCadastro()}
            >
              <Text style={estilos.textoBotao}>CADASTRAR</Text>
            </TouchableOpacity>
          </ScrollView>
        </>
      )}
    </View>
  );
}

function CampoTexto({ label, valor, setValor, editavel }) {
  return (
    <View style={estilos.campoContainer}>
      <Text style={estilos.labelCampo}>{label}</Text>
      <TextInput
        style={estilos.input}
        value={valor}
        onChangeText={setValor}
        editable={editavel}
        placeholder=""
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 14,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 60, // 👈 garante espaço para rolar até o final
  },
  containerCodigoUnico: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    width: "100%",
    color: "#6d6b6bff",
  },
  botao: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#56C56A",
    height: 48,
    width: "100%",
    borderRadius: 10,
    marginTop: 10,
  },
  textoBotao: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  divisor: {
    borderBottomWidth: 1,
    borderBottomColor: "#aaa",
    borderStyle: "dashed",
    marginVertical: 15,
    width: "100%",
  },
  containerInput: {},
  campoContainer: {
    marginBottom: 10,
  },
  labelCampo: {
    fontSize: 14,
    fontWeight: "500",
    color: "#575454",
  },
  containerLista: {
    marginTop: 20,
  },
  itemLista: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    marginRight: 10,
  },
  itemSelecionado: {
    backgroundColor: "#56C56A",
    borderColor: "#56C56A",
  },
  textoItem: {
    color: "#333",
    fontWeight: "500",
  },
  textoSelecionado: {
    color: "#FFF",
  },
});
