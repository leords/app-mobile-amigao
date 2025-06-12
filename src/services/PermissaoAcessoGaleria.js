import { CapturarSalvarImagem } from "./CapturarSalvarImagem";
import { Alert, Platform } from "react-native";
import * as MediaLibrary from "expo-media-library";

export const PermissaoAcessoGaleria = async (viewRef) => {
  try {
    const permission = await MediaLibrary.requestPermissionsAsync();

    if (permission.status !== "granted") {
      Alert.alert("Permissão negada", "Não foi possível acessar a galeria.");
      return;
    }

    await new Promise((r) => setTimeout(r, 200));
    await CapturarSalvarImagem(viewRef);
  } catch (error) {
    console.log("Erro ao solicitar permissão:", error);
    Alert.alert(
      "Erro",
      "Houve um erro ao solicitar permissão para salvar imagem."
    );
  }
};
