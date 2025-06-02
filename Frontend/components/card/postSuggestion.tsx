import React from 'react';
import { Box, Text, HStack, VStack, Avatar } from 'native-base';
import { ListRenderItemInfo } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Publication = {
  id: number;
  created_at: string;
  content: string;
  user_id: number;
  user_name?: string;
  user_avatar?: string;
};

export function RenderPostSuggestionItem({ item }: ListRenderItemInfo<Publication>) {
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
      <HStack space={3} alignItems="center" mb={3}>
        <Avatar
          bg="blue.100"
          size="sm"
          source={item.user_avatar ? { uri: item.user_avatar } : undefined}
        >
          {item.user_name?.charAt(0) || 'U'}
        </Avatar>
        <VStack>
          <Text fontSize="sm" fontWeight="medium" color="coolGray.800">
            {item.user_name || 'Usuário Fitness'}
          </Text>
          <HStack alignItems="center" space={1}>
            <Ionicons name="time-outline" size={14} color="#94a3b8" />
            <Text fontSize="xs" color="coolGray.500">
              {new Date(item.created_at).toLocaleDateString('pt-BR')}
            </Text>
          </HStack>
        </VStack>
      </HStack>

      <Text fontSize="md" color="coolGray.700" lineHeight={22}>
        {item.content}
      </Text>
    </Box>
  );
}
