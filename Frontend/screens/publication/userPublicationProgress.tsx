import { Layout } from '@/components/layout';
import { NavigationProps } from '@/interfaces/navigation';
import {
  Text,
  View,
  Box,
  Icon,
  Spinner,
  Pressable,
  Input,
  ScrollView,
  Image,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/auth';
import { RenderPostProgressItem } from '@/components/card/postProgress';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import routes from '@/api/api';

type Publication = {
  id: number;
  user_id?: number;
  user_name: string;
  content: string;
  image_urls?: string[];
  create_date: string;
};

function PublicationProgress({ navigation }: NavigationProps) {
  const { user } = useAuth() as {
    user?: { id: number; user_profile: number; name: string; avatar_url: string };
  };
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [newContent, setNewContent] = useState('');
  const [newImages, setNewImages] = useState<string[]>([]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permissão para acessar a galeria é necessária!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setNewImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (idx: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
  };

const handleSavePublication = async () => {
  if (!newContent.trim()) return;

  try {
    const formData = new FormData();

    // Adiciona o campo do formulário normalmente (como o FastAPI espera)
    formData.append('content', newContent); // <- aqui deve coincidir com o nome dos campos do Pydantic

    // Adiciona as imagens
    newImages.forEach((uri, idx) => {
      const name = uri.split('/').pop() || `image_${idx}.jpg`;
      formData.append('image_files', {
        uri,
        name,
        type: 'image/jpeg',
      } as any);
    });

    // Envia
    await routes.postUserPublicationProgress(formData);

    // Atualiza estado (sucesso)
    setPublications((prev) => [
      {
        id: Date.now(),
        user_name: user?.name ?? 'Usuário',
        content: newContent,
        image_urls: newImages,
        create_date: new Date().toISOString(),
      },
      ...prev,
    ]);
    setNewContent('');
    setNewImages([]);
  } catch (err) {
    console.error('Erro ao publicar progresso:', err);
  }
};


  const handleDeletePublication = async (id: number) => {
    await routes.deletePublicationProgress(id);
    setPublications((prev) => prev.filter((pub) => pub.id !== id));
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  async function fetchPublications() {
    setLoading(true);
    try {
      const response = await routes.getUserPublicationProgress();
      const data = (response.data?.data || []).map((pub: any) => ({
        id: pub.id,
        user_name: pub.user_name,
        user_id: pub.user_id,
        content: pub.content,
        image_urls: pub.image_urls || [],
        create_date: pub.create_date,
      }));
      setPublications(data);
    } catch (error) {
      console.error('Erro ao buscar publicações:', error);
      setPublications([]);
    }
    setLoading(false);
  }

  return (
    <Layout navigation={navigation}>
      <Box flex={1} bg="coolGray.50">
        <View flex={1} p={0}>
          {user && (
            <Box mb={4} alignItems="center">
              <Box bg="white" p={6} borderRadius={16} width="100%" maxWidth={500} shadow={1}>
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                  Nova Publicação de Progresso
                </Text>
                <Text mb={2}>Texto:</Text>
                <Input
                  placeholder="Compartilhe seu progresso..."
                  value={newContent}
                  onChangeText={setNewContent}
                  multiline
                  mb={4}
                />
                <Text mb={2}>Fotos:</Text>
                <ScrollView horizontal mb={2}>
                  {newImages.map((img, idx) => (
                    <Box key={idx} mr={2} position="relative">
                      <Image
                        source={{ uri: img }}
                        alt={`img-${idx}`}
                        width={70}
                        height={70}
                        borderRadius={8}
                      />
                      <Pressable
                        position="absolute"
                        top={-8}
                        right={-8}
                        bg="red.500"
                        borderRadius={999}
                        p={1}
                        onPress={() => removeImage(idx)}
                      >
                        <Icon as={MaterialIcons} name="close" size={4} color="white" />
                      </Pressable>
                    </Box>
                  ))}
                  <Pressable
                    onPress={pickImage}
                    bg="coolGray.100"
                    borderRadius={8}
                    width={70}
                    height={70}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={MaterialIcons} name="add-a-photo" size={7} color="indigo.600" />
                  </Pressable>
                </ScrollView>
                <Box flexDirection="row" justifyContent="flex-end" mt={4}>
                  <Pressable
                    onPress={() => {
                      setNewContent('');
                      setNewImages([]);
                    }}
                    px={4}
                    py={2}
                    mr={2}
                    borderRadius={8}
                    bg="coolGray.200"
                  >
                    <Text color="coolGray.700">Limpar</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSavePublication}
                    px={4}
                    py={2}
                    borderRadius={8}
                    bg="indigo.600"
                    _pressed={{ bg: 'indigo.700' }}
                    isDisabled={!newContent.trim()}
                  >
                    <Text color="white" fontWeight="bold">
                      Publicar
                    </Text>
                  </Pressable>
                </Box>
              </Box>
            </Box>
          )}

          {loading ? (
            <Box flex={1} justifyContent="center" alignItems="center">
              <Spinner size="lg" color="indigo.600" />
              <Text mt={3} color="coolGray.500">
                Carregando seu progresso...
              </Text>
            </Box>
          ) : publications.length === 0 ? (
            <Box flex={1} justifyContent="center" alignItems="center">
              <Box bg="white" p={8} borderRadius={20} alignItems="center" shadow={1} width="100%">
                <Icon as={MaterialIcons} name="add-box" size={16} color="coolGray.300" mb={4} />
                <Text
                  fontSize="lg"
                  fontWeight="medium"
                  color="coolGray.600"
                  textAlign="center"
                  mb={2}
                >
                  Nenhuma publicação encontrada
                </Text>
                <Text fontSize="md" color="coolGray.400" textAlign="center" mb={4}>
                  Compartilhe seu primeiro progresso e inspire outros!
                </Text>
              </Box>
            </Box>
          ) : (
            <Box mt={4}>
              {publications.map((publication) => (
                <Box
                  key={publication.id}
                  mb={6}
                  position="relative"
                  bg="white"
                  borderRadius="md"
                  overflow="hidden"
                >
                  <RenderPostProgressItem
                    item={{
                      ...publication,
                      created_at: publication.create_date || '',
                      user_id: publication.user_id || 0,
                      images: (publication.image_urls || []).map((url) => ({ url })),
                      handle: () => handleDeletePublication(publication.id),
                    }}
                    index={0}
                    separators={{} as any}
                  />
                </Box>
              ))}
            </Box>
          )}
        </View>
      </Box>
    </Layout>
  );
}

export default PublicationProgress;
