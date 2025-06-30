import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator } from "react-native";
import React, { use, useEffect, useState } from "react";
import { AuthStack } from "./AuthStack";
import { PrivateStack } from "./PrivateStack";
import { useAuth } from "../context/AuthContext";
import { buscarStorage } from "../storage/ControladorStorage";

export const AppNavigator = () => {
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useAuth();

  useEffect(() => {
    const checkUser = async () => {
      const storedUser = await buscarStorage("@user");
      // valida a existencia
      if (storedUser && typeof storedUser == "string") {
        setUser(storedUser);
        setLoading(false);
      } else {
        setLoading(false);
      }
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
