// App.js
import { SafeAreaView, StatusBar } from "react-native";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
        <AppNavigator />
      </SafeAreaView>
    </AuthProvider>
  );
}
