import { Button } from 'react-native';
import { API_ENDPOINTS } from '../constants/api-url.constants';

export const FetchAPIScreen = () => {
  const testGetString = async () => {
    try {
      const response = await fetch(
        API_ENDPOINTS.GET_STRING_WITH_RESPONSE_ENTITY.url,
        {
          method: API_ENDPOINTS.GET_STRING.method,
        },
      );
      console.log('response:', response);
      console.log('response.body:', response.body);
      console.log('response.body:', response.body);
    } catch (e) {
      console.error('Error:', e);
    }
  };

  const testGetListString = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_LIST_STRING.url, {
        method: API_ENDPOINTS.GET_STRING.method,
      });
      console.log('response:', response);
      console.log('response.body:', response.body);
      console.log('response.body:', response.body);
    } catch (e) {
      console.error('Error:', e);
    }
  };

  return (
    <>
      <Button title="get" onPress={testGetString}></Button>
      <Button title="getList" onPress={testGetListString}></Button>
    </>
  );
};
