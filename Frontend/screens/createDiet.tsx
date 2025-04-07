import { useState } from 'react';
import { Input, Button, Text, VStack, HStack, Switch, useTheme, Center } from 'native-base';
import { Alert, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Layout } from '@/components/layout';
import routes from '@/api/api';
import { CreateDiet, Meal, OptionType } from '@/interfaces/diet';

export default function CreateDietScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [nameDiet, setNameDiet] = useState('');
  const [dietDate, setDietDate] = useState('');
  const [mealType, setMealType] = useState('');
  const [optionName, setOptionName] = useState('');
  const [optionQuantity, setOptionQuantity] = useState('');
  const [optionType, setOptionType] = useState<OptionType>('unidade');
  const [meals, setMeals] = useState<Meal[]>([]);
  const [description, setDescription] = useState('');
  const [selectedMealIndex, setSelectedMealIndex] = useState<number | null>(null);
  const [isPublic, setIsPublic] = useState(false);

  function handleRemoveOption(mealIndex: number, optionName: string) {
    setMeals((prevMeals) =>
      prevMeals.map((meal, index) =>
        index === mealIndex
          ? { ...meal, options: meal.options.filter((option) => option.name !== optionName) }
          : meal,
      ),
    );
  }

  function handleAddMeal() {
    if (!mealType.trim()) {
      Alert.alert('Erro', 'O tipo da refeição é obrigatório.');
      return;
    }
    setMeals((prevMeals) => [...prevMeals, { title: mealType, options: [] }]);
    setMealType('');
  }

  function handleAddOption() {
    if (!optionName.trim() || !optionQuantity.trim() || selectedMealIndex === null) {
      Alert.alert('Erro', 'O nome da opção, quantidade e a seleção da refeição são obrigatórios.');
      return;
    }

    const quantity = parseFloat(optionQuantity);
    if (isNaN(quantity) || quantity < 0) {
      Alert.alert('Erro', 'A quantidade deve ser um número positivo.');
      return;
    }

    setMeals((prevMeals) =>
      prevMeals.map((meal, index) =>
        index === selectedMealIndex
          ? {
              ...meal,
              options: [...meal.options, { name: optionName, quantity, type: optionType }],
            }
          : meal,
      ),
    );
    setOptionName('');
    setOptionQuantity('');
    setOptionType('unidade');
  }

  function handleRemoveMeal(index: number) {
    setMeals((prevMeals) => prevMeals.filter((_, i) => i !== index));
    if (selectedMealIndex === index) setSelectedMealIndex(null);
  }

  function handleSubmit() {
    if (meals.length < 4 || !dietDate.trim()) {
      Alert.alert('Erro', 'Adicione um período e pelo menos 4 refeições.');
      return;
    }

    const monthsValid = parseInt(dietDate, 10);
    if (isNaN(monthsValid) || monthsValid <= 0) {
      Alert.alert('Erro', 'O período deve ser um número positivo.');
      return;
    }

    const newDiet: CreateDiet = {
      title: nameDiet,
      description,
      menu: meals.map((meal) => ({
        title: meal.title,
        options: meal.options.map((option) => ({
          name: option.name,
          quantity: option.quantity,
          type: option.type,
        })),
      })),
      is_public: isPublic,
      months_valid: monthsValid,
    };

    routes.createDiet(newDiet);
    console.log('Dieta criada:', newDiet);
    Alert.alert('Sucesso', 'Dieta criada com sucesso!');
    navigation.goBack();
  }

  return (
    <Layout navigation={navigation}>
      <VStack flex={1} p={4} space={4} bg="white">
        <HStack justifyContent="space-between" alignItems="center" mb={4}>
          <Text fontSize="2xl" fontWeight="bold" color="coolGray.800">
            Criar Nova Dieta
          </Text>
          <Button
            onPress={handleSubmit}
            colorScheme="indigo"
            shadow={2}
            _text={{ fontWeight: 'bold', fontSize: 'md' }}
            leftIcon={<MaterialIcons name="save-alt" size={20} color="white" />}
            isDisabled={meals.length < 4}
            opacity={meals.length < 4 ? 0.6 : 1}
          >
            SALVAR
          </Button>
        </HStack>

        <VStack space={4}>
          <Text fontSize="lg" fontWeight="semibold" color="coolGray.700">
            Configurações Básicas
          </Text>

          <Input
            placeholder="Nome da Dieta"
            variant="filled"
            bg="coolGray.100"
            borderRadius="md"
            fontSize="sm"
            value={nameDiet}
            onChangeText={setNameDiet}
          />

          <Input
            placeholder="Descrição da Dieta"
            variant="filled"
            bg="coolGray.100"
            borderRadius="md"
            fontSize="sm"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </VStack>

        <VStack space={4}>
          <Text fontSize="lg" fontWeight="semibold" color="coolGray.700">
            Período e Visibilidade
          </Text>

          <HStack space={3}>
            <Input
              flex={1}
              placeholder="Duração (meses)"
              variant="filled"
              bg="coolGray.100"
              borderRadius="md"
              keyboardType="numeric"
              fontSize={'sm'}
              value={dietDate}
              onChangeText={setDietDate}
            />

            <HStack alignItems="center" space={2} bg="coolGray.100" px={3} borderRadius="md">
              <Text color="coolGray.600">Pública</Text>
              <Switch
                size="sm"
                onTrackColor="indigo.400"
                isChecked={isPublic}
                onToggle={setIsPublic}
              />
            </HStack>
          </HStack>
        </VStack>
        <VStack space={4}>
          <Text fontSize="lg" fontWeight="semibold" color="coolGray.700">
            Refeições
          </Text>

          <HStack space={2} alignItems="center" h={10}>
            <Input
              flex={1}
              placeholder="Adicionar nova refeição"
              variant="filled"
              bg="coolGray.100"
              borderRadius="md"
              value={mealType}
              fontSize={'sm'}
              onChangeText={setMealType}
              leftElement={
                <MaterialIcons
                  name="restaurant"
                  size={18}
                  color={colors.coolGray[400]}
                  style={{ marginLeft: 12 }}
                />
              }
              h="100%"
            />
            <Button
              onPress={handleAddMeal}
              colorScheme="indigo"
              borderRadius="md"
              leftIcon={<MaterialIcons name="add" size={14} color="white" />}
              h="100%"
            ></Button>
          </HStack>

          {meals.length === 0 && (
            <VStack alignItems="center" p={4} space={2}>
              <MaterialIcons name="no-meals" size={40} color={colors.coolGray[300]} />
              <Text color="coolGray.400" textAlign="center">
                Comece adicionando sua primeira refeição{'\n'}
                usando o formulário acima
              </Text>
            </VStack>
          )}

          {meals.map((meal, index) => (
            <VStack key={index} space={2} bg="white" p={3} borderRadius="md" shadow={1}>
              <HStack alignItems="center" space={2}>
                <Button
                  flex={1}
                  variant="ghost"
                  bg={selectedMealIndex === index ? 'indigo.50' : 'coolGray.50'}
                  borderWidth={1}
                  borderColor="coolGray.200"
                  borderRadius="md"
                  _text={{ color: 'coolGray.700', fontWeight: 'medium' }}
                  onPress={() => setSelectedMealIndex(index)}
                  leftIcon={
                    <MaterialIcons name="restaurant" size={14} color={colors.indigo[600]} />
                  }
                >
                  {meal.title || 'Nova Refeição'}
                </Button>
                <Button variant="ghost" p={2} onPress={() => handleRemoveMeal(index)}>
                  <MaterialIcons name="delete" size={18} color={colors.red[600]} />
                </Button>
              </HStack>

              {selectedMealIndex === index && (
                <VStack space={3} mt={2}>
                  <HStack space={2}>
                    <Input
                      flex={2}
                      placeholder="Nome do alimento"
                      variant="filled"
                      bg="coolGray.50"
                      borderRadius="md"
                      value={optionName}
                      onChangeText={setOptionName}
                    />
                    <Input
                      flex={1}
                      placeholder="Qtd."
                      variant="filled"
                      bg="coolGray.50"
                      borderRadius="md"
                      value={optionQuantity}
                      onChangeText={setOptionQuantity}
                      keyboardType="decimal-pad"
                    />
                    <Button
                      colorScheme="indigo"
                      onPress={handleAddOption}
                      borderRadius="md"
                      leftIcon={<MaterialIcons name="add-circle" size={16} color="white" />}
                    >
                      Add
                    </Button>
                  </HStack>

                  <HStack space={2} justifyContent="center">
                    {['unidade', 'gramas', 'quilos', 'livre'].map((type) => (
                      <Button
                        key={type}
                        variant={optionType === type ? 'solid' : 'outline'}
                        colorScheme="indigo"
                        size="sm"
                        flex={1}
                        borderRadius="md"
                        onPress={() => setOptionType(type as OptionType)}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Button>
                    ))}
                  </HStack>
                </VStack>
              )}

              {meal.options.length > 0 && (
                <VStack space={2} mt={2}>
                  {meal.options.map((option, idx) => (
                    <HStack
                      key={idx}
                      alignItems="center"
                      justifyContent="space-between"
                      bg="coolGray.50"
                      p={2}
                      borderRadius="md"
                    >
                      <HStack space={2} alignItems="center">
                        <MaterialIcons name="fastfood" size={14} color={colors.indigo[600]} />
                        <Text color="coolGray.700">
                          {option.name} - {option.quantity} {option.type}
                        </Text>
                      </HStack>
                      <Button
                        variant="ghost"
                        p={1}
                        onPress={() => handleRemoveOption(index, option.name)}
                      >
                        <MaterialIcons name="close" size={16} color={colors.red[600]} />
                      </Button>
                    </HStack>
                  ))}
                </VStack>
              )}
            </VStack>
          ))}
        </VStack>
      </VStack>
    </Layout>
  );
}
