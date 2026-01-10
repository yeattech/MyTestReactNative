import { secp256k1 } from '@noble/curves/secp256k1.js';
import { p256 } from '@noble/curves/nist.js';
import { ed25519 } from '@noble/curves/ed25519.js';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Button, ScrollView, Text, View, StyleSheet } from 'react-native';
import { Buffer } from 'buffer';

export const NobleCurvesTestScreen = () => {
  const navigation = useNavigation();
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    console.log('message:', message)
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const bytesToHex = (bytes: Uint8Array): string => {
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const hexToBytes = (hex: string): Uint8Array => {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
  };

  // SECP256K1 Tests
  const testSecp256k1KeyGeneration = () => {
    try {
      const privateKey = secp256k1.utils.randomSecretKey();
      const publicKey = secp256k1.getPublicKey(privateKey, true); // compressed

      addResult(`SECP256K1 Private Key: ${bytesToHex(privateKey)}`);
      addResult(`SECP256K1 Public Key (compressed): ${bytesToHex(publicKey)}`);
      addResult(`SECP256K1 Public Key length: ${publicKey.length} bytes`);
    } catch (error) {
      addResult(`SECP256K1 Key Generation Error: ${error}`);
    }
  };

  const testSecp256k1Signing = () => {
    try {
      const privateKey = secp256k1.utils.randomSecretKey();
      const publicKey = secp256k1.getPublicKey(privateKey);

      // Create a 32-byte message hash (in real usage, this would be SHA-256 of the message)
      const messageHash = secp256k1.utils.randomSecretKey();

      const signature = secp256k1.sign(messageHash, privateKey);
      const isValid = secp256k1.verify(signature, messageHash, publicKey);

      addResult(`SECP256K1 Message Hash: ${bytesToHex(messageHash)}`);
      addResult(`SECP256K1 Signature: ${signature.toHex()}`);
      addResult(`SECP256K1 Signature Valid: ${isValid}`);
    } catch (error) {
      addResult(`SECP256K1 Signing Error: ${error}`);
    }
  };

  const testSecp256k1ECDH = () => {
    try {
      const alicePrivateKey = secp256k1.utils.randomSecretKey();
      const alicePublicKey = secp256k1.getPublicKey(alicePrivateKey);

      const bobPrivateKey = secp256k1.utils.randomSecretKey();
      const bobPublicKey = secp256k1.getPublicKey(bobPrivateKey);

      const aliceSharedSecret = secp256k1.getSharedSecret(alicePrivateKey, bobPublicKey, true);
      const bobSharedSecret = secp256k1.getSharedSecret(bobPrivateKey, alicePublicKey, true);

      // Remove prefix byte (compressed format)
      const aliceSecret32 = aliceSharedSecret.slice(1, 33);
      const bobSecret32 = bobSharedSecret.slice(1, 33);

      const secretsMatch = bytesToHex(aliceSecret32) === bytesToHex(bobSecret32);

      addResult(`SECP256K1 Alice Shared Secret: ${bytesToHex(aliceSecret32)}`);
      addResult(`SECP256K1 Bob Shared Secret: ${bytesToHex(bobSecret32)}`);
      addResult(`SECP256K1 Secrets Match: ${secretsMatch}`);
    } catch (error) {
      addResult(`SECP256K1 ECDH Error: ${error}`);
    }
  };

  // SECP256R1 (P-256) Tests
  const testSecp256r1KeyGeneration = (compressed: boolean) => {
    try {
      const privateKey = p256.utils.randomSecretKey();
      const publicKey = p256.getPublicKey(privateKey, compressed);

      // Hex
      addResult(`SECP256R1 Private Key: ${bytesToHex(privateKey)}`);
      addResult(`SECP256R1 Public Key (compressed): ${bytesToHex(publicKey)}`);
      // Base64
      addResult(`SECP256R1 Private Key (Base64): ${Buffer.from(privateKey).toString('base64')}`);
      addResult(`SECP256R1 Public Key (Base64): ${Buffer.from(publicKey).toString('base64')}`);

      addResult(`SECP256R1 Public Key length: ${publicKey.length} bytes`);
    } catch (error) {
      addResult(`SECP256R1 Key Generation Error: ${error}`);
    }
  };

  const testSecp256r1Signing = () => {
    try {
      const privateKey = p256.utils.randomSecretKey();
      const publicKey = p256.getPublicKey(privateKey);

      // Create a 32-byte message hash (in real usage, this would be SHA-256 of the message)
      const messageHash = p256.utils.randomSecretKey();

      const signature = p256.sign(messageHash, privateKey);
      const isValid = p256.verify(signature, messageHash, publicKey);

      addResult(`SECP256R1 Message Hash: ${bytesToHex(messageHash)}`);
      addResult(`SECP256R1 Signature: ${signature.toHex()}`);
      addResult(`SECP256R1 Signature Valid: ${isValid}`);
    } catch (error) {
      addResult(`SECP256R1 Signing Error: ${error}`);
    }
  };

  const testSecp256r1ECDH = () => {
    try {
      const alicePrivateKey = p256.utils.randomSecretKey();
      const alicePublicKey = p256.getPublicKey(alicePrivateKey);

      const bobPrivateKey = p256.utils.randomSecretKey();
      const bobPublicKey = p256.getPublicKey(bobPrivateKey);

      const aliceSharedSecret = p256.getSharedSecret(alicePrivateKey, bobPublicKey, true);
      const bobSharedSecret = p256.getSharedSecret(bobPrivateKey, alicePublicKey, true);

      // Remove prefix byte (compressed format)
      const aliceSecret32 = aliceSharedSecret.slice(1, 33);
      const bobSecret32 = bobSharedSecret.slice(1, 33);

      const secretsMatch = bytesToHex(aliceSecret32) === bytesToHex(bobSecret32);

      addResult(`SECP256R1 Alice Shared Secret: ${bytesToHex(aliceSecret32)}`);
      addResult(`SECP256R1 Bob Shared Secret: ${bytesToHex(bobSecret32)}`);
      addResult(`SECP256R1 Secrets Match: ${secretsMatch}`);
    } catch (error) {
      addResult(`SECP256R1 ECDH Error: ${error}`);
    }
  };

  // ED25519 Tests
  const testEd25519KeyGeneration = () => {
    try {
      const privateKey = ed25519.utils.randomSecretKey();
      const publicKey = ed25519.getPublicKey(privateKey);

      addResult(`ED25519 Private Key: ${bytesToHex(privateKey)}`);
      addResult(`ED25519 Public Key: ${bytesToHex(publicKey)}`);
      addResult(`ED25519 Public Key length: ${publicKey.length} bytes`);
    } catch (error) {
      addResult(`ED25519 Key Generation Error: ${error}`);
    }
  };

  const testEd25519Signing = () => {
    try {
      const privateKey = ed25519.utils.randomSecretKey();
      const publicKey = ed25519.getPublicKey(privateKey);
      const message = new TextEncoder().encode('Test message for ED25519 signing');

      const signature = ed25519.sign(message, privateKey);
      const isValid = ed25519.verify(signature, message, publicKey);

      addResult(`ED25519 Signature: ${bytesToHex(signature)}`);
      addResult(`ED25519 Signature Valid: ${isValid}`);
    } catch (error) {
      addResult(`ED25519 Signing Error: ${error}`);
    }
  };

  const testEd25519PointOperations = () => {
    try {
      const privateKey = ed25519.utils.randomSecretKey();
      const publicKey = ed25519.getPublicKey(privateKey);

      // Test point operations
      const point = ed25519.Point.fromHex(bytesToHex(publicKey));
      const point2 = ed25519.Point.fromHex(bytesToHex(publicKey));
      const added = point.add(point2);

      addResult(`ED25519 Original Point: ${bytesToHex(publicKey)}`);
      addResult(`ED25519 Point Addition Result: ${bytesToHex(added.toBytes())}`);
    } catch (error) {
      addResult(`ED25519 Point Operations Error: ${error}`);
    }
  };

  // Utility Tests
  const testKeyValidation = () => {
    try {
      // Test valid private key
      const validPrivateKey = secp256k1.utils.randomSecretKey();
      const isValid = secp256k1.utils.isValidSecretKey(validPrivateKey);
      addResult(`SECP256K1 Valid Private Key Check: ${isValid}`);

      // Test invalid private key (all zeros)
      const invalidPrivateKey = new Uint8Array(32);
      const isInvalid = secp256k1.utils.isValidSecretKey(invalidPrivateKey);
      addResult(`SECP256K1 Invalid Private Key Check: ${!isInvalid}`);
    } catch (error) {
      addResult(`Key Validation Error: ${error}`);
    }
  };

  const testCompressedVsUncompressed = () => {
    try {
      const privateKey = secp256k1.utils.randomSecretKey();
      const compressedPublicKey = secp256k1.getPublicKey(privateKey, true);
      const uncompressedPublicKey = secp256k1.getPublicKey(privateKey, false);

      addResult(`SECP256K1 Compressed Public Key length: ${compressedPublicKey.length} bytes`);
      addResult(`SECP256K1 Uncompressed Public Key length: ${uncompressedPublicKey.length} bytes`);
      addResult(`SECP256K1 Compressed: ${bytesToHex(compressedPublicKey).substring(0, 20)}...`);
      addResult(`SECP256K1 Uncompressed: ${bytesToHex(uncompressedPublicKey).substring(0, 20)}...`);
    } catch (error) {
      addResult(`Compressed/Uncompressed Test Error: ${error}`);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>@noble/curves Tests</Text>
      <ScrollView style={styles.scrollView}>
        {results.map((result, index) => (
          <Text key={index} style={styles.resultText}>{result}</Text>
        ))}
      </ScrollView>
      <ScrollView style={styles.scrollView}>
        <View style={styles.buttonContainer}>
          <Text style={styles.sectionTitle}>SECP256K1</Text>
          <Button title="Generate Keys" onPress={testSecp256k1KeyGeneration} />
          <Button title="Sign & Verify" onPress={testSecp256k1Signing} />
          <Button title="ECDH Shared Secret" onPress={testSecp256k1ECDH} />

          <Text style={styles.sectionTitle}>SECP256R1 (P-256)</Text>
          <Button title="Generate Keys" onPress={() => testSecp256r1KeyGeneration(true)} />
          <Button title="Generate Keys Non Compressed" onPress={() => testSecp256r1KeyGeneration(false)} />
          <Button title="Sign & Verify" onPress={testSecp256r1Signing} />
          <Button title="ECDH Shared Secret" onPress={testSecp256r1ECDH} />

          <Text style={styles.sectionTitle}>ED25519</Text>
          <Button title="Generate Keys" onPress={testEd25519KeyGeneration} />
          <Button title="Sign & Verify" onPress={testEd25519Signing} />
          <Button title="Point Operations" onPress={testEd25519PointOperations} />

          <Text style={styles.sectionTitle}>Utilities</Text>
          <Button title="Key Validation" onPress={testKeyValidation} />
          <Button title="Compressed vs Uncompressed" onPress={testCompressedVsUncompressed} />

          <Button title="Clear Results" onPress={clearResults} />
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
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

