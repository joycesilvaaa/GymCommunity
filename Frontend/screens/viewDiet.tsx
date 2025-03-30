// src/pages/ViewDiet.tsx
import React, { useEffect, useState } from 'react';
import { Box, FlatList, Text } from 'native-base'; // Usando FlatList do NativeBase
import { MealItem } from '@/components/card/mealItem'; // Importando o componente MealItem
import { Layout } from '@/components/layout';
import { Button } from 'native-base'; // Importando o Button e Alert do NativeBase
import { Alert } from 'react-native';
interface Meal {

  name: string;
  options: string[];
}

interface Diet {
  id: string;
  name: string;
  description: string;
  duration: number;
  meals: Meal[]; // As refeições dentro do campo meals
}

interface ViewDietProps {
  navigation: any; // Navegação
  route: any; // Rota da navegação
}

const loadMeals = (): Diet => {
  return {
    id: '1',
    name: 'Dieta Para fortalecimento',
    description: 'Dieta para fortalecimento muscular.',
    duration: 1,
    meals: [
      {  name: 'Café da manhã', options: ['Opção 1', 'Opção 2'],  },
      { name: 'Almoço', options: ['Opção 1', 'Opção 2'],},
      { name: 'Jantar', options: ['Opção 1', 'Opção 2'], },
    ],
  };
};

export function ViewDiet({ navigation, route}: ViewDietProps) {
  const { id } = route.params;
  const previousRoute = navigation.getState()?.routes[navigation.getState().index - 1]?.name;
  const [diet, setDiet] = useState<Diet | null>(null);
  const [typeView, setTypeView] = useState<string>("default");
  useEffect(() => {
    if (previousRoute === "ExpiringDiet") {
      setTypeView('expiring');
    } else {
      setTypeView('default');
    }
  }, [previousRoute]);
  

  useEffect(() => {
    const dietData = loadMeals(); // Carrega os dados da dieta
    setDiet(dietData); // Atualiza o estado com a dieta
  }, [id]);

  const handleFinish = () => {
    Alert.alert(
      "Finalizar Dieta",
      "Você tem certeza que deseja finalizar esta dieta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", onPress: () => console.log("Dieta finalizada!") },
      ]
    );
  };

  if (!diet) {
    return <Text>Carregando...</Text>; // Exibindo um texto de carregamento até a dieta estar pronta
  }

  return (
    <Layout navigation={navigation}>
      <Text fontSize="xl" color="indigo.700" fontWeight="bold" textAlign="center">
        {diet.name}
      </Text>
      <Text fontSize="md" color="gray.600" textAlign="center" mb={4}>
        {diet.description}
      </Text>
      
      <Box flexDirection="row" justifyContent="center" alignItems="center" >
        
      {typeView === "expiring" ?(
        <Button size="sm" colorScheme="indigo" width="40%" onPress={handleFinish}>
        Finalizar
      </Button>
      ):(
        <Button  variant={'outline'}  colorScheme="indigo" width="40%" onPress={() => navigation.goBack()}>
          Voltar
        </Button>
      )}
      </Box>
      
      {diet.meals.map((meal, index) => (
        <MealItem key={index} meal={meal} navigation={navigation}/>
      ))}
    </Layout>
  );
}
