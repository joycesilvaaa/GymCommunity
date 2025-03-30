import { useState } from 'react';
import { Input, Button, View, Text, VStack, HStack } from 'native-base';
import { Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Layout } from '@/components/layout';

type MealOption = {
  id: number;
  name: string;
};

type Meal = {
  type: string;
  options: MealOption[];
  icon: string;
};



export default function CreateDietScreen({ navigation }: any) {
  const [nameDiet, setNameDiet] = useState<string>('');
  const [dietDate, setDietDate] = useState<string>('');
  const [mealType, setMealType] = useState<string>('');
  const [optionName, setOptionName] = useState<string>('');
  const [meals, setMeals] = useState<Meal[]>([]);
  const [description, setDescription] = useState<string>('');
  const [selectedMealIndex, setSelectedMealIndex] = useState<number | null>(null);

  function handleRemoveOption(mealIndex: number, optionId: number) {
    const updatedMeals = meals.map((meal, index) =>
      index === mealIndex
        ? { ...meal, options: meal.options.filter((option) => option.id !== optionId) }
        : meal,
    );

    setMeals(updatedMeals);
  }

  function handleAddMeal() {
    if (!mealType) {
      Alert.alert('Erro', 'O tipo da refeição é obrigatório.');
      return;
    }

    setMeals([...meals, { type: mealType, options: [], icon: '' }]);
    setMealType('');
  }

  function handleAddOption() {
    if (!optionName || selectedMealIndex === null) {
      Alert.alert('Erro', 'O nome da opção e a seleção da refeição são obrigatórios.');
      return;
    }

    const updatedMeals = meals.map((meal, index) =>
      index === selectedMealIndex
        ? { ...meal, options: [...meal.options, { id: Date.now(), name: optionName }] }
        : meal,
    );

    setMeals(updatedMeals);
    setOptionName('');
  }

  function handleRemoveMeal(index: number) {
    setMeals(meals.filter((_, i) => i !== index));
    if (selectedMealIndex === index) setSelectedMealIndex(null);
  }

  function handleSubmit() {
    if (meals.length === 4 || !dietDate) {
      Alert.alert('Erro', 'Adicione uma periodo e pelo menos 4 refeições.');
      return;
    }

    console.log('Dieta criada:', { date: dietDate, meals });
    Alert.alert('Sucesso', 'Dieta criada com sucesso!');
    navigation.goBack();
  }

  return (
    <Layout navigation={navigation}>
      <VStack flex={1} p={4} space={2}>
        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="xl" fontWeight="bold" color="indigo.600">
            Criar Nova Dieta
          </Text>
          {meals.length >= 4 ? (
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

        <Input placeholder="Nome da Dieta" value={nameDiet} onChangeText={setNameDiet} />
        <Input placeholder="Periodo em meses" value={dietDate} onChangeText={setDietDate} />
        <Input
          placeholder="Descrição da Dieta"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />
        {/* Adicionar refeições */}
        <HStack space={1} alignItems="center">
          <Input
            flex={1}
            placeholder="Tipo de Refeição"
            value={mealType}
            onChangeText={setMealType}
          />
          <Button
            onPress={handleAddMeal}
            colorScheme="indigo"
            leftIcon={<MaterialIcons name="add" size={14} color="white" />}
          />
        </HStack>

        {/* Lista de refeições */}
        {meals.map((meal, index) => (
          <HStack key={index} space={1} alignItems="center">
            <Button
              flex={1}
              size={9}
              onPress={() => setSelectedMealIndex(index)}
              backgroundColor={selectedMealIndex === index ? '#D3D3D3' : '#f9f9f9'}
            >
              <Text>{meal.type}</Text>
            </Button>
            {meal.options.length === 0 && (
              <Button backgroundColor="red.500" onPress={() => handleRemoveMeal(index)}>
                <MaterialIcons name="delete" size={15} color="white" />
              </Button>
            )}
          </HStack>
        ))}

        {/* Adicionar opções */}
        <HStack space={1} alignItems="center">
          <Input
            flex={1}
            placeholder="Nome da Opção"
            value={optionName}
            onChangeText={setOptionName}
          />
          <Button
            onPress={handleAddOption}
            colorScheme="indigo"
            leftIcon={<MaterialIcons name="add" size={14} color="white" />}
          />
        </HStack>
        <View height={0.5} bg="gray.200" width="100%" my={4} />
        <Text fontSize="md" fontWeight="bold" color="indigo.600">
          Pré-visualização
        </Text>
        {/* Lista de opções dentro de cada refeição */}
        {meals.map((meal, mealIndex) => (
          <View
            key={mealIndex}
            mt={2}
            p={2}
            borderWidth={1}
            borderColor="gray.200"
            borderRadius={5}
          >
            <Text fontWeight="bold" mb={2}>
              {meal.type}
            </Text>
            {meal.options.map((option) => (
              <HStack key={option.id} justifyContent="space-between" alignItems="center" mb={1}>
                <Text color="gray.600">• {option.name}</Text>
                <Button
                  size="xs"
                  backgroundColor="red.500"
                  onPress={() => handleRemoveOption(mealIndex, option.id)}
                >
                  <MaterialIcons name="delete" size={14} color="white" />
                </Button>
              </HStack>
            ))}
          </View>
        ))}

        {/* Botões */}
        <HStack mt={2} justifyContent="center">
          {meals.length > 4 && (
            <Button onPress={() => navigation.goBack()} variant="outline" colorScheme="indigo">
              Cancelar
            </Button>
          )}
        </HStack>
      </VStack>
    </Layout>
  );
}
