import React from 'react';
import { Box, VStack, HStack, Text, IconButton, Pressable, Icon } from 'native-base';
import { NavigationProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

interface RetanguleCardProps {
  type: string; 
  description: string; 
  screen: string; 
  navigation: NavigationProp<any>;
  icon: JSX.Element;
  route?: any;
}

export function RetanguleCard({ type, description, navigation, icon, screen, route }: RetanguleCardProps) {
  const handlePress = () => {
    const id = route?.params?.id || 1;
    navigation.navigate(screen, { id });
  };

  return (
    <Box p={4} bg="white" mb={4} shadow={1} borderRadius={10} overflow="hidden" >
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

