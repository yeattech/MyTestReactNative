import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Aes from 'react-native-aes-crypto';

type Algorithms =
  | 'aes-128-cbc'
  | 'aes-192-cbc'
  | 'aes-256-cbc'
  | 'aes-128-ctr'
  | 'aes-192-ctr'
  | 'aes-256-ctr';

type EncryptedBundle = {
  cipher: string;
  key: string;
  iv: string;
  algorithm: Algorithms;
};

export const AesCryptoTestScreen = () => {
  const navigation = useNavigation();
  const [inputText, setInputText] = useState<string>('Secret message');
  const [encrypted, setEncrypted] = useState<EncryptedBundle | null>(null);
  const [decryptedText, setDecryptedText] = useState<string>('');
  const [hash, setHash] = useState<string>('');
  const [results, setResults] = useState<string[]>([]);
  const [algorithm, setAlgorithm] = useState<Algorithms>('aes-256-cbc');

  const addResult = (message: string) => {
    setResults(prev => [
      `${new Date().toLocaleTimeString()}: ${message}`,
      ...prev,
    ]);
  };

  const handleEncrypt = async () => {
    try {
      if (!inputText) {
        addResult('Please enter some text to encrypt.');
        return;
      }

      const key = await Aes.randomKey(32);
      const iv = await Aes.randomKey(16);
      console.log('Generated key and iv:', key, iv);
      const cipher = await Aes.encrypt(inputText, key, iv, algorithm);

      const bundle: EncryptedBundle = { cipher, key, iv, algorithm };
      setEncrypted(bundle);
      setDecryptedText('');
      addResult(
        `Encrypted text with ${algorithm} (first 40 chars): ${cipher.slice(
          0,
          40
        )}...`
      );
    } catch (error) {
      addResult(`Encrypt error: ${String(error)}`);
    }
  };

  const handleDecrypt = async () => {
    try {
      if (!encrypted) {
        addResult('Nothing to decrypt yet. Encrypt some text first.');
        return;
      }

      const plainText = await Aes.decrypt(
        encrypted.cipher,
        encrypted.key,
        encrypted.iv,
        encrypted.algorithm
      );

      setDecryptedText(plainText);
      addResult(`Decrypted text: ${plainText}`);
    } catch (error) {
      addResult(`Decrypt error: ${String(error)}`);
    }
  };

  const handleSha256 = async () => {
    try {
      const value = await Aes.sha256(inputText || 'Sample text for SHA-256');
      setHash(value);
      addResult(`SHA-256 hash (first 40 chars): ${value.slice(0, 40)}...`);
    } catch (error) {
      addResult(`SHA-256 error: ${String(error)}`);
    }
  };

  const clearResults = () => {
    setResults([]);
    setEncrypted(null);
    setDecryptedText('');
    setHash('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>react-native-aes-crypto Tests</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter text to encrypt"
        value={inputText}
        onChangeText={setInputText}
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.infoLabel}>Algorithm:</Text>
        <Picker
          selectedValue={algorithm}
          style={styles.picker}
          onValueChange={value => setAlgorithm(value as Algorithms)}
        >
          <Picker.Item label="AES-128-CBC" value="aes-128-cbc" />
          <Picker.Item label="AES-192-CBC" value="aes-192-cbc" />
          <Picker.Item label="AES-256-CBC" value="aes-256-cbc" />
          <Picker.Item label="AES-128-CTR" value="aes-128-ctr" />
          <Picker.Item label="AES-192-CTR" value="aes-192-ctr" />
          <Picker.Item label="AES-256-CTR" value="aes-256-ctr" />
        </Picker>
      </View>

      <View style={styles.buttonRow}>
        <Button title="Encrypt" onPress={handleEncrypt} />
        <Button title="Decrypt" onPress={handleDecrypt} />
      </View>

      <View style={styles.buttonRow}>
        <Button title="SHA-256" onPress={handleSha256} />
        <Button title="Clear" onPress={clearResults} />
      </View>

      {encrypted && (
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Cipher (truncated):</Text>
          <Text style={styles.mono}>
            {encrypted.cipher.slice(0, 80)}
            {encrypted.cipher.length > 80 ? '...' : ''}
          </Text>
        </View>
      )}

      {decryptedText ? (
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Decrypted text:</Text>
          <Text style={styles.mono}>{decryptedText}</Text>
        </View>
      ) : null}

      {hash ? (
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>SHA-256:</Text>
          <Text style={styles.mono}>{hash}</Text>
        </View>
      ) : null}

      <Text style={styles.logTitle}>Log</Text>
      <ScrollView style={styles.logBox}>
        {results.map((result, index) => (
          <Text key={index} style={styles.logText}>
            {result}
          </Text>
        ))}
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
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
  pickerContainer: {
    marginBottom: 12,
  },
  picker: {
    height: 44,
  },
  infoBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
  },
  infoLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  mono: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  logTitle: {
    marginTop: 16,
    marginBottom: 6,
    fontWeight: '600',
  },
  logBox: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    padding: 8,
  },
  logText: {
    fontSize: 11,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  footerButtons: {
    marginTop: 10,
  },
});


