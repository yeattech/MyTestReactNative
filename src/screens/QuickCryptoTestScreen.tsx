import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Button, ScrollView, Text, View, StyleSheet } from 'react-native';
import QuickCrypto from 'react-native-quick-crypto';

export const QuickCryptoTestScreen = () => {
  const navigation = useNavigation();
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testHash = () => {
    try {
      const hash = QuickCrypto.createHash('sha256')
        .update('Test message for react-native-quick-crypto')
        .digest('hex');
      addResult(`SHA256 Hash: ${hash}`);
    } catch (error) {
      addResult(`Hash Error: ${error}`);
    }
  };

  const testHmac = () => {
    try {
      const hmac = QuickCrypto.createHmac('sha256', 'secret-key')
        .update('Test message for HMAC')
        .digest('hex');
      addResult(`HMAC: ${hmac}`);
    } catch (error) {
      addResult(`HMAC Error: ${error}`);
    }
  };

  const testRandomBytes = () => {
    try {
      const random = QuickCrypto.randomBytes(16).toString('hex');
      addResult(`Random Bytes: ${random}`);
    } catch (error) {
      addResult(`Random Bytes Error: ${error}`);
    }
  };

  const testCipher = () => {
    try {
      const algorithm = 'aes-256-cbc';
      const key = QuickCrypto.randomBytes(32);
      const iv = QuickCrypto.randomBytes(16);
      const cipher = QuickCrypto.createCipheriv(algorithm, key, iv);
      
      let encrypted = cipher.update('Secret message', 'utf8', 'hex');
      encrypted += cipher.final('hex');
      addResult(`Encrypted: ${encrypted}`);
    } catch (error) {
      addResult(`Cipher Error: ${error}`);
    }
  };

  const testKeyPair = () => {
    try {
      const { publicKey, privateKey } = QuickCrypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        },
      });
      addResult(`Public Key (first 50 chars): ${publicKey.substring(0, 50)}...`);
      addResult(`Private Key (first 50 chars): ${privateKey.substring(0, 50)}...`);
    } catch (error) {
      addResult(`Key Pair Error: ${error}`);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>react-native-quick-crypto Tests</Text>
      <ScrollView style={styles.scrollView}>
        {results.map((result, index) => (
          <Text key={index} style={styles.resultText}>{result}</Text>
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button title="Test Hash" onPress={testHash} />
        <Button title="Test HMAC" onPress={testHmac} />
        <Button title="Test Random Bytes" onPress={testRandomBytes} />
        <Button title="Test Cipher" onPress={testCipher} />
        <Button title="Test Key Pair" onPress={testKeyPair} />
        <Button title="Clear Results" onPress={clearResults} />
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  resultText: {
    fontSize: 12,
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  buttonContainer: {
    gap: 10,
  },
});
