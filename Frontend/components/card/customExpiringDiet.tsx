import React from 'react';
import { Box, VStack, HStack, Text, Pressable, Icon, Badge, Circle } from 'native-base';
import { NavigationProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
interface ExpiringDietCardProps {
  title: string; // Nome do item (usuário, treino, dieta)
  description: string; // Descrição dinâmica
  navigation: NavigationProp<any>;
  dietId: string; // Identificador genérico
  iconName: keyof typeof MaterialIcons.glyphMap; // Ícone dinâmico
  userId: string;
}

export function ExpiringDietCard({ 
  title, 
  description, 
  navigation, 
  dietId, 
  iconName, 
  userId 
}: ExpiringDietCardProps) {
  return (
    <Box 
      p={4} 
      bg="white" 
      mb={4} 
      shadow={3} 
      borderRadius="xl"
      borderWidth={1}
      borderColor="coolGray.100"
      _dark={{ bg: "dark.100", borderColor: "dark.300" }}
    >
      <VStack space={3}>
        <HStack alignItems="center" space={4}>
          <Circle bg="indigo.100" size={12}>
            <Icon 
              as={MaterialIcons} 
              name={iconName} 
              size={6} 
              color="indigo.600" 
              _dark={{ color: "indigo.300" }}
            />
          </Circle>
          
          <VStack flex={1}>
            <Text 
              fontSize="lg" 
              fontWeight="bold" 
              color="indigo.600"
              _dark={{ color: "indigo.200" }}
              numberOfLines={1}
            >
              {title}
            </Text>
            <HStack alignItems="center" space={2}>
              <Icon 
                as={MaterialIcons} 
                name="description" 
                size={4} 
                color="coolGray.400" 
              />
              <Text 
                fontSize="sm" 
                color="coolGray.600"
                _dark={{ color: "coolGray.300" }}
                numberOfLines={2}
              >
                {description}
              </Text>
            </HStack>
          </VStack>
          
          <Badge 
            colorScheme="orange" 
            alignSelf="flex-start"
            borderRadius="md"
            variant="subtle"
          >
            3 dias
          </Badge>
        </HStack>

        <HStack 
          justifyContent="space-between" 
          borderTopWidth={1} 
          borderTopColor="coolGray.100"
          pt={3}
          _dark={{ borderTopColor: "dark.300" }}
        >
          <Pressable 
            onPress={() => navigation.navigate("ViewDiet", { id: dietId })}
            flexDirection="row"
            alignItems="center"
            _pressed={{ opacity: 0.6 }}
          >
            <Icon 
              as={MaterialIcons} 
              name="visibility" 
              size={5} 
              color="blue.500" 
              mr={1}
            />
            <Text 
              fontSize="md" 
              fontWeight="medium" 
              color="blue.500"
              _dark={{ color: "blue.400" }}
            >
              Ver Dieta
            </Text>
          </Pressable>

          <Pressable 
            onPress={() => navigation.navigate("UserProfile", { id: userId })}
            flexDirection="row"
            alignItems="center"
            _pressed={{ opacity: 0.6 }}
          >
            <Icon 
              as={MaterialIcons} 
              name="person" 
              size={5} 
              color="emerald.600" 
              mr={1}
            />
            <Text 
              fontSize="md" 
              fontWeight="medium" 
              color="emerald.600"
              _dark={{ color: "emerald.400" }}
            >
              Perfil
            </Text>
          </Pressable>
        </HStack>
      </VStack>
    </Box>
  );
}