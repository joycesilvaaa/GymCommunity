import React, { useState } from 'react';
import {
  Box,
  Text,
  Image,
  FlatList,
  HStack,
  VStack,
  Avatar,
  IconButton,
  Pressable,
  useToast,
  ZStack,
  Center,
  Fade,
  Icon,
} from 'native-base';
import { ListRenderItemInfo, Platform, Share, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import { Linking } from 'react-native';
import { useAuth } from '@/hooks/auth';
import * as FileSystem from 'expo-file-system';

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
  likes?: number;
  comments?: number;
  handle: () => void;
};

export function RenderPostProgressItem({ item }: ListRenderItemInfo<Publication>) {
  const toast = useToast();
  const { user } = useAuth() as {
    user?: { id: number; user_profile: number; name: string; avatar_url: string };
  };
  const [showMessage, setShowMessage] = useState(false);
  

  const handleShare = async () => {
    try {
      // Criar mensagem de compartilhamento
      const message = `Confira meu progresso fitness:\n\n"${item.content}"\n\nCompartilhado via GYMCommunity!`;

      // Mostrar mensagem flutuante
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);

      // Se tivermos imagens, compartilhar como imagem + texto
      if (item.images && item.images.length > 0) {
        const imageUrl = item.images[0].url;

        // Se for uma URL remota (http), precisa baixar primeiro
        if (imageUrl.startsWith('http')) {
          // Gerar nome aleatório para o arquivo local
          const localFileName = `${FileSystem.cacheDirectory}temp-${Date.now()}.jpg`;

          // Baixar o arquivo
          const { uri } = await FileSystem.downloadAsync(imageUrl, localFileName);

          // Compartilhar o arquivo local
          await Sharing.shareAsync(uri, {
            dialogTitle: 'Compartilhar Progresso',
            mimeType: 'image/jpeg',
            UTI: 'public.jpeg',
          });
        } else {
          // Se já for um arquivo local, compartilhar diretamente
          await Sharing.shareAsync(imageUrl, {
            dialogTitle: 'Compartilhar Progresso',
            mimeType: 'image/jpeg',
            UTI: 'public.jpeg',
          });
        }
      } else {
        await Share.share({
          message,
          title: 'Compartilhar Progresso',
        });
      }
    } catch (error) {
      toast.show({
        description: 'Erro ao compartilhar',
        placement: 'top',
        bg: 'red.500',
      });
      console.error('Erro ao compartilhar:', error);
    }
  };

  const GalleryImage = ({ imageUrl }: { imageUrl: string }) => {
    const [imageError, setImageError] = useState(false);

    if (!imageUrl) {
      return (
        <Center
          width={280}
          height={200}
          bg="coolGray.100"
          borderRadius="xl"
          borderWidth={1}
          borderColor="coolGray.200"
          m={1}
        >
          <Text color="coolGray.500" fontSize="sm" textAlign="center">
            Não é possível visualizar esta imagem.
          </Text>
        </Center>
      );
    }

    return (
      <Pressable m={1} borderRadius="xl" overflow="hidden">
        {imageError ? (
          <Center
            width={280}
            height={200}
            bg="coolGray.100"
            borderRadius="xl"
            borderWidth={1}
            borderColor="coolGray.200"
          >
            <Icon as={Ionicons} name="image-outline" size={8} color="coolGray.400" mb={2} />
            <Text color="coolGray.500" fontSize="sm" textAlign="center">
              Não foi possível carregar a imagem.
            </Text>
            <Text color="coolGray.400" fontSize="xs" textAlign="center" mt={1}>
              Verifique sua conexão com a internet.
            </Text>
          </Center>
        ) : (
          <Image
            source={{ uri: imageUrl }}
            alt="Publication Image"
            width={280}
            height={200}
            resizeMode="cover"
            fallbackSource={{
              uri: 'https://via.placeholder.com/280x200?text=Imagem+não+disponível',
            }}
            borderWidth={1}
            borderColor="coolGray.200"
            onError={() => setImageError(true)}
          />
        )}
      </Pressable>
    );
  };

  return (
    <Box
      borderRadius="2xl"
      overflow="hidden"
      mb={6}
      shadow={4}
      bg="white"
      borderWidth={1}
      borderColor="coolGray.100"
    >
      <HStack p={4} alignItems="center" justifyContent="space-between">
        <HStack alignItems="center" space={3}>
          <Avatar
            size="sm"
            bg="lightBlue.500"
            source={{ uri: item.user_avatar || 'https://via.placeholder.com/40' }}
          >
            {item.user_name?.charAt(0) || 'U'}
          </Avatar>
          <VStack>
            <Text fontWeight="semibold" fontSize="sm" color="coolGray.800">
              {item.user_name || 'Usuário Fitness'}
            </Text>
            <HStack alignItems="center" space={1}>
              <Ionicons name="time-outline" size={12} color="#94a3b8" />
              <Text fontSize="xs" color="coolGray.500">
                {new Date(item.created_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>
            </HStack>
          </VStack>
        </HStack>
        <HStack
          p={3}
          justifyContent="space-between"
          borderTopWidth={1}
          borderTopColor="coolGray.100"
        >
          {/* Botão de Compartilhar - Grande destaque */}
          <Pressable
            flexDirection="row"
            alignItems="center"
            onPress={handleShare}
            bg="emerald.100"
            px={3}
            py={1.5}
            borderRadius="full"
            borderWidth={1}
            borderColor="emerald.200"
            _pressed={{ bg: 'emerald.200' }}
          >
            <Ionicons name="share-social" size={20} color="#10B981" />
          </Pressable>


          {user?.id === item.user_id && (
            <Pressable
              flexDirection="row"
              alignItems="center"
              onPress={item.handle}
              bg="red.100"
              px={3}
              py={1.5}
              borderRadius="full"
              borderWidth={1}
              borderColor="red.200"
              _pressed={{ bg: 'red.200' }}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </Pressable>
          )}
        </HStack>
      </HStack>

      {/* Conteúdo da publicação */}
      <Box px={4} pb={2}>
        <Text fontSize="md" color="coolGray.700" lineHeight={24}>
          {item.content}
        </Text>
      </Box>

      {/* Galeria de imagens */}
      {item.images && item.images.length > 0 && (
        <Box>
          <FlatList
            data={item.images}
            keyExtractor={(image, index) => `image-${index}-${image.url}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            p={1}
            renderItem={({ item: image }) => (
              // Usar o URL direto da imagem em vez de tentar processá-lo por uma função inexistente
              <GalleryImage imageUrl={image.url} />
            )}
          />
        </Box>
      )}
    </Box>
  );
}
