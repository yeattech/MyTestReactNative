import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { FetchService } from '../services/fetch.service';
import {
  API_ENDPOINTS,
  APIEndpointDetails,
} from '../constants/api-url.constants';

interface ApiButtonProps {
  title: string;
  description: string;
  method: string;
  onPress: () => void;
  isLoading?: boolean;
}

const ApiButton: React.FC<ApiButtonProps> = ({
  title,
  description,
  method,
  onPress,
  isLoading = false,
}) => (
  <TouchableOpacity
    style={[
      styles.apiButton,
      method === 'GET' ? styles.getButton : styles.postButton,
    ]}
    onPress={onPress}
    disabled={isLoading}
  >
    <View style={styles.buttonHeader}>
      <Text style={styles.methodTag}>{method}</Text>
      {isLoading && <ActivityIndicator size="small" color="#fff" />}
    </View>
    <Text style={styles.buttonTitle}>{title}</Text>
    <Text style={styles.buttonDescription}>{description}</Text>
  </TouchableOpacity>
);

export const FetchAPIScreen = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {},
  );
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [lastEndpoint, setLastEndpoint] = useState<string>('');

  const setLoading = (endpoint: string, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [endpoint]: loading }));
  };

  const handleApiCall = async (endpoint: APIEndpointDetails) => {
    const endpointKey =
      Object.keys(API_ENDPOINTS).find(
        key => API_ENDPOINTS[key as keyof typeof API_ENDPOINTS] === endpoint,
      ) || 'Unknown';

    setLoading(endpointKey, true);
    setLastEndpoint(endpointKey);

    try {
      const response = await FetchService.sendRequest(
        endpoint.url,
        endpoint.method,
      );
      setLastResponse(response);
      console.log(`✅ ${endpointKey} Response:`, response);
    } catch (error: any) {
      console.error(`❌ ${endpointKey} Error:`, error);
      setLastResponse({
        error: true,
        message: error.message || 'An error occurred',
        status: 'Error',
      });

      Alert.alert(
        'API Error',
        `Error calling ${endpointKey}: ${error.message || 'Unknown error'}`,
        [{ text: 'OK' }],
      );
    } finally {
      setLoading(endpointKey, false);
    }
  };

  const clearResponse = () => {
    setLastResponse(null);
    setLastEndpoint('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🌐 Fetch API Testing</Text>
        <Text style={styles.headerSubtitle}>
          Test your backend with Fetch API
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.buttonGrid}>
          <ApiButton
            title="Get String"
            description="Fetch a simple string response"
            method="GET"
            onPress={() => handleApiCall(API_ENDPOINTS.GET_STRING)}
            isLoading={loadingStates.GET_STRING}
          />

          <ApiButton
            title="Get String with Response Entity"
            description="Fetch string with response entity wrapper"
            method="GET"
            onPress={() =>
              handleApiCall(API_ENDPOINTS.GET_STRING_WITH_RESPONSE_ENTITY)
            }
            isLoading={loadingStates.GET_STRING_WITH_RESPONSE_ENTITY}
          />

          <ApiButton
            title="Get List of Strings"
            description="Fetch an array of strings"
            method="GET"
            onPress={() => handleApiCall(API_ENDPOINTS.GET_LIST_STRING)}
            isLoading={loadingStates.GET_LIST_STRING}
          />

          <ApiButton
            title="Delay 5 Seconds"
            description="Test timeout handling with 5s delay"
            method="GET"
            onPress={() => handleApiCall(API_ENDPOINTS.DELAY_5_SECONDS)}
            isLoading={loadingStates.DELAY_5_SECONDS}
          />

          <ApiButton
            title="Test 400 Error"
            description="Test client error handling"
            method="GET"
            onPress={() => handleApiCall(API_ENDPOINTS.SERVER_ERROR_400)}
            isLoading={loadingStates.SERVER_ERROR_400}
          />

          <ApiButton
            title="Test 500 Error"
            description="Test server error handling"
            method="GET"
            onPress={() => handleApiCall(API_ENDPOINTS.SERVER_ERROR_500)}
            isLoading={loadingStates.SERVER_ERROR_500}
          />
        </View>

        {lastResponse && (
          <View style={styles.responseContainer}>
            <View style={styles.responseHeader}>
              <Text style={styles.responseTitle}>
                📡 Response: {lastEndpoint}
              </Text>
              <TouchableOpacity
                onPress={clearResponse}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.responseContent,
                lastResponse.error
                  ? styles.errorResponse
                  : styles.successResponse,
              ]}
            >
              <Text style={styles.responseLabel}>
                {lastResponse.error ? '❌ Error' : '✅ Success'}
              </Text>
              <Text style={styles.responseStatus}>
                Status:{' '}
                {lastResponse.status || lastResponse.statusText || 'N/A'}
              </Text>
              <Text style={styles.responseData}>
                {lastResponse.error
                  ? lastResponse.message
                  : JSON.stringify(lastResponse.data, null, 2)}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#17a2b8',
    padding: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e3f2fd',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  buttonGrid: {
    gap: 16,
  },
  apiButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
  },
  getButton: {
    borderLeftColor: '#28a745',
  },
  postButton: {
    borderLeftColor: '#007bff',
  },
  buttonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  methodTag: {
    backgroundColor: '#28a745',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
  },
  buttonDescription: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },
  responseContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  clearButton: {
    backgroundColor: '#6c757d',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  responseContent: {
    padding: 16,
  },
  successResponse: {
    backgroundColor: '#f8fff9',
  },
  errorResponse: {
    backgroundColor: '#fff8f8',
  },
  responseLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  responseStatus: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  responseData: {
    fontSize: 12,
    color: '#495057',
    fontFamily: 'monospace',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
});
