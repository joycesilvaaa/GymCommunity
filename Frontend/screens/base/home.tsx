import { Box } from 'native-base';
import { Layout } from '@/components/layout';
import { RetanguleCard } from '@/components/card/customRetanguleCard';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/auth';
import routes from '@/api/api';
import { dietActualPrevious } from '@/interfaces/diet';
import { WorkoutActualPrevious } from '@/interfaces/workout_plans';
import { NavigationProps } from '@/interfaces/navigation';
import { useEffect, useState } from 'react';
import { formatedDateBr } from '@/utils';
import Loading from '@/components/loading';

export function Home({ navigation }: NavigationProps) {
  const { user } = useAuth() as { user?: { id: number; user_profile: number } };
  const [userType, setUserType] = useState<number>(
    user && user.user_profile ? user.user_profile : 1,
  );
  const [quantityFreeDiets, setQuantityFreeDiets] = useState<number>(0);
  const [quantityFreeWorkout, setQuantityFreeWorkout] = useState<number>(0);
  const [actualDietPrevius, setActualDietPrevius] = useState<dietActualPrevious | null>(null);
  const [actualWorkoutPrevius, setActualWorkoutPrevius] = useState<WorkoutActualPrevious | null>(
    null,
  );
  const [expiringDiet, setExpiringDiet] = useState<number>(0);
  const [expiringWorkout, setExpiringWorkout] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(false);
  }, []);

  async function getquantityFreeDiets() {
    const response = await routes.quantityFreeDiets();
    setQuantityFreeDiets(response.data.data.quantity);
  }
  async function getActualDietPrevius() {
    if (!user?.id) return navigation.navigate('Initial');
    const response = await routes.actualDietPrevious(user.id);
    setActualDietPrevius(response.data.data.length > 0 ? response.data.data[0] : null);
  }
  async function getActualWorkoutPrevius() {
    if (!user?.id) return navigation.navigate('Initial');
    const response = await routes.actualWorkoutPrevious();
    setActualWorkoutPrevius(response.data.data);
  }
  async function getQuantityFreeWorkout() {
    const response = await routes.quantityFreeWorkout();
    setQuantityFreeWorkout(response.data.data.quantity);
  }
  async function getExpiringDiet() {
    if (!user?.id) return navigation.navigate('Initial');
    const response = await routes.expiringDiet();
    setExpiringDiet(response.data.data.length);
  }
  async function getExpiringWorkout() {
    if (!user?.id) return navigation.navigate('Initial');
    const response = await routes.expiringWorkouts();
    setExpiringWorkout(response.data.data.length);
  }

  const cardData = [
    {
      type: 'Dieta Atual',
      description: actualDietPrevius 
        ? `Dia inicial: ${formatedDateBr(actualDietPrevius.start_date)}\nDia final: ${formatedDateBr(actualDietPrevius.end_date)}`
        : 'Sem dieta atual. Clique para criar uma nova dieta',
      icon: <MaterialIcons name="restaurant-menu" />, // alterado de "restaurant"
      screen: actualDietPrevius ? 'ViewDiet' : 'CreateDiet',
      id: actualDietPrevius?.id,
    },
    {
      type: 'Treino Atual',
      description: actualWorkoutPrevius
        ? `Dia inicial: ${formatedDateBr(actualWorkoutPrevius.start_date)}\nDia final: ${formatedDateBr(actualWorkoutPrevius.end_date)}`
        : 'Sem treino atual. Clique para criar um novo treino',
      icon: <MaterialIcons name="sports-gymnastics" />, // alterado de "fitness-center"
      screen:actualWorkoutPrevius? 'ViewWourkout': 'CreateWorkout', 
    },
    {
      type: 'Meu Calendario',
      description:"Visualize seu calendário de treinos e dietas",
      icon: <MaterialIcons name="calendar-today" />, // alterado de "fitness-center"
      screen:"MyCalendar", 
    },
    {
      type: 'Metas',
      description: 'Visualize suas metas',
      icon: <MaterialIcons name="emoji-events" />, // alterado de "flag"
      screen: 'HealthGoals',
    },
    {
      type: 'Lista de Compras',
      description: 'Visualize suas listas de compras',
      icon: <MaterialIcons name="shopping-basket" />, // alterado de "shopping-cart"
      screen: 'ShoppingList',
    },
    {
      type: 'Ranking de Pontos',
      description: 'Visualize o ranking de pontos',
      icon: <MaterialIcons name="star" />, // alterado de "directions-run"
      screen: 'UserPoints',
    },
    {
      type: 'Dietas Gratuitas',
      description: `Quantidade de dietas disponíveis: ${quantityFreeDiets}`,
      icon: <MaterialIcons name="free-breakfast" />, // alterado de "local-dining"
      screen: quantityFreeDiets > 0 ? 'AllFreeDiets' : 'Home',
    },
    {
      type: 'Treinos Gratuitos',
      description: `Quantidade de treinos disponíveis: ${quantityFreeWorkout}`,
      icon: <MaterialIcons name="sports-handball" />, // alterado de "directions-run"
      screen: quantityFreeWorkout > 0 ? 'AllFreeWorkout' : 'Home',
    },
    {
      type: 'Dicas',
      description: 'Visualize dicas de treinos e dietas',
      icon: <MaterialIcons name="lightbulb" />, // alterado de "directions-run"
      screen: "PublicationSuggestion", 
    }
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
    {
      type: 'Dicas',
      description: 'Visualize dicas de treinos e dietas e compartilhe com seus alunos',
      icon: <MaterialIcons name="directions-run" />,
      screen: "PublicationSuggestion", 
    }
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
      screen: 'ExpiringWorkout',
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
    {
      type: 'Dicas',
      description: 'Visualize dicas de treinos e dietas e compartilhe com seus alunos',
      icon: <MaterialIcons name="directions-run" />,
      screen: "PublicationSuggestion", 
    }
  ];

  if (isLoading) {
    return (
      <Layout navigation={navigation}>
        <Loading/>
      </Layout>
    );
  }

  return (
    <Layout navigation={navigation}>
      <Box flex={1} bg="gray.50" p={4}>
        {userType === 1 &&
          cardData.map((card, index) => (
            <RetanguleCard
              key={index}
              type={card.type}
              description={card.description}
              icon={card.icon}
              navigation={navigation}
              screen={card.screen || ''}
              route={card.id ? { params: { id: card.id } } : undefined}
            />
          ))}
        {userType === 2 &&
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
        {userType === 3 &&
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
