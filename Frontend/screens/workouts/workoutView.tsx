import React, { useState } from 'react';
import { Box, ScrollView, VStack, Text, HStack, Badge, Button } from 'native-base';
import { Pressable } from 'react-native';
import WorkoutPlanCard from '../../components/card/workoutPlanCard';
import ExerciseDetailModal from '../../components/exercicioDetail';
import { Exercise, WorkoutData } from '../../interfaces/workout_plans';
import { NavigationProps } from '@/interfaces/navigation';
import { Layout } from '@/components/layout';

import { useEffect } from 'react';
import routes from '@/api/api';
import { Toast } from 'native-base';
import Loading from '@/components/loading';

function WorkoutScreen({ navigation, route }: NavigationProps) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [workoutData, setWorkoutData] = useState<WorkoutData>();
  const [isLoading, setIsLoading] = useState(true);
  const { id } = route.params || undefined;
  useEffect(() => {
    if (workoutData) {
      console.log('Workout Data atualizado:', workoutData);
      workoutData.plans[0]?.exercises.forEach((exercise, index) => {
        console.log(`Exercise ${index + 1}:`, exercise); // Exibe cada exercício
      });
    }
  }, [workoutData]);
  useEffect(() => {
    if (id) {
      getWorkoutDataById();
    } else {
      getWorkoutData();
    }

    
  }, []);

  async function getWorkoutData() {
    const response = await routes.workoutActual();
    if (response.status === 200) {
      setWorkoutData(response.data.data);
      setIsLoading(false);
    } else {
      Toast.show({
        title: 'Erro ao carregar os dados do treino',
        variant: 'solid',
        duration: 3000,
      });
    }
  }

  async function getWorkoutDataById() {
    const response = await routes.workoutById(id);
    if (response.status === 200) {
      setWorkoutData(response.data.data);
      setIsLoading(false);

    } else {
      Toast.show({
        title: 'Erro ao carregar os dados do treino',
        variant: 'solid',
        duration: 3000,
      });
    }
  }

  function handleExercisePress(exercise: Exercise) {
    setSelectedExercise(exercise);
    setModalVisible(true);
  }

  if (isLoading) {
    return (
      <Layout navigation={navigation}>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout navigation={navigation}>
      <Box flex={1} p={4}>
        {/* Seletor de Dias */}
        <HStack space={3} mb={4}>
          {workoutData?.plans?.map((plan, index) => (
            <Pressable key={index} onPress={() => setActiveDayIndex(index)}>
              <Box
                px={4}
                py={2}
                rounded="full"
                bg={activeDayIndex === index ? 'primary.600' : 'gray.200'}
              >
                <Text color={activeDayIndex === index ? 'white' : 'gray.600'} bold>
                  Dia {String.fromCharCode(65 + index)}
                </Text>
              </Box>
            </Pressable>
          ))}
        </HStack>

        {/* Treino do Dia Selecionado */}
        <VStack flex={1}>
          {workoutData && workoutData.plans && (
            <WorkoutPlanCard
              plan={workoutData.plans[activeDayIndex]}
              onExercisePress={handleExercisePress}
            />
          )}
        </VStack>

        <ExerciseDetailModal
          exercise={selectedExercise}
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </Box>
      <Box p={4}>
        {id === undefined ? (
          <Button
            onPress={() => navigation.navigate('StartWorkout', { id: activeDayIndex })}
            colorScheme="indigo"
            size="lg"
            borderRadius="md"
          >
            Iniciar Treino
          </Button>
        ) : (
          <Button
            onPress={() => navigation.goBack()}
            colorScheme="indigo"
            size="lg"
            borderRadius="md"
          >
            Voltar
          </Button>
        )}
      </Box>
    </Layout>
  );
}

export default WorkoutScreen;
