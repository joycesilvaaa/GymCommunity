import { Layout } from '@/components/layout';
import { NavigationProps } from '@/interfaces/navigation';
import { Text, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { RenderPostSuggestionItem } from '@/components/card/postSuggestion';
import { useAuth } from '@/hooks/auth';


type Publication = {
  id: number;
  created_at: string;
  content: string;
  user_id: number;
  user_name?: string;
  user_avatar?: string;
};

function PublicationSuggestion({ navigation }: NavigationProps) {
  const { user } = useAuth() as { user?: { id: number; user_profile: number } };
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    fetchPublications();
  }, []);

  function fetchPublications() {
    // Simulate fetching publications
    setTimeout(() => {
      const mockPublications: Publication[] = [
        { id: 1, created_at: '2023-10-01', content: 'Publicação 1', user_id: 1 },
        { id: 2, created_at: '2023-10-02', content: 'Publicação 2', user_id: 2 },
      ];
      setPublications(mockPublications);
      setLoading(false);
    }, 1000);
  }

  return (
    <Layout navigation={navigation}>
      <View>
        <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center" color="indigo.600">
          Dicas e sugestões para uma vida mais saudável
        </Text>
        {(user?.user_profile === 2 || user?.user_profile === 3) && (
          <View alignItems="center" mb={4}>
            <Text
              onPress={() => navigation.navigate('AddSuggestion')}
              bg="indigo.600"
              color="white"
              px={6}
              py={2}
              borderRadius={8}
              fontWeight="bold"
              fontSize="md"
              overflow="hidden"
            >
              Adicionar sugestão
            </Text>
          </View>
        )}

        {loading ? (
          <Text fontSize="md" color="gray.500" textAlign="center">
            Carregando...
          </Text>
        ) : publications.length === 0 ? (
          <Text fontSize="md" color="gray.400" textAlign="center">
            Nenhuma sugestão encontrada.
          </Text>
        ) : (
          <View px={4} py={2}>
            {publications.map((publication, index) => (
              <RenderPostSuggestionItem
                key={publication.id}
                item={publication}
                index={index}
                separators={{} as any}
              />
            ))}
          </View>
        )}
      </View>
    </Layout>
  );
}

export default PublicationSuggestion;
