import { WorkoutData } from '../../interfaces/workout_plans';
import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  HStack,
  Progress,
  Badge,
  Center,
  Image,
  AspectRatio,
} from 'native-base';
import { Layout } from '@/components/layout';
import routes from '@/api/api';
import { Toast } from 'native-base';
import { NavigationProps } from '@/interfaces/navigation';
import Loading from '@/components/loading';

function StartWorkoutScreen({ navigation, route }: NavigationProps) {
  const { id } = route.params;
  const [workoutData, setWorkoutData] = useState<WorkoutData>();
  const plan = workoutData?.plans?.[id];
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const convertMinutesToSeconds = (minutes: number) => Math.round(minutes * 60);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getWorkoutData();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (plan?.exercises?.[currentExerciseIndex]?.rest_time) {
      setTimeLeft(convertMinutesToSeconds(plan.exercises[currentExerciseIndex].rest_time));
    }
  }, [plan, currentExerciseIndex]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isResting && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => timer && clearInterval(timer);
  }, [isResting, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  async function getWorkoutData() {
    try {
      const response = await routes.workoutActual();
      if (response.status === 200) {
        setWorkoutData(response.data.data);
      }
    } catch (error) {
      Toast.show({
        title: 'Erro ao carregar os dados do treino',
        variant: 'solid',
        duration: 3000,
      });
    }
  }

  const currentExercise = plan?.exercises?.[currentExerciseIndex];
  const totalExercises = plan?.exercises?.length || 0;
  const progressValue =
    totalExercises > 0 ? Math.floor(((currentExerciseIndex + 1) / totalExercises) * 100) : 0;

  const handleNextExercise = () => {
    if (!currentExercise || !plan) return;

    if (currentExerciseIndex < totalExercises - 1) {
      setIsResting(true);
      setTimeLeft(convertMinutesToSeconds(currentExercise.rest_time));
      setTimeout(() => {
        setCurrentExerciseIndex((prev) => prev + 1);
        setIsResting(false);
      }, convertMinutesToSeconds(currentExercise.rest_time) * 1000);
    } else {
      navigation.navigate('WorkoutComplete', { id: id });
    }
  };
  if (isLoading) {
    return (
      <Layout navigation={navigation}>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout navigation={navigation}>
      <Box flex={1} safeArea bg="gray.50" p={4}>
        <VStack space={4} flex={1}>
          <Progress value={progressValue} size="sm" colorScheme="indigo" />

          <Text fontSize="2xl" bold textAlign="center">
            {plan?.title} ({currentExerciseIndex + 1}/{totalExercises})
          </Text>

          {currentExercise && (
            <Box bg="white" rounded="xl" p={4}>
              {currentExercise.image_url && (
                <AspectRatio ratio={16 / 9}>
                  <Image
                    source={{ uri: currentExercise.image_url }}
                    alt="Exercise"
                    resizeMode="cover"
                    rounded="md"
                  />
                </AspectRatio>
              )}

              <VStack space={2} mt={4}>
                <Text fontSize="xl" bold>
                  {currentExercise.name}
                </Text>
                <HStack space={2}>
                  <Badge colorScheme="purple" fontSize="lg" px={4} py={2}>
                    {currentExercise.muscle_group}
                  </Badge>
                  <Badge colorScheme="green" fontSize="lg" px={4} py={2}>
                    {currentExercise.repetitions}
                  </Badge>
                </HStack>
                <Text>{currentExercise.description}</Text>
              </VStack>
            </Box>
          )}

          {isResting ? (
            <Center flex={1}>
              <Text fontSize="4xl" bold color="indigo.600">
                {formatTime(timeLeft)}
              </Text>
              <Text color="gray.500">Tempo de descanso</Text>
            </Center>
          ) : (
            <VStack space={2}>
              <Button
                variant={'solid'}
                colorScheme="indigo"
                onPress={handleNextExercise}
                isDisabled={!currentExercise}
              >
                {currentExerciseIndex === totalExercises - 1
                  ? 'Finalizar Treino'
                  : 'Próximo Exercício'}
              </Button>

              {currentExerciseIndex > 0 && (
                <Button variant="ghost" onPress={() => setCurrentExerciseIndex((prev) => prev - 1)}>
                  Voltar
                </Button>
              )}
            </VStack>
          )}
        </VStack>
      </Box>
    </Layout>
  );
}

export default StartWorkoutScreen;
