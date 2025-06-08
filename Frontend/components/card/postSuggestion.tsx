import React from 'react';
import { Box, Text, HStack, VStack, Avatar } from 'native-base';
import { ListRenderItemInfo } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/auth';
import { Pressable } from 'native-base';
import { Share } from 'react-native';

type Publication = {
  id: number;
  create_date: string;
  content: string;
  user_id: number;
  handle: () => void;
  user_name?: string;
  user_avatar?: string;
};

export function RenderPostSuggestionItem({ item }: ListRenderItemInfo<Publication>) {
  const { user } = useAuth() as {
    user?: { id: number; user_profile: number; name: string; avatar_url: string };
  };

  const handleShare = async () => {
    try {
      const message = `Confira meu progresso fitness:\n\n"${item.content}"\n\nCompartilhado via GYMCommunity!`;
      await Share.share({
        message,
        title: 'Compartilhar Progresso',
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  return (
    <Box
      borderRadius="lg"
      p={4}
      mb={4}
      bg="white"
      shadow={1}
      borderLeftWidth={3}
      borderLeftColor="blue.500"
    >
      <HStack space={3} alignItems="center" mb={4}>
        <Avatar
          bg="blue.500"
          size="md"
          source={item.user_avatar ? { uri: item.user_avatar } : undefined}
        >
          {item.user_name?.charAt(0) || 'U'}
        </Avatar>

        <VStack flex={1}>
          <Text fontSize="md" fontWeight="bold" color="coolGray.800">
            {item.user_name || 'Usuário Fitness'}
          </Text>

          <Text fontSize="xs" color="coolGray.500" mt={0.5}>
            <Ionicons name="time-outline" size={14} color="#94a3b8" />{' '}
            {new Date(item.create_date).toLocaleDateString('pt-BR')}
          </Text>
        </VStack>

        <HStack space={2} alignItems="center">
          <Pressable
            onPress={handleShare}
            bg="emerald.100"
            p={2}
            borderRadius="full"
            borderWidth={1}
            borderColor="emerald.200"
            _pressed={{ bg: 'emerald.200' }}
          >
            <Ionicons name="share-social" size={20} color="#10B981" />
          </Pressable>

          {user?.id === item.user_id && (
            <Pressable
              onPress={item.handle}
              bg="red.100"
              p={2}
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

      <Text fontSize="md" color="coolGray.700" lineHeight={24} fontFamily="body">
        {item.content}
      </Text>
    </Box>
  );
}
