import { captureRef } from "react-native-view-shot";
import { Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as Linking from "expo-linking";

export const CapturarSalvarImagem = async (viewRef) => {
  try {
    //cria um delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    // Captura a view setada como ref como imagem
    const uri = await captureRef(viewRef, {
      format: "png",
      quality: 1,
    });

    // Salva na galeria
    const asset = await MediaLibrary.createAssetAsync(uri);
    await MediaLibrary.createAlbumAsync("Compartilhamentos", asset, false);

    // Abre o aplicativo WhatsApp
    Linking.openURL("whatsapp://app");

    Alert.alert(
      "Imagem salva!",
      "A imagem foi salva na galeria. Agora abra o WhatsApp e poste no seu Status."
    );
  } catch (error) {
    console.log("Erro ao capturar e compartilhar:", error);
    Alert.alert("Erro", "Não foi possível completar o processo.");
  }
};
