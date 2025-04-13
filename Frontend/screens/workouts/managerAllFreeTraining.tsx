import { Layout } from '@/components/layout';
import { NavigationProps } from '@/interfaces/navigation';
import { useEffect, useState } from 'react';
import { Box, Text, Icon, Button } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Center, VStack } from 'native-base';
import { ItemCard } from '@/components/card/customItemCard';
import routes from '@/api/api';
import { ViewWorkout } from '@/interfaces/workout_plans';

function ManagerAllFreeTraining({ navigation }: NavigationProps) {
  const [workouts, setWorkouts] = useState<ViewWorkout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWorkouts();
  }, []);
  
  

  async function fetchWorkouts() {
    try {
      const response = await routes.allFreeDietsByProfissional();
      setWorkouts(response.data.data);
      setIsLoading(false);
    }
    catch (error) {
      console.error('Error fetching workouts:', error);
    }
    finally {
      setIsLoading(false);
    }
  }
  if (isLoading) {
    return (
      <Layout navigation={navigation}>
        <Center flex={1}>
          <Icon as={MaterialIcons} name="fitness-center" size="xl" color="gray.400" />
          <Text fontSize="lg" color="gray.500" textAlign="center">
            Carregando treinos gratuitos...
          </Text>
        </Center>
      </Layout>
    );
  }

  return (
    <Layout navigation={navigation}>
      <Box flex={1} bg="gray.50" p={4}>
        <Box flexDirection="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Text fontSize="xl" color="indigo.600" fontWeight="bold">
            Treinos Gratuitos
          </Text>
          {workouts.length > 0 && (
             <Button onPress={() => navigation.navigate('CreateWorkout')} colorScheme="indigo">
             Criar Treino
                 </Button>

          )}

        </Box>
        {workouts.length === 0 ? (
          <Center flex={1} mt={5}>
            <VStack space={4} alignItems="center">
              <Icon as={MaterialIcons} name="fitness-center" size="xl" color="gray.400" />
              <Text fontSize="lg" color="gray.500" textAlign="center">
          Nenhum treino gratuito disponível foi adicionado ainda.
              </Text>
              <Text fontSize="md" color="gray.400" textAlign="center">
          Comece a inspirar outros criando um treino público agora mesmo!
              </Text>
              <Button onPress={() => navigation.navigate('CreateWorkout')} colorScheme="indigo">
          Criar Treino Público
              </Button>
            </VStack>
          </Center>
        ) : (
          workouts.map((workout: ViewWorkout) => (
            <ItemCard
              key={workout.id}
              title={workout.title}
              description={workout.description}
              navigation={navigation}
              screen="ViewWorkout"
              id={workout.id.toString()}
              iconName="fitness-center"
            />
          ))
        )}
      </Box>
    </Layout>
  );
}

export default ManagerAllFreeTraining;
