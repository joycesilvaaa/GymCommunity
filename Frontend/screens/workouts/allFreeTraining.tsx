import { FormCreate } from '@/components/forms/formCreate'; 
import { NavigationProp } from '@react-navigation/native';
import { Button, View, Text, Icon, Center, VStack, Box } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Layout } from '@/components/layout';
import { Input } from 'native-base';
import { ItemCard } from '@/components/card/customItemCard';
import { useState } from 'react';
import { NavigationProps } from '@/interfaces/navigation';
import { ViewWorkout } from '@/interfaces/workout_plans';
import { useEffect } from 'react';
import routes from '@/api/api';



export function AllFreeWorkouts({ navigation }: NavigationProps) {  
    const [isLoading, setIsLoading] = useState(true);
    const [workouts, setWorkouts] = useState<ViewWorkout[]>([]);
    
  useEffect(() => {
    fetchWorkouts();
  }, []);
  
  
  async function fetchWorkouts() {
    try {
      const response = await routes.allFreeWorkouts();
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
        <Layout navigation={navigation} >
            <Box flex={1} bg="gray.50" p={4}>
            <View flexDirection="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Text fontSize="xl" color="indigo.700" fontWeight="bold" textAlign="center">
                Treinos
                </Text>
            </View>
            {workouts.length === 0 ? (
          <Center flex={1} mt={5}>
            <VStack space={4} alignItems="center">
              <Icon as={MaterialIcons} name="fitness-center" size="xl" color="gray.400" />
              <Text fontSize="lg" color="gray.500" textAlign="center">
                Nenhum treino gratuito disponível no momento.
              </Text>
              <Text fontSize="md" color="gray.400" textAlign="center">
                Crie um treino público e inspire outros agora mesmo!
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
              description={`${workout.description}\nCriado por: ${workout?.professional_name}`}
              navigation={navigation}
              screen="ViewWorkout"
              id={workout.id.toString()}
              iconName="fitness-center"
            />
          ))
        )}
        </Box>
            
        </Layout>)
}
