import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginPage";
import HomePage from "../screens/HomePage";
import SalesDays from "../screens/SalesDays";
import InformationPage from "../screens/InformationPage";
import ProductPage from "../screens/ProductPage";
import NewOrder from "../screens/NewOrder";
import ClientPage from "../screens/ClientPage";
import ListOrder from "../screens/ListOrders";
import Communication from "../screens/Communication";

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <NavigationContainer>
      <Navigator screenOptions={{ headerShown: false }}>
        <Screen name="Login" component={LoginScreen} />
        <Screen name="Home" component={HomePage} />
        <Screen name="SalesDay" component={SalesDays} />
        <Screen name="Info" component={InformationPage} />
        <Screen name="Product" component={ProductPage} />
        <Screen name="Order" component={NewOrder} />
        <Screen name="Client" component={ClientPage} />
        <Screen name="ListOrder" component={ListOrder} />
        <Screen name="Communication" component={Communication} />
      </Navigator>
    </NavigationContainer>
  );
}
