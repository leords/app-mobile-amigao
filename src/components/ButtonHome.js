
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';

export default function ButtonHome({BGcolor, destinationPage, image, name}) {

    const navigation = useNavigation();

    return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: BGcolor }]}
      onPress={() => navigation.navigate(destinationPage)}
    >
      <View style={styles.iconWrapper}>{image}</View>
      <Text style={styles.text}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '48%', // Para caber 2 por linha com margem
    height: '150',
    borderRadius: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    marginBottom: 2,
  },
  iconWrapper: {
    width: '100%',
    marginBottom: 2, 
  },
  text: {
    color: 'white',
    fontSize: 15,
    width: '100%'
  },
});