import { Layout } from '@/components/layout';
import { NavigationProps } from '@/interfaces/navigation';
import { Text, View, Input, Pressable, Box, ScrollView, Spinner } from 'native-base';
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
  const { user } = useAuth() as { user?: { id: number; user_profile: number; name: string; avatar_url: string } };
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para nova sugestão
  const [newSuggestionContent, setNewSuggestionContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPublications();
  }, []);

  function fetchPublications() {
    // Simulate fetching publications
    setLoading(true);
    setTimeout(() => {
      const mockPublications: Publication[] = [
        { 
          id: 1, 
          created_at: '2023-10-01', 
          content: 'Tente incluir pelo menos 30 minutos de atividade física moderada em seu dia a dia. Caminhadas, natação ou ciclismo são ótimas opções para começar.', 
          user_id: 1,
          user_name: 'Dr. Ricardo Almeida',
          user_avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
        },
        { 
          id: 2, 
          created_at: '2023-10-02', 
          content: 'Mantenha-se hidratado! Beba pelo menos 2 litros de água por dia. A hidratação adequada melhora o desempenho físico e contribui para a saúde geral.', 
          user_id: 2,
          user_name: 'Nutricionista Ana Paula',
          user_avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
        },
      ];
      setPublications(mockPublications);
      setLoading(false);
    }, 1000);
  }
    // Função para apagar publicação
  const handleDeletePublication = (id: number) => {
    setPublications((prev) => prev.filter((pub) => pub.id !== id));
  };

  // Função para adicionar nova sugestão
  const handleAddSuggestion = () => {
    if (!newSuggestionContent.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulando o envio para uma API
    setTimeout(() => {
      const newSuggestion: Publication = {
        id: Date.now(),
        created_at: new Date().toISOString().split('T')[0],
        content: newSuggestionContent,
        user_id: user?.id || 0,
        user_name: user?.name || 'Usuário',
        user_avatar: user?.avatar_url || 'https://randomuser.me/api/portraits/lego/1.jpg'
      };
      
      // Adicionar a nova sugestão no início da lista
      setPublications(prev => [newSuggestion, ...prev]);
      
      // Limpar o formulário
      setNewSuggestionContent('');
      setIsSubmitting(false);
      
      // Feedback visual
      alert('Sugestão adicionada com sucesso!');
      
      // Recarregar a lista
      fetchPublications();
    }, 800);
  };

  return (
    <Layout navigation={navigation}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box px={4} py={4}>
          <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center" color="indigo.600">
            Dicas e sugestões para uma vida mais saudável
          </Text>
          
          {/* Formulário para adicionar sugestões diretamente na página */}
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
                  _pressed={{ bg: "indigo.700" }}
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
