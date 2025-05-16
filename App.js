// App.js
import { SafeAreaView, StatusBar } from 'react-native';
import { AppRoutes } from './src/navigation/AppRoutes';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
      
      <AppRoutes />

    </SafeAreaView>
  );
}
