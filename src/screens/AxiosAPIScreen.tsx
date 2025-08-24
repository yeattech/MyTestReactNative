import { Button, Text } from 'react-native';
import { AxiosService } from '../services/axios.service';
import { API_ENDPOINTS } from '../constants/api-url.constants';

export const AxiosAPIScreen = () => {
  const testGetString = async () => {
    try {
      const response = await AxiosService.sendRequestStatic(
        API_ENDPOINTS.GET_STRING,
      );
      console.log('response:', response);
      console.log('response.data:', response.data);
    } catch (e) {
      console.error('Error:', e);
    }
  };

  const testGetListString = async () => {
    try {
      const response = await AxiosService.sendRequestStatic(
        API_ENDPOINTS.GET_LIST_STRING,
      );
      console.log('response:', response);
      console.log('response.data:', response.data);
    } catch (e) {
      console.error('Error:', e);
    }
  };

  return (
    <>
      <Text>AXIOS</Text>
      <Button title="get" onPress={testGetString}></Button>
      <Button title="getList" onPress={testGetListString}></Button>
    </>
  );
};
