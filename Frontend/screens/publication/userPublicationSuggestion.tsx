import { Layout } from '@/components/layout';
import { NavigationProps } from '@/interfaces/navigation';
import { Text, View, Input, Pressable, Box, ScrollView, Spinner } from 'native-base';
import React, { useEffect, useState } from 'react';
import { RenderPostSuggestionItem } from '@/components/card/postSuggestion';
import { useAuth } from '@/hooks/auth';
import routes from '@/api/api';

type Publication = {
  id: number;
  user_id: number;
  create_date: string;
  content: string;
  user_name?: string;
};

function PublicationSuggestion({ navigation }: NavigationProps) {
  const { user } = useAuth() as {
    user?: { id: number; user_profile: number; name: string; avatar_url: string };
  };
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSuggestionContent, setNewSuggestionContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPublications();
  }, []);

  async function fetchPublications() {
    setLoading(true);
    const response = await routes.getUserPublicationSuggestion();
    console.log('Response from getUserPublicationSuggestion:', response);
    if (response.status === 200) {
      const data = response.data.data as Publication[];
      setPublications(data);
      setLoading(false);
    }
  }

  const handleDeletePublication = async (id: number) => {
    
    const response = await routes.deletePublicationSuggestion(id);
    setPublications((prev) => prev.filter((pub) => pub.id !== id));
  };

  const handleAddSuggestion = async () => {
    if (!newSuggestionContent.trim()) return;

    setIsSubmitting(true);
    try {
      const data = {
        content: newSuggestionContent
      };


      const response = await routes.createPublicationSuggestion(data);

      if (response.status === 200) {
        await fetchPublications();
        setNewSuggestionContent('');
      }
    } catch (error) {
      console.error('Erro ao adicionar sugestão:', error);

      alert('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout navigation={navigation}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box px={4} py={4}>
          <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center" color="indigo.600">
            Dicas e sugestões para uma vida mais saudável
          </Text>

          {(user?.user_profile === 2 || user?.user_profile === 3) && (
            <Box bg="white" p={4} borderRadius="md" shadow={1} mb={6}>
              <Text fontSize="md" fontWeight="bold" mb={2}>
                Compartilhe sua dica ou sugestão
              </Text>
              <Input
                placeholder="Digite aqui sua dica para uma vida mais saudável..."
                value={newSuggestionContent}
                onChangeText={setNewSuggestionContent}
                multiline
                numberOfLines={4}
                mb={3}
                px={3}
                py={2}
                bg="gray.50"
                borderColor="gray.300"
              />
              <Box flexDirection="row" justifyContent="flex-end">
                <Pressable
                  onPress={handleAddSuggestion}
                  bg="indigo.600"
                  _pressed={{ bg: 'indigo.700' }}
                  px={4}
                  py={2}
                  borderRadius={8}
                  isDisabled={isSubmitting || !newSuggestionContent.trim()}
                  opacity={isSubmitting || !newSuggestionContent.trim() ? 0.6 : 1}
                >
                  {isSubmitting ? (
                    <Spinner color="white" size="sm" />
                  ) : (
                    <Text color="white" fontWeight="bold">
                      Publicar Sugestão
                    </Text>
                  )}
                </Pressable>
              </Box>
            </Box>
          )}

          {loading ? (
            <Box alignItems="center" py={10}>
              <Spinner size="lg" color="indigo.600" />
              <Text mt={3} color="gray.500" textAlign="center">
                Carregando sugestões...
              </Text>
            </Box>
          ) : publications.length === 0 ? (
            <Box alignItems="center" py={10}>
              <Text fontSize="md" color="gray.400" textAlign="center">
                Nenhuma sugestão encontrada.
              </Text>
              <Text fontSize="md" color="gray.400" textAlign="center" mt={2}>
                Seja o primeiro a compartilhar uma dica!
              </Text>
            </Box>
          ) : (
            <Box>
              {publications.map((publication, index) => (
                <RenderPostSuggestionItem
                  key={publication.id}
                  item={{ ...publication, handle: () => handleDeletePublication(publication.id) }}
                  index={index}
                  separators={{} as any}
                />
              ))}
            </Box>
          )}
        </Box>
      </ScrollView>
    </Layout>
  );
}

export default PublicationSuggestion;
