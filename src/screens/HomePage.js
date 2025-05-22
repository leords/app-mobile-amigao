import {
  View,
  StyleSheet,
  Image
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import ButtonHome from '../components/ButtonHome';

export default function MainMenu( ) {

  const image = require('../assets/logo_name_horizontal.png');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={ image } style={styles.logo} />
      </View>
      <View style={styles.containerButton}>
          <ButtonHome 
              BGcolor={'#F15B6C'}
              destinationPage={'SalesDay'}
              image={<FontAwesome name="bar-chart" size={30} color="white" />}
              name={'Minhas vendas'}
          />
          <ButtonHome 
              BGcolor={'#3A5AFF'}
              destinationPage={'Client'}
              image={<Entypo name="address" size={32} color="white" />}
              name={'Minha rota'}
          />
          <ButtonHome 
              BGcolor={'#AF52DE'}
              destinationPage={'Product'}
              image={<Entypo name="dropbox" size={32} color="white" />}
              name={'Produtos'}
          />
          <ButtonHome 
              BGcolor={'#32C759'}
              destinationPage={'Info'}
              image={<AntDesign name="idcard" size={32} color="white"  />}
              name={'Informações'}
          />
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,  
  },
  header: { 
    alignItems: 'center',
    justifyContent: 'center',
    height: '12%',
  },
  containerButton: {
    flex: 1,
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  logo: {
    width: 200,
    height: 80,
    resizeMode: 'cover',
    marginTop: 10
  },
});