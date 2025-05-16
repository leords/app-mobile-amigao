
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import LoginScreen from '../screens/LoginPage';
import HomePage from '../screens/HomePage'
import SalesDays from '../screens/SalesDays';

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
    return (
        <NavigationContainer>
            <Navigator screenOptions={{ headerShown: false }}>
                <Screen name="Login" component={LoginScreen} />
                <Screen name="Home" component={HomePage} />
                <Screen name="SalesDay" component={SalesDays} />
            </Navigator>
        </NavigationContainer>
    )
}