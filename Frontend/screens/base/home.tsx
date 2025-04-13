import { Box } from 'native-base';
import { Layout } from '@/components/layout';
import { RetanguleCard } from '@/components/card/customRetanguleCard';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/auth';
import  routes  from '@/api/api';
import { dietActualPrevious } from '@/interfaces/diet';
import { WorkoutActualPrevious } from '@/interfaces/workout_plans';
import { NavigationProps } from '@/interfaces/navigation';
import { useEffect, useState } from 'react';

export function Home({ navigation }: NavigationProps) {
  const { user } = useAuth() as { user?: { id: number; user_profile: number } };
  const [userType, setUserType] = useState<number>(user && user.user_profile ? user.user_profile : 1);
  const [quantityFreeDiets, setQuantityFreeDiets] = useState<number>(0);
  const [quantityFreeWorkout, setQuantityFreeWorkout] = useState<number>(0);
  const [actualDietPrevius, setActualDietPrevius] = useState<dietActualPrevious | null>(null);
  const [actualWorkoutPrevius, setActualWorkoutPrevius] = useState<WorkoutActualPrevious | null>(null);
  const [expiringDiet, setExpiringDiet] = useState<number>(0);
  const [expiringWorkout, setExpiringWorkout] = useState<number>(0);


  useEffect(() => {
    getquantityFreeDiets();
    getQuantityFreeWorkout();
    if (userType === 1) {
      getActualDietPrevius();
      getActualWorkoutPrevius();
    }
    if (userType === 2) {
      getActualWorkoutPrevius();
    }
    if (userType === 3) {
      getExpiringDiet();
      getExpiringWorkout();
    }
  }, []);

  async function getquantityFreeDiets() {
    const response = await routes.quantityFreeDiets();
    setQuantityFreeDiets(response.data.data.quantity);
  }
  async function getActualDietPrevius() {
    if (!user?.id) return navigation.navigate('Initial');
    const response = await routes.actualDietPrevious(user.id);
    console.log(response.data.data);
    setActualDietPrevius(response.data.data.length > 0 ? response.data.data[0] : null);
  }
  async function getActualWorkoutPrevius() {
    if (!user?.id) return navigation.navigate('Initial');
    const response = await routes.actualWorkoutPrevious(user.id);
    console.log(response.data.data);
    setActualWorkoutPrevius(response.data.data.length > 0 ? response.data.data[0] : null);
  }
  async function getQuantityFreeWorkout() {
    const response = await routes.quantityFreeWorkout();
    console.log(response.data.data);
    setQuantityFreeWorkout(response.data.data.quantity);
  }
  async function getExpiringDiet() {
    if (!user?.id) return navigation.navigate('Initial');
    const response = await routes.expiringDiet();
    console.log(response.data.data);
    setExpiringDiet(response.data.data.length);
  }
  async function getExpiringWorkout() {
    if (!user?.id) return navigation.navigate('Initial');
    const response = await routes.expiringWorkouts();
    console.log(response.data.data);
    setExpiringWorkout(response.data.data.length);
  }
  
  const cardData = [
    {
      type: 'Dieta Atual',
      description: actualDietPrevius ? `Dia inicial: ${actualDietPrevius.start_date}\nDia final: ${actualDietPrevius.end_date}` : 'Sem dietas atual',
      icon: <MaterialIcons name="restaurant" />,
      screen: actualDietPrevius? 'ViewDiet': 'Home',
    },
    {
      type: 'Treino Atual',
      description: actualWorkoutPrevius ? `Dia inicial: ${actualWorkoutPrevius.start_date}\nDia final: ${actualWorkoutPrevius.end_date}` : 'Sem treinos atual',
      icon: <MaterialIcons name="fitness-center" />,
      screen: actualWorkoutPrevius ? 'ViewWorkout' : 'Home',
    },
    {
      type: 'Dietas Gratuitas',
      description: `Quantidade de dietas disponíveis: ${quantityFreeDiets}`,
      icon: <MaterialIcons name="local-dining" />,
      screen: quantityFreeDiets > 0 ? 'AllFreeDiets' : 'Home',
    },
    {
      type: 'Treinos Gratuitos',
      description: `Quantidade de treinos disponíveis: ${quantityFreeWorkout}`,
      icon: <MaterialIcons name="directions-run" />,
      screen: quantityFreeWorkout > 0 ? 'AllFreeWorkout' : 'Home',
    },
    {
      type: 'Lista de Compras',
      description: 'Visualize suas listas de compras',
      icon: <MaterialIcons name="shopping-cart" />,
      screen: "ShoppingList",
    },
  ];

  const cardDataNutricionista = [
    {
      type: 'Adicionar Aluno',
      description: 'Adicione um aluno à comunidade',
      icon: <MaterialIcons name="group-add" />,
      screen: 'ManangerClients',
    },
    {
      type: 'Dietas a Vencer',
      description: `Quantidade de dietas: ${expiringDiet}`,
      icon: <MaterialIcons name="event" />,
      screen: 'ExpiringDiet',
    },
    {
      type: 'Dietas Gratuitas',
      description: `Quantidade de dietas disponíveis: ${quantityFreeDiets}`,
      icon: <MaterialIcons name="local-dining" />,
      screen: quantityFreeDiets > 0 ? 'AllFreeDiets' : 'Home',
    },
    {
      type: 'Adicionar Dieta Gratuita',
      description: 'Visualize as dietas adicionadas por mim gratuitas e adicione novas!',
      icon: <MaterialIcons name="note-add" />,
      screen: 'ManagerMyFreeDiets',
    },
  ];

  const cardDataPersonal = [
    {
      type: 'Adicionar Aluno',
      description: 'Adicione um aluno na comunidade',
      icon: <MaterialIcons name="people" />,
      screen: 'ManangerClients',
    },
    {
      type: 'Treinos a Vencer',
      description: `Quantidade de treinos: ${expiringWorkout}`,
      icon: <MaterialIcons name="fitness-center" />,
      screen: "ExpiringWorkout",
    },
    {
      type: 'Treinos Gratuitos',
      description: `Quantidade de treinos disponíveis: ${quantityFreeWorkout}`,
      icon: <MaterialIcons name="directions-run" />,
      screen: quantityFreeWorkout > 0 ? 'AllFreeWorkout' : 'Home',
    },
    {
      type: 'Adicionar Treino Gratuito',
      description: 'Adicione um treino gratuito para a comunidade',
      icon: <MaterialIcons name="add" />,
      screen: 'ManagerMyFreeTraining',
    },
  ];

  return (
    <Layout navigation={navigation}>
      <Box  flex={1} bg="gray.50" p={4}  >
        
        {(userType === 1) &&
          cardData.map((card, index) => (
            <RetanguleCard
              key={index}
              type={card.type}
              description={card.description}
              icon={card.icon}
              navigation={navigation}
              screen={card.screen || ''}
            />
          ))}
        {(userType === 2) &&
          cardDataPersonal.map((card, index) => (
            <RetanguleCard
              key={index}
              type={card.type}
              description={card.description}
              icon={card.icon}
              screen={card.screen || ''}
              navigation={navigation}
            />
          ))}
        {(userType === 3) &&
          cardDataNutricionista.map((card, index) => (
            <RetanguleCard
              key={index}
              type={card.type}
              description={card.description}
              icon={card.icon}
              screen={card.screen || ''}
              navigation={navigation}
            />
          ))}
      </Box>
    </Layout>
  );
}
