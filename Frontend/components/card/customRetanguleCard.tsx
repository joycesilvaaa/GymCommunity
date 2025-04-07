import React from 'react';
import { Box, VStack, HStack, Text, IconButton, Pressable, Icon } from 'native-base';
import { NavigationProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

interface RetanguleCardProps {
  type: string; // Tipo do card
  description: string; // Descrição dinâmica
  screen: string; // Tela para navegar
  navigation: NavigationProp<any>;
  icon: JSX.Element; // Ícone passado como componente React
  route?: any;
}

export function RetanguleCard({ type, description, navigation, icon, screen, route }: RetanguleCardProps) {
  const handlePress = () => {
    const id = route?.params?.id || 1;
    navigation.navigate(screen, { id });
  };

  return (
    <Box p={4} bg="gray.50" mb={4} shadow={2} borderRadius={10}>
      <Pressable onPress={handlePress}>
        <VStack space={3}>
          <HStack alignItems="center" justifyContent="space-between">
            <VStack flex={1}>
              <Text fontSize="lg" fontWeight="bold" ml={2} color={"indigo.600"}>
                {type}
              </Text>
              <Text ml={2} color={"gray.400"}>{description}</Text>
            </VStack>
            <Icon as={icon} size={30} color="indigo.600" />
          </HStack>
        </VStack>
      </Pressable>
    </Box>
  );
}

