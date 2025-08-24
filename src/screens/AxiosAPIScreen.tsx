import axios from 'axios';
import { API_ENDPOINTS } from '../constants/api.config.constant';
import { Button, Text } from 'react-native';

export const AxiosAPIScreen = () => {
  const testGetString = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.TEST.GET_STRING.url);
      console.log('response:', response);
      console.log('response.data:', response.data);
    } catch (e) {
      console.error('Error:', e);
    }
  };

  const testGetListString = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.TEST.GET_LIST_STRING.url, {
        method: API_ENDPOINTS.TEST.GET_STRING.method,
      });
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
