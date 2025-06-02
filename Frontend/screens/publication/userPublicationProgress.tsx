import { Layout } from "@/components/layout";
import { NavigationProps } from "@/interfaces/navigation";
import { Text, View, Box, Fab, Icon, Spinner, Pressable, Input, ScrollView, Image } from "native-base";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth";
import { RenderPostProgressItem } from "@/components/card/postProgress";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

type PublicationImage = {
  url: string;
};

type Publication = {
  id: number;
  created_at: string;
  content: string;
  user_id: number;
  images?: PublicationImage[];
  user_name?: string;
  user_avatar?: string;
};

function PublicationProgress({navigation}: NavigationProps) {
  const { user } = useAuth() as { user?: { id: number; user_profile: number; name: string; avatar_url: string } };
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  // State para nova publicação
  const [newContent, setNewContent] = useState("");
  const [newImages, setNewImages] = useState<string[]>([]);

  // Helper para selecionar imagem da galeria
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permissão para acessar a galeria é necessária!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setNewImages(prev => [...prev, result.assets[0].uri]);
    }
  };

  // Remover imagem pelo índice
  const removeImage = (idx: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== idx));
  };

  // Salvar nova publicação
  const handleSavePublication = () => {
    if (!newContent.trim()) return;
    const newPub: Publication = {
      id: Date.now(),
      created_at: new Date().toISOString().split("T")[0],
      content: newContent,
      user_id: user?.id ?? 0,
      user_name: user?.name ?? "Usuário",
      user_avatar: user?.avatar_url ?? "https://randomuser.me/api/portraits/lego/1.jpg",
      images: newImages.map(url => ({ url })),
    };
    setPublications(prev => [newPub, ...prev]);
    setNewContent("");
    setNewImages([]);
  };

  // Função para apagar publicação
  const handleDeletePublication = (id: number) => {
    setPublications(prev => prev.filter(pub => pub.id !== id));
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  function fetchPublications() {
    setTimeout(() => {
      const mockPublications: Publication[] = [
        { 
          id: 1, 
          created_at: '2023-10-01', 
          content: 'Finalmente atingi minha meta de perda de peso! Perdi 10kg em 3 meses com dieta equilibrada e treinos regulares.', 
          user_id: 1,
          user_name: user?.name || 'Ana Silva',
          user_avatar: user?.avatar_url || 'https://randomuser.me/api/portraits/women/32.jpg',
          images: [{url: 'https://picsum.photos/400/300?fitness'}]
        },
        { 
          id: 2, 
          created_at: '2023-10-02', 
          content: 'Hoje completei meu primeiro triathlon! A sensação de superação é indescritível.', 
          user_id: 2,
          user_name: 'Carlos Oliveira',
          user_avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
          images: [{url: 'https://picsum.photos/400/300?sports'}]
        },
        { 
          id: 3, 
          created_at: '2023-10-03', 
          content: 'Progresso nos músculos dorsais após 6 meses de treino focado. A consistência realmente traz resultados!', 
          user_id: 3,
          user_name: user?.name || 'Mariana Costa',
          user_avatar: user?.avatar_url || 'https://randomuser.me/api/portraits/women/44.jpg',
          images: [{url: 'https://picsum.photos/400/300?gym'}]
        },
      ];
      setPublications(mockPublications);
      setLoading(false);
    }, 1000);
  }

  return (
    <Layout navigation={navigation}>
      <Box flex={1} bg="coolGray.50">
        <View flex={1} p={0}>
          {user && (
            <Box mb={4} alignItems="center">
              {/* Formulário de nova publicação */}
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
                      setNewContent("");
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
                    <Text color="white" fontWeight="bold">Publicar</Text>
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
                <Icon 
                  as={MaterialIcons} 
                  name="add-box" 
                  size={16} 
                  color="coolGray.300" 
                  mb={4}
                />
                <Text fontSize="lg" fontWeight="medium" color="coolGray.600" textAlign="center" mb={2}>
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
                    // espaço para o botão não sobrepor conteúdo
                              >
                              <RenderPostProgressItem
                                item={{
                                ...publication,
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