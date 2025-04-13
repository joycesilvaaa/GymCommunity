import React, { useEffect, useState } from 'react';
import { Box, Text, Button, View } from 'native-base'; // Usando Button e Text do NativeBase
import { Layout } from '@/components/layout';
import { Alert } from 'react-native';

interface ExerciseOption {
  nameExercise: string;
  repetition: string;
}

interface Meal {
  name: string; // Nome do treino
  options: ExerciseOption[]; // Exercícios e repetições
}

interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  duration: number;
  meals: Meal[]; // Treinos dentro do plano
}

interface ViewTrainingProps {
  navigation: any; // Navegação
  route: any; // Rota da navegação
}

const loadMeals = (): TrainingPlan => {
  return {
    id: '1',
    name: 'Plano de Treino para Fortalecimento',
    description: 'Plano alimentar para suporte ao fortalecimento muscular.',
    duration: 1,
    meals: [
      { name: 'Treino A - Superior', options: [{ nameExercise: 'Supino', repetition: '12 repetições' }, { nameExercise: 'Supino', repetition: '12 repetições' }, { nameExercise: 'Supino', repetition: '12 repetições' }] },
      { name: 'Treino B - Superior', options: [{ nameExercise: 'Supino', repetition: '12 repetições' }, { nameExercise: 'Supino', repetition: '12 repetições' }, { nameExercise: 'Supino', repetition: '12 repetições' }] },
    ],
  };
};

export function ViewTraining({ navigation, route }: ViewTrainingProps) {
  const { id } = route.params;
  const previousRoute = navigation.getState()?.routes[navigation.getState().index - 1]?.name;
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null);
  const [typeView, setTypeView] = useState<string>('default');

  useEffect(() => {
    if (previousRoute === 'ExpiringTraining') {
      setTypeView('expiring');
    } else {
      setTypeView('default');
    }
  }, [previousRoute]);

  useEffect(() => {
    const trainingData = loadMeals(); // Carrega os dados do plano de treino
    setTrainingPlan(trainingData); // Atualiza o estado com o plano de treino
  }, [id]);

  const handleFinish = () => {
    Alert.alert(
      'Finalizar Plano',
      'Você tem certeza que deseja finalizar este plano de treino?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => console.log('Plano de treino finalizado!') },
      ]
    );
  };

  if (!trainingPlan) {
    return <Text>Carregando...</Text>; // Exibindo um texto de carregamento até o plano estar pronto
  }

  return (
    <Layout navigation={navigation}>
      <Text fontSize="xl" color="indigo.700" fontWeight="bold" textAlign="center">
        {trainingPlan.name}
      </Text>
      <Text fontSize="md" color="gray.600" textAlign="center" mb={4}>
        {trainingPlan.description}
      </Text>

      <Box flexDirection="row" justifyContent="center" alignItems="center">
        {typeView === 'expiring' ? (
          <Button size="sm" colorScheme="indigo" width="40%" onPress={handleFinish}>
            Finalizar
          </Button>
        ) : (
          <Button variant={'outline'} colorScheme="indigo" width="40%" onPress={() => navigation.goBack()}>
            Voltar
          </Button>
        )}
      </Box>
      <View mt={2} p={2}  margin={5} background={'white'}>
    {trainingPlan.meals.map((meal, index) => (
      <Box key={index} mt={2} p={2}>
        <Text fontSize="lg" fontWeight="bold" color="indigo.700" textAlign="center">
          {meal.name}
        </Text>
        {meal.options.map((option, idx) => (
          <Box
            key={idx}
            mt={2}
            flexDirection="row"
            justifyContent="space-between"
            borderWidth={1}
            borderColor="gray.300"
            p={2}
            background={'white'}
          >
            <Text fontSize="md" color="gray.600" flex={1}>
              {option.nameExercise}
            </Text>
            <Box
              borderLeftWidth={1}
              borderColor="gray.300"
              mx={2}
              height="100%"
            />
            <Text fontSize="md" color="gray.600" flex={1} textAlign="right">
              {option.repetition}
            </Text>
          </Box>
        ))}
      </Box>
    ))}
    <Box mt={4} alignItems="center">
       
    </Box>
      </View>  
    </Layout>
  );
}
