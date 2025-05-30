import * as Network from "expo-network";

export const ConnectionTest = async () => {
  const networkState = await Network.getNetworkStateAsync();
  return networkState.isConnected && networkState.isInternetReachable;
};
