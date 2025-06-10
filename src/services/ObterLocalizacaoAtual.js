import * as Location from "expo-location";

export async function ObterLocalizacaoAtual() {
  try {
    // Solicita permissão
    const { status } = await Location.requestForegroundPermissionsAsync();

    //valida permissão
    if (status !== "granted") {
      throw new Error("Permissão de localização negada");
    }

    // Obtém a localização atual
    const localizacao = await Location.getCurrentPositionAsync({});

    return {
      latitude: localizacao.coords.latitude,
      longitude: localizacao.coords.longitude,
    };
  } catch (error) {
    console.error("Erro ao obter localização:", error);
    return null;
  }
}
