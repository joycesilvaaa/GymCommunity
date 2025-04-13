import React from 'react';
import { Box, VStack, HStack, Text, Pressable, Icon } from 'native-base';
import { NavigationProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

interface ItemCardProps {
  title: string; 
  description: string; 
  screen: string;
  navigation: NavigationProp<any>;
  id: string; 
  iconName: keyof typeof MaterialIcons.glyphMap; 
}

export function ItemCard({ title, description, navigation, screen, id, iconName }: ItemCardProps) {
  return (
    <Box p={3} bg="white" mb={3} shadow={1} borderRadius={10}>
      <Pressable onPress={() => navigation.navigate(screen, { id })}>
        <VStack space={3}>
          <HStack alignItems="center" justifyContent="space-between">
            <VStack flex={1}>
              <Text fontSize="lg" fontWeight="bold" ml={2} color="indigo.600">
                {title}
              </Text>
              <Text ml={2} color="gray.400">{description}</Text>
            </VStack>
            <Icon as={MaterialIcons} name={iconName} size={30} color="indigo.600" />
          </HStack>
        </VStack>
      </Pressable>
    </Box>
  );
}
