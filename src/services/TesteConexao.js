import * as Network from "expo-network";

export const testeConexao = async () => {
  const networkState = await Network.getNetworkStateAsync();
  return networkState.isConnected && networkState.isInternetReachable;
};
