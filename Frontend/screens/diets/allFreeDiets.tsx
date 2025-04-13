import { FormCreate } from '@/components/forms/formCreate';
import { NavigationProp } from '@react-navigation/native';
import { Button, View, Text, Icon, Center, VStack, Spinner } from 'native-base';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Layout } from '@/components/layout';
import { Input } from 'native-base';
import { ItemCard } from '@/components/card/customItemCard';
import { useState } from 'react';
import { CustomComponentProps } from 'native-base/lib/typescript/components/types';
import { NavigationProps } from '@/interfaces/navigation';
import { IAllFreeDiets } from '@/interfaces/diet';
import routes from '@/api/api';
import { useEffect } from 'react';
import { Alert } from 'react-native';

export function AllFreeDiets({ navigation }: NavigationProps) {
  const [diets, setDiets] = useState<IAllFreeDiets[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getDietsFreeByProfissional();
  }, []);

  async function getDietsFreeByProfissional() {
    try {
      const response = await routes.allFreeDiets();
      setDiets(response.data.data);
      setRefreshing(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching diets:', error);
    }
  }

  if (isLoading) {
    return (
      <Layout navigation={navigation}>
        <VStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="lg" color="indigo.600" />
          <Text mt={4} color="coolGray.600">
            Carregando dietas...
          </Text>
        </VStack>
      </Layout>
    );
  }
  return (
    <Layout navigation={navigation}>
      <View flex={1} margin={4} padding={1}>
        <View flexDirection="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Text fontSize="22" color="indigo.700" fontWeight="bold" textAlign="center">
            Dietas Gratuitas
          </Text>
        </View>
        {diets.length === 0 ? (
          <View flex={1} justifyContent="center" alignItems="center">
            <Icon as={MaterialCommunityIcons} name="food-off" size={20} color="gray.300" mb={3} />
            <Text fontSize="2xl" color="gray.400" fontWeight="bold" textAlign="center" mb={2}>
              Nenhuma dieta gratuita disponível
            </Text>
            <Text fontSize="md" color="gray.300" textAlign="center">
              No momento, não há dietas gratuitas cadastradas no sistema. Por favor, volte mais
              tarde!
            </Text>
          </View>
        ) : (
          diets.map((diet) => (
            <ItemCard
              key={diet.id}
              title={diet.title}
              description={diet.description}
              navigation={navigation}
              screen="ViewDiet"
              id={diet.id.toString()}
              iconName="restaurant"
            />
          ))
        )}
      </View>
    </Layout>
  );
}
