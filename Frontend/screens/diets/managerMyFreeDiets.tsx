import { FormCreate } from '@/components/forms/formCreate';
import { NavigationProp } from '@react-navigation/native';
import { Button, View, Text, Icon, Center, VStack } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Layout } from '@/components/layout';
import { Input } from 'native-base';
import { ItemCard } from '@/components/card/customItemCard';
import { useEffect, useState } from 'react';
import routes from '@/api/api';
import { DietsByProfissional } from '@/interfaces/diet';
interface MenuProps {
  navigation: NavigationProp<any>;
}

export function FreeDiets({ navigation }: MenuProps) {
  const [diets, setDiets] = useState<DietsByProfissional[]>([]);

  useEffect(() => {
    getDietsFreeByProfissional();
  }, []);

  async function getDietsFreeByProfissional() {
    try {
      const response = await routes.freeDietsByProfissional();
      setDiets(response.data.data);
    } catch (error) {
      console.error('Error fetching diets:', error);
    }
  }

  return (
    <Layout navigation={navigation}>
      <View flex={1} margin={4} padding={1}>
        <View flexDirection="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Text fontSize="xl" color="indigo.700" fontWeight="bold" textAlign="center">
            Dietas
          </Text>
          {diets.length > 0 && (
            <Button onPress={() => navigation.navigate('CreateDiet')} colorScheme="indigo">
              Criar Dieta
            </Button>
          )}
        </View>
        {diets.length > 0 ? (
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
        ) : (
          <Center flex={1}>
            <VStack space={4} alignItems="center">
              <Icon as={MaterialIcons} name="sentiment-dissatisfied" size="xl" color="gray.400" />
              <Text fontSize="md" color="gray.500" textAlign="center">
                Nenhuma dieta criada pelo profissional ainda. Que tal começar agora?
              </Text>
              <Button onPress={() => navigation.navigate('CreateDiet')} colorScheme="indigo">
                Criar Primeira Dieta
              </Button>
            </VStack>
          </Center>
        )}
      </View>
    </Layout>
  );
}
