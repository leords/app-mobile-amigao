import { CapturarSalvarImagem } from "./CapturarSalvarImagem";
import { Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";

export const PermissaoAcessoGaleria = async (viewRef) => {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  // Solicitar permissão de acesso
  if (!permissionResponse?.granted) {
    const permission = await requestPermission();
    if (!permission.granted) {
      Alert.alert("Permissão negada", "Não foi possível acessar a galeria.");
      return;
    }
  }
  // cria um delay na aplicação.
  await new Promise((r) => setTimeout(r, 200));
  await CapturarSalvarImagem(viewRef);
};
