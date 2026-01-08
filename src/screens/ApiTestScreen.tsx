import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  API_BASE_URL,
  ENDPOINTS,
  AesDecryptRequest,
  AesDecryptResponse,
} from '../config';
import Aes from 'react-native-aes-crypto';

export const ApiTestScreen = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [iv, setIv] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<null | AesDecryptResponse>(null);
  const [rawResponse, setRawResponse] = useState<string | null>(null);

  const canSubmit = password.trim().length > 0 && iv.trim().length > 0 && !loading;

  const callDecrypt = async () => {


    try {
      setLoading(true);
      setResponse(null);
      setRawResponse(null);

      const keyHex = await Aes.randomKey(32);
      const ivHex = await Aes.randomKey(16);

      const cipher = await Aes.encrypt(password, keyHex, ivHex, 'aes-256-cbc');

      const body: AesDecryptRequest = {
        password: cipher,
        iv: ivHex,
      };
      console.log('Request Body:', body);
      const res = await fetch(`${API_BASE_URL}${ENDPOINTS.aesCbc256Decrypt}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const text = await res.text();
      setRawResponse(text);

      try {
        const json = JSON.parse(text) as AesDecryptResponse;
        setResponse(json);
      } catch {
        // not JSON or not matching expected shape; we still keep raw text
      }

      if (!res.ok) {
        Alert.alert('Request failed', `Status: ${res.status}`);
      }
    } catch (error: any) {
      Alert.alert('Network Error', String(error?.message || error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Integration Test</Text>
      <Text style={styles.subtitle}>
        Endpoint: {API_BASE_URL}
        {ENDPOINTS.aesCbc256Decrypt}
      </Text>

      <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          autoCapitalize="none"
          secureTextEntry
        />

        <Text style={styles.label}>IV</Text>
        <TextInput
          style={styles.input}
          value={iv}
          onChangeText={setIv}
          placeholder="Enter IV"
          autoCapitalize="none"
        />

        <View style={styles.buttonRow}>
          <Button title="Call Decrypt" onPress={callDecrypt} disabled={!canSubmit} />
        </View>

        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Calling API...</Text>
          </View>
        )}

        {response && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Parsed Response</Text>
            <Text style={styles.monoText}>
              {JSON.stringify(response, null, 2)}
            </Text>
          </View>
        )}

        {rawResponse && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Raw Response</Text>
            <Text style={styles.monoText}>{rawResponse}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footerButtons}>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#555',
    marginBottom: 12,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  buttonRow: {
    marginTop: 16,
    marginBottom: 8,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  section: {
    marginTop: 16,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  monoText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  footerButtons: {
    marginTop: 8,
  },
});


