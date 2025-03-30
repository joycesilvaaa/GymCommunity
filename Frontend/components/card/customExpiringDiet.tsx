import React from 'react';
import { Box, VStack, HStack, Text, Pressable, Icon } from 'native-base';
import { NavigationProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

interface ExpiringDietCardProps {
  title: string; // Nome do item (usuário, treino, dieta)
  description: string; // Descrição dinâmica
  screen: string; // Tela para navegar
  navigation: NavigationProp<any>;
  dietId: string; // Identificador genérico
  iconName: keyof typeof MaterialIcons.glyphMap; // Ícone dinâmico
  userId: string;
}

export function ExpiringDietCard({ title, description, navigation, screen, dietId, iconName, userId}: ExpiringDietCardProps){
  return (
    <Box p={3} bg="white" mb={4} shadow={1} borderRadius={5}>
        <VStack space={3}>
          <HStack alignItems="center" justifyContent="space-between">
            <VStack flex={1} space={1}>
              <Text fontSize="lg" fontWeight="bold" ml={2} color="indigo.600">
          {title}
              </Text>
              <Text ml={2} color="gray.400">{description}</Text>
            </VStack>
            <Icon as={MaterialIcons} name={iconName} size={30} color="indigo.600" />
          </HStack>
          <HStack justifyContent="space-between" alignItems="center">
            <Pressable onPress={() => navigation.navigate("ViewDiet", { dietId })}>
              <Text color="blue.500" underline ml={2}>
          Ver Dieta
              </Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate("UserProfile", { userId })}>
              <Text color="blue.500" underline mr={2}>
          Ver Usuário
              </Text>
            </Pressable>
          </HStack>
        </VStack>
    </Box>
  );
}