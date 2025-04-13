import { NavigationProp } from '@react-navigation/native';
import { Button, View, Text, VStack, HStack, Input } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Layout } from '@/components/layout';
import { useAuth } from '@/hooks/auth';
import routes from '@/api/api';
import { api } from '@/api/config';
import { IShoppingList } from '@/interfaces/shoppingList';

type ShoppingListProps = {
  navigation: NavigationProp<any>;
};

type Diet = {
  id: number;
  menu: {
    title: string;
    options: {
      name: string;
      quantity: number;
    }[];
  }[];
  title: string;
  description: string;
  start_date: string;
  end_date: string;
};



export function ShoppingList({ navigation }: ShoppingListProps) {
  const context = useAuth();
  const user = context.user?.id ? context.user : { id: 1, user_profile: 1 };

  const [nameDiet, setNameDiet] = useState<string>('');
  const [options, setOptions] = useState<{ name: string; quantity: string }[]>([]);
  const [showMeals, setShowMeals] = useState<boolean>(false);
  const [optionName, setOptionName] = useState<string>('');
  const [optionQuantity, setOptionQuantity] = useState<string>('');

  const [dietAtual, setDietAtual] = useState<Diet | null>(null);

  function addOptions() {
    if (!optionName || !optionQuantity) {
      Alert.alert('Erro', 'Preencha o nome do alimento e a quantidade.');
      return;
    }

    setOptions((prevOptions) => [...prevOptions, { name: optionName, quantity: optionQuantity }]);
    setOptionName('');
    setOptionQuantity('');
  }

  async function handleSubmit() {
    if (options.length < 4) {
      Alert.alert('Erro', 'Adicione pelo menos 4 alimentos à lista.');
      return;
    }
    const newShoppingList: IShoppingList = {
      title: nameDiet,
      options: options,
      ...(dietAtual?.id && { diet_id: dietAtual.id }),
    };
    console.log(newShoppingList);
    try {
      await routes.createShoppingList(newShoppingList);
      console.log(newShoppingList);
      Alert.alert('Sucesso', 'Lista de compras criada com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao criar lista de compras:', error);
      Alert.alert('Erro', 'Não foi possível criar a lista de compras.');
    }
  }
  useEffect(() => {
    async function fetchShoppingList() {
      try {
        const response = await routes.dietActual(user.id);
        setDietAtual( response.data.data.length > 0 ? response.data.data[0] : null);
      } catch (error) {
        console.error('Erro ao buscar lista de compras:', error);
      }
    }

    fetchShoppingList();
  }, []);

  return (
    <Layout navigation={navigation}>
      <VStack flex={1} p={4} space={2}>
        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="xl" fontWeight="bold" color="indigo.600">
            Criar Lista de Compras
          </Text>
          {options.length >= 1 ? (
            <Button
              onPress={handleSubmit}
              size="sm"
              colorScheme="indigo"
              leftIcon={<MaterialIcons name="check" size={16} color="white" />}
            >
              Finalizar
            </Button>
          ) : (
            <Button onPress={() => navigation.goBack()} variant="outline" colorScheme="indigo">
              Cancelar
            </Button>
          )}
        </HStack>

        {dietAtual && (
          <Button onPress={() => setShowMeals(!showMeals)} variant="outline" colorScheme="indigo" mt={1}>
            {showMeals ? 'Fechar' : 'Visualizar Dieta Atual'}
          </Button>
        )}

        {showMeals && dietAtual && (
          <View mt={2} p={2} borderWidth={1} borderColor="gray.300" borderRadius={5}>
            <Text fontWeight="bold" mb={2}>{dietAtual.title}</Text>
            <Text color="gray.600" mb={2}>{dietAtual.description}</Text>
            {dietAtual.menu.map((menuOption, index) => (
              <View key={index} mb={2}>
                <Text fontWeight="bold" mb={1}>{menuOption.title}</Text>
                {menuOption.options.map((option, idx) => (
                  <Text key={idx} color="gray.600">
                    • {option.name} - {option.quantity}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}
        <VStack mt={4} space={2}>
        <Input
          placeholder="Digite o nome da lista de compras"
          value={nameDiet}
          onChangeText={setNameDiet}
          mt={4}
        />
          <Input placeholder="Digite o nome do alimento" value={optionName} onChangeText={setOptionName} />
          <Input placeholder="Digite a quantidade" keyboardType="numeric" value={optionQuantity} onChangeText={setOptionQuantity} />
          <Button onPress={addOptions} colorScheme="indigo" leftIcon={<MaterialIcons name="add" size={16} color="white" />}>
            Adicionar Alimento
          </Button>
        </VStack>

        {options.length > 0 && (
          <View mt={4} p={2} borderWidth={1} borderColor="gray.300" borderRadius={5}>
            <HStack justifyContent="space-between" alignItems="center">
              <Text fontSize="md" fontWeight="bold" color="indigo.600">
                Pré visualização
              </Text>
                <Button onPress={() => setOptions([])} size="sm" variant="outline" colorScheme="indigo" mt={1} px={3}>
                  Limpar Lista
                </Button>
            </HStack>
            {options.map((option, index) => (
              <HStack key={index} justifyContent="space-between" alignItems="center" mt={2}>
                <Text color="gray.600">• {option.name} - {option.quantity}</Text>
                <Button  colorScheme="red"   size="sm" onPress={() => setOptions(options.filter((_, i) => i !== index))}>
                  <MaterialIcons name="delete" size={16} color="white" />
                </Button>
              </HStack>
            ))}
          </View>
        )}
      </VStack>
    </Layout>
  );
}