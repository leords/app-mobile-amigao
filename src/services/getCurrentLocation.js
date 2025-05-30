import * as Location from "expo-location";

export async function getCurrentLocation() {
  try {
    // Solicita permissão
    const { status } = await Location.requestForegroundPermissionsAsync();

    //valida permissão
    if (status !== "granted") {
      throw new Error("Permissão de localização negada");
    }

    // Obtém a localização atual
    const location = await Location.getCurrentPositionAsync({});

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error("Erro ao obter localização:", error);
    return null;
  }
}
