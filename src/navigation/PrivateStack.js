import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Vendas from "../screens/Vendas";
import Menu from "../screens/Menu";
import Informativo from "../screens/Informativo";
import ListaProduto from "../screens/ListaProduto";
import ListaCliente from "../screens/ListaCliente";
import ListaPedido from "../screens/ListaPedido";
import Sincronizacao from "../screens/Sincronizacao";
import Pedido from "../screens/NovoPedido";
import Logout from "../screens/Logout";

export const PrivateStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Menu} />
      <Stack.Screen name="SalesDay" component={Vendas} />
      <Stack.Screen name="Info" component={Informativo} />
      <Stack.Screen name="Product" component={ListaProduto} />
      <Stack.Screen name="Order" component={Pedido} />
      <Stack.Screen name="Client" component={ListaCliente} />
      <Stack.Screen name="ListOrder" component={ListaPedido} />
      <Stack.Screen name="Communication" component={Sincronizacao} />
      <Stack.Screen name="Logout" component={Logout} />
    </Stack.Navigator>
  );
};
