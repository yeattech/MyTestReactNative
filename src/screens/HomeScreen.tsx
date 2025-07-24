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
    </>
  );
};
