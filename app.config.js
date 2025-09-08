import "dotenv/config";

export default ({ config }) => ({
  ...config,
  name: "Suporte Amigão",
  slug: "app-distribuidora-amigao",
  version: "1.0.1",
  orientation: "portrait",
  icon: "./src/assets/logo.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  plugins: ["expo-location"],
  splash: {
    image: "./src/assets/logo.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    package: "com.amigao.suporte",
    permissions: [
      "READ_MEDIA_IMAGES",
      "WRITE_EXTERNAL_STORAGE",
      "READ_EXTERNAL_STORAGE",
      "ACCESS_FINE_LOCATION",
    ],
    adaptiveIcon: {
      foregroundImage: "./src/assets/logoMin.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
  },
  web: {
    favicon: "./src/assets/logo.png",
  },

  updates: {
    url: "https://u.expo.dev/b26e4981-ce4a-434d-84e2-f580482a86f9",
  },
  runtimeVersion: {
    policy: "appVersion",
  },

  extra: {
    URL_API_LOGIN: process.env.URL_API_LOGIN,
    URL_API_NOVO_PEDIDO: process.env.URL_API_NOVO_PEDIDO,
    URL_API_NOVO_GPS: process.env.URL_API_NOVO_GPS,
    URL_CLIENTES: process.env.URL_CLIENTES,
    URL_PRODUTOS: process.env.URL_PRODUTOS,
    URL_QR_CODE: process.env.URL_QR_CODE,
    URL_API_VENDAS: process.env.URL_API_VENDAS,
    URL_API_PEDIDOS_DELETADOS: process.env.URL_API_PEDIDOS_DELETADOS,
    eas: {
      projectId: "b26e4981-ce4a-434d-84e2-f580482a86f9",
    },
  },
});
