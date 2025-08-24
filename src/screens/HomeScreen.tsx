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
        title="Navigate to Fetch"
        onPress={() => {
          navigation.navigate('FetchAPIScreen');
        }}
      ></Button>
      <Button
        title="Navigate to Axios"
        onPress={() => {
          navigation.navigate('AxiosAPIScreen');
        }}
      ></Button>
    </>
  );
};
