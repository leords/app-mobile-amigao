import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { AuthStack } from "./AuthStack";
import { PrivateStack } from "./PrivateStack";
import { useAuth } from "../context/AuthContext";
import { buscarStorage } from "../storage/ControladorStorage";

export const AppNavigator = () => {
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useAuth();

  useEffect(() => {
    const checkUser = async () => {
      // busca o storaged de usuarios
      //const storedUser = await AsyncStorage.getItem("@user");
      const storedUser = await buscarStorage("@user");
      console.log("Usuário do storage: ", storedUser);
      // valida a existencia
      if (storedUser !== null) {
        // seta em user já no tipo JSON
        setUser(storedUser);
        console.log("user is:", user);
        setLoading(false);
      } else {
        setLoading(false);
      }
      // validado ele cancela o loading
      //setLoading(false);
    };
    checkUser();
  }, []);

  // componente para loading
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    // Navigation confirma se usuário existe e caso exista, chama o PrivateStack que são rotas privadas!!
    // se não, vai para o AuthStack que é a rota de Login.
    <NavigationContainer>
      {user ? <PrivateStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
