import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native';

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
      <Button
        title="Test react-native-aes-crypto"
        onPress={() => {
          navigation.navigate('AesCryptoTest');
        }}
      ></Button>
      <Button
        title="Test API Integration"
        onPress={() => {
          navigation.navigate('ApiTest');
        }}
      ></Button>
      <Button
        title="Test @noble/curves"
        onPress={() => {
          navigation.navigate('NobleCurvesTest');
        }}
      ></Button>
    </>
  );
};
