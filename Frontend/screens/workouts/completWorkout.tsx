import React from 'react';
import { Box, VStack, Text, Button, Center } from 'native-base';
import { NavigationProps } from '@/interfaces/navigation';
import { Layout } from '@/components/layout';
import routes from '@/api/api';

function WorkoutCompleteScreen({ navigation, route }: NavigationProps) {
  const { id } = route.params;

  async function handleWorkoutComplete() {
    try {
      const response = await routes.finishDailyWorkout(id);
      if (response.status === 200) {
        navigation.navigate('Home');
      } else {
        console.error('Error completing workout:', response.data.message);
      }
    } catch (error) {
      console.error('Error completing workout:', error);
    }
  }

  return (
    <Box flex={1} safeArea bg="gray.100" p={4}>
      <Center flex={1}>
        <VStack space={4} alignItems="center">
          <Text fontSize="4xl" bold color="primary.600">
            🎉
          </Text>
          <Text fontSize="2xl" bold>
            Treino Concluído!
          </Text>
          <Text textAlign="center" color="gray.600">
            Parabéns por completar seu treino!
          </Text>

          <Button mt={8} colorScheme="indigo" onPress={() => handleWorkoutComplete()}>
            Finalizar Treino
          </Button>
        </VStack>
      </Center>
    </Box>
  );
}

export default WorkoutCompleteScreen;
