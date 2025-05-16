import {
  View,
  StyleSheet,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import ButtonHome from '../components/ButtonHome';

export default function MainMenu( ) {

  return (
    <View style={styles.container}>
        <ButtonHome 
            BGcolor={'#F15B6C'}
            destinationPage={'SalesDay'}
            image={<AntDesign name="areachart" size={34} color={'white'} />}
            name={'Minhas vendas'}
        />
         <ButtonHome 
            BGcolor={'#34C759'}
            destinationPage={'SalesDay'}
            image={<AntDesign name="areachart" size={34} color={'white'} />}
            name={'Nova venda'}
        />
        <ButtonHome 
            BGcolor={'#3A5AFF'}
            destinationPage={'SalesDay'}
            image={<AntDesign name="areachart" size={34} color={'white'} />}
            name={'Minha rota'}
        />
        <ButtonHome 
            BGcolor={'#AF52DE'}
            destinationPage={'SalesDay'}
            image={<AntDesign name="areachart" size={34} color={'white'} />}
            name={'Produtos'}
        />
        <ButtonHome 
            BGcolor={'#F15B6C'}
            destinationPage={'SalesDay'}
            image={<AntDesign name="idcard" size={30} color="white"  />}
            name={'Informações'}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10
  }
});