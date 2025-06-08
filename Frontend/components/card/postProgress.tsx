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
  Icon
} from 'native-base';
import { ListRenderItemInfo, Platform, Share, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import { Linking } from 'react-native';
import { useAuth } from '@/hooks/auth';

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
  const { user } = useAuth() as { user?: { id: number; user_profile: number; name: string; avatar_url: string } };
  const [showMessage, setShowMessage] = useState(false);

  // Função para compartilhar a publicação
  const handleShare = async () => {
    try {
      // Criar mensagem de compartilhamento
      const message = `Confira meu progresso fitness:\n\n"${item.content}"\n\nCompartilhado via GYMCommunity!`;

      // Mostrar mensagem flutuante
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);

      // Se tivermos imagens, compartilhar como imagem + texto
      if (item.images && item.images.length > 0) {
        await Sharing.shareAsync(item.images[0].url, {
          dialogTitle: 'Compartilhar Progresso',
          mimeType: 'image/jpeg',
          UTI: 'public.jpeg'
        });
      } else {
        await Share.share({
          message,
          title: 'Compartilhar Progresso'
        });
      }

    } catch (error) {
      toast.show({
        description: 'Erro ao compartilhar',
        placement: 'top',
        bg: 'red.500'
      });
      console.error('Erro ao compartilhar:', error);
    }
  };

  // Função para compartilhar diretamente no Instagram
  const shareToInstagram = async () => {
    try {
      const instagramUrl = Platform.OS === 'ios'
        ? 'instagram://app'
        : 'com.instagram.android';
      const canOpen = await Linking.canOpenURL(instagramUrl);

      if (!canOpen) {
        toast.show({
          description: 'Instagram não instalado',
          placement: 'top',
          bg: 'yellow.500'
        });
        return;
      }

      // Mostrar mensagem flutuante
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);

      if (item.images && item.images.length > 0) {
        await IntentLauncher.startActivityAsync('com.instagram.share.ADD_TO_STORY', {
          data: item.images[0].url,
          type: 'image/jpeg',
        });
      } else {
        toast.show({
          description: 'Nenhuma imagem para compartilhar no Instagram',
          placement: 'top',
          bg: 'yellow.500'
        });
      }
    } catch (error) {
      toast.show({
        description: 'Erro ao compartilhar no Instagram',
        placement: 'top',
        bg: 'red.500'
      });
      console.error('Erro ao compartilhar no Instagram:', error);
    }
  };

  // Componente para renderizar cada imagem da galeria com seu próprio estado
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
              uri: 'https://via.placeholder.com/280x200?text=Imagem+não+disponível' 
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
                  year: 'numeric'
                })}
              </Text>
            </HStack>
          </VStack>
        </HStack>
        <HStack p={3} justifyContent="space-between" borderTopWidth={1} borderTopColor="coolGray.100">
        
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

       {user?.id === item.user_id && (<Pressable 
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
        </Pressable>)}
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
            renderItem={({ item: image }) => {
              // Garantir URL absoluta
              const absoluteUrl = image.url.startsWith('http')
                ? image.url
                : `https://seu-dominio.com/${image.url.replace(/^\/+/, '').replace(/\\/g, '/')}`;
              return <GalleryImage imageUrl={absoluteUrl} />;
            }}
          />
        </Box>
      )}
    </Box>
  );
}