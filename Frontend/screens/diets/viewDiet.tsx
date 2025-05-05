import React, { useEffect, useState } from 'react';
import { Text, VStack, HStack, Button, Icon, useTheme, Spinner, Box, useColorModeValue } from 'native-base';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Layout } from '@/components/layout';
import { Alert, SafeAreaView } from 'react-native';
import { IViewDiet } from '@/interfaces/diet';
import routes from '@/api/api';
import { NavigationProps } from '@/interfaces/navigation';

export function ViewDiet({ navigation, route }: NavigationProps) {
  const { colors } = useTheme();
  const { id } = route.params;
  const previousRoute = navigation.getState()?.routes[navigation.getState().index - 1]?.name;
  const [diet, setDiet] = useState<IViewDiet | null>(null);
  const [typeView, setTypeView] = useState<string>("default");
  const cardBg = useColorModeValue('white', 'coolGray.800');
  const textColor = useColorModeValue('coolGray.800', 'coolGray.100');

  useEffect(() => {
    if (previousRoute === "ExpiringDiet") {
      setTypeView('expiring');
    } else {
      setTypeView('default');
    }
  }, [previousRoute]);

  useEffect(() => {
    getDiet();
  }, [id]);

  const handleFinish = () => {
    Alert.alert(
      "Finalizar Dieta",
      "Você tem certeza que deseja finalizar esta dieta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", onPress: () => handleConfirmFinish() },
      ]
    );
  };

  const handleConfirmFinish = async () => {
    try {
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao finalizar dieta:', error);
    }
  };

  async function getDiet() {
    try {
      const response = await routes.dietById(id);
      setDiet(response.data.data[0]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar a dieta');
    }
  }

  const getMealIcon = (mealTitle: string) => {
    const icons: { [key: string]: string } = {
      'Café da Manhã': 'coffee',
      'Almoço': 'food-fork-drink',
      'Lanche': 'food-croissant',
      'Jantar': 'silverware-fork-knife',
    };
    return icons[mealTitle] || 'food';
  };

  const getQuantityIcon = (type: string) => {
    switch (type) {
      case 'gramas': return 'weight-gram';
      case 'quilos': return 'weight-kilogram';
      case 'livre': return 'infinity';
      default: return 'numeric';
    }
  };

  if (!diet) {
    return (
      <Layout navigation={navigation}>
        <VStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="lg" color="indigo.600" />
          <Text mt={4} color="coolGray.600">Carregando dieta...</Text>
        </VStack>
      </Layout>
    );
  }

  return (
    <Layout navigation={navigation}>
      <SafeAreaView style={{ flex: 1 }}>
        <VStack flex={1} p={4} space={4} bg="gray.50">
          {/* Cabeçalho */}
          <VStack space={2} mb={4}>
            <Text fontSize="2xl" fontWeight="bold" color={textColor} textAlign="center">
              {diet.title}
            </Text>
            <Text fontSize="md" color="coolGray.600" textAlign="center">
              {diet.description}
            </Text>
          </VStack>

          <HStack justifyContent="center" space={3} mb={6}>
            {typeView === "expiring" ? (
              <Button
                leftIcon={<MaterialIcons name="check-circle" size={20} color="white" />}
                colorScheme="indigo"
                borderRadius="lg"
                shadow={2}
                _text={{ fontWeight: 'semibold' }}
                px={6}
                py={3}
                onPress={handleFinish}
              >
                Finalizar Dieta
              </Button>
            ) : (
              <Button
                variant="outline"
                leftIcon={<MaterialIcons name="arrow-back" size={20} color={colors.indigo[600]} />}
                borderColor="indigo.600"
                borderRadius="lg"
                _text={{ color: "indigo.600", fontWeight: 'semibold' }}
                px={6}
                py={3}
                onPress={() => navigation.goBack()}
              >
                Voltar
              </Button>
            )}
          </HStack>

          {/* Lista de Refeições */}
          <VStack space={4}>
            <Text fontSize="lg" fontWeight="semibold" color={textColor} pl={2}>
              Refeições Diárias
            </Text>

            {diet.menu.map((meal, index) => (
              <Box key={index} bg={cardBg} p={4} borderRadius="2xl" shadow={2}>
                <HStack alignItems="center" space={3} mb={3}>
                  <Icon
                    as={MaterialCommunityIcons}
                    name={getMealIcon(meal.title)}
                    size={7}
                    color="indigo.600"
                  />
                  <Text fontSize="lg" fontWeight="medium" color={textColor} textTransform="capitalize">
                    {meal.title.toLowerCase()}
                  </Text>
                </HStack>

                <VStack space={2}>
                  {meal.options.map((option, optionIndex) => (
                    <HStack
                      key={optionIndex}
                      justifyContent="space-between"
                      alignItems="center"
                      bg="coolGray.50"
                      p={3}
                      borderRadius="md"
                      space={2}
                    >
                      <HStack space={3} alignItems="center" flex={1}>
                        <Icon
                          as={MaterialCommunityIcons}
                          name={getQuantityIcon(option.type)}
                          size={5}
                          color="indigo.500"
                        />
                        <Text 
                          color="coolGray.700" 
                          flexShrink={1}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {option.name}
                        </Text>
                      </HStack>
                      <Text color="coolGray.600" fontWeight="medium">
                        {option.type === 'livre' ? (
                          "Livre"
                        ) : (
                          `${option.quantity}${option.type === 'gramas' ? 'g' : option.type === 'quilos' ? 'kg' : 'un'}`
                        )}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            ))}
          </VStack>
        </VStack>
      </SafeAreaView>
    </Layout>
  );
}