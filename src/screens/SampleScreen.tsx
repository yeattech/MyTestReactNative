import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const SAMPLE_URL = 'https://jsonplaceholder.typicode.com/posts/1';

export const SampleScreen = () => {
  const navigation = useNavigation();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSample = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get<Post>(SAMPLE_URL);
      setPost(data);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(e.message);
      } else {
        setError('Request failed');
      }
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSample();
  }, [fetchSample]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Axios sample</Text>
      <Text style={styles.url}>{SAMPLE_URL}</Text>
      {loading ? (
        <ActivityIndicator style={styles.spinner} />
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {post ? (
        <View style={styles.card}>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.body}>{post.body}</Text>
        </View>
      ) : null}
      <Button title="Retry request" onPress={() => void fetchSample()} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  url: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  spinner: {
    marginVertical: 16,
  },
  error: {
    color: '#c00',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
});
