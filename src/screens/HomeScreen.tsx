import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native';
import QuickCrypto, { generateKeyPairSync } from 'react-native-quick-crypto';


export const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <>

      <Button
        title="Navigate to Sample Screen"
        onPress={() => {
          navigation.navigate('SampleScreen');
        }}
      ></Button>
      <Button
        title="Test react-native-quick-crypto"
        onPress={() => {
          navigation.navigate('QuickCryptoTest');
        }}
      ></Button>
    </>
  );
};
