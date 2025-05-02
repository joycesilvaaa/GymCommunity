import { useState } from 'react';
import {
  Input,
  Button,
  Text,
  VStack,
  HStack,
  Switch,
  useTheme,
  Badge,
  IconButton,
  TextArea,
  Select,
  useToast,
} from 'native-base';
import { Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Layout } from '@/components/layout';
import { NavigationProps } from '@/interfaces/navigation';
import { CreateTraining, TrainingPlan } from '@/interfaces/workout_plans';
import routes from '@/api/api';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateTrainingScreen({ navigation, route }: NavigationProps) {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState('');
  const [trainingType, setTrainingType] = useState('');
  const [planTitle, setPlanTitle] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [repetitions, setRepetitions] = useState('');
  const [restTime, setRestTime] = useState('');
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [monthsValid, setMonthsValid] = useState('');
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const toast = useToast();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const lastScreen = navigation.getState().routes[navigation.getState().index - 1].name;
  const { id } = route.params || { id: null };

  function handleAddPlan() {
    if (!planTitle.trim()) {
      Alert.alert('Erro', 'O título do plano de treino é obrigatório');
      return;
    }
    setPlans([...plans, { title: planTitle, exercises: [] }]);
    setPlanTitle('');
  }

  function handleAddExercise() {
    if (!exerciseName.trim() || !repetitions.trim() || !restTime.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos do exercício');
      return;
    }

    const newExercise = {
      name: exerciseName,
      repetitions: repetitions,
      rest_time: Number(restTime),
    };

    const updatedPlans = [...plans];
    updatedPlans[selectedPlanIndex!].exercises.push(newExercise);
    setPlans(updatedPlans);

    setExerciseName('');
    setRepetitions('');
    setRestTime('');
  }

  function handleRemoveExercise(planIndex: number, exerciseIndex: number) {
    const updatedPlans = [...plans];
    updatedPlans[planIndex].exercises.splice(exerciseIndex, 1);
    setPlans(updatedPlans);
  }

  function handleRemovePlan(index: number) {
    setPlans(plans.filter((_, i) => i !== index));
    if (selectedPlanIndex === index) setSelectedPlanIndex(null);
  }

  async function handleSubmit() {
    if (plans.length === 0 || plans.some((plan) => plan.exercises.length === 0)) {
      Alert.alert('Erro', 'Adicione pelo menos um plano de treino com exercícios');
      return;
    }

    const newTraining: CreateTraining = {
      title,
      description,
      type: trainingType,
      days_per_week: Number(daysPerWeek),
      is_public: isPublic,
      plans,
      months_valid: Number(monthsValid),
    };
    if (lastScreen === 'UserProfile') {
      if (!startDate) {
        Alert.alert('Erro', 'Selecione uma data de início válida');
        return;
      }
      newTraining.user_id = id;
      newTraining.start_date = startDate.toISOString().split('T')[0];
    }
    try {
      const response = await routes.createTraining(newTraining);
      if (response.status !== 200) {
        toast.show({
          title: 'Erro',
          description: response.data.detail,
          bg: 'red.500',
        });
        return;
      }
    } catch (error) {
      console.error('Erro ao criar treino:', error);
      Alert.alert('Erro', 'Não foi possível criar o treino. Tente novamente mais tarde.');
      return;
    }
  }

  function onDateChange(event: any, selectedDate?: Date) {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(false);
    setStartDate(currentDate);
  }
  function showDatePickerDialog() {
    setShowDatePicker(true);
  }
  return (
    <Layout navigation={navigation}>
      <VStack flex={1} p={4} space={4} bg="white">
        <HStack justifyContent="space-between" alignItems="center" mb={4}>
          <Text fontSize="2xl" fontWeight="bold" color="coolGray.800">
            Criar Novo Treino
          </Text>
          <Button
            onPress={handleSubmit}
            colorScheme="indigo"
            leftIcon={<MaterialIcons name="save-alt" size={20} color="white" />}
            isDisabled={plans.length === 0}
          >
            SALVAR
          </Button>
        </HStack>

        <VStack space={2}>
          <Text fontSize="lg" fontWeight="semibold" color="coolGray.700">
            Configurações Básicas
          </Text>
          <Input
            placeholder="Título do Programa"
            value={title}
            variant="filled"
            onChangeText={setTitle}
            bg="coolGray.100"
            borderRadius="md"
          />

          <Input
            placeholder="Descrição do Programa"
            value={description}
            variant="filled"
            onChangeText={setDescription}
            bg="coolGray.100"
            borderRadius="md"
          />

          <HStack space={3}>
            <Input
              flex={1}
              variant="filled"
              placeholder="Dias por Semana"
              value={daysPerWeek}
              onChangeText={setDaysPerWeek}
              bg="coolGray.100"
              borderRadius="md"
              keyboardType="numeric"
            />
            <Input
              flex={1}
              variant="filled"
              placeholder="Validade"
              value={monthsValid}
              onChangeText={setMonthsValid}
              bg="coolGray.100"
              borderRadius="md"
              keyboardType="numeric"
            />
          </HStack>

          <VStack space={2}>
            {lastScreen === 'UserProfile' && (
              <>
                <VStack>
                  <Input
                    placeholder="Data de Início"
                    variant="filled"
                    bg="coolGray.100"
                    borderRadius="md"
                    fontSize="sm"
                    value={startDate ? startDate.toLocaleDateString() : ''}
                    onFocus={showDatePickerDialog}
                  />
                  {showDatePicker && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={startDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={onDateChange}
                    />
                  )}
                </VStack>
                <VStack bg="coolGray.100" px={3} py={1} borderRadius="md">
                  <HStack alignItems="center" justifyContent="space-between">
                    <Text color="coolGray.600">Público</Text>
                    <Switch
                      isChecked={lastScreen === 'UserProfile' ? false : isPublic}
                      isDisabled={lastScreen === 'UserProfile'}
                      onToggle={setIsPublic}
                      colorScheme="indigo"
                    />
                  </HStack>
                </VStack>
              </>
            )}
          </VStack>
        </VStack>
        <VStack space={2}>
          <Text fontSize="sm" color="coolGray.600" mb={1}>
            Tipo de Treino
          </Text>
          <Select
            selectedValue={trainingType}
            onValueChange={setTrainingType}
            placeholder="Selecione o tipo de treino"
            variant="filled"
            bg="coolGray.100"
            borderRadius="md"
          >
            <Select.Item label="Musculação" value="musculação" />
            <Select.Item label="Funcional" value="funcional" />
            <Select.Item label="Aeróbico" value="aeróbico" />
            <Select.Item label="HIIT" value="hiit" />
            <Select.Item label="Crossfit" value="crossfit" />
            <Select.Item label="Pilates" value="pilates" />
            <Select.Item label="Yoga" value="yoga" />
            <Select.Item label="Alongamento" value="alongamento" />
            <Select.Item label="Velocidade" value="velocidade" />
            <Select.Item label="Agilidade" value="agilidade" />
            <Select.Item label="Equilíbrio" value="equilíbrio" />
            <Select.Item label="Coordenação" value="coordenação" />
          </Select>
        </VStack>

        <VStack space={4}>
          <Text fontSize="lg" fontWeight="semibold" color="coolGray.700">
            Planos de Treino
          </Text>

          <HStack space={2} alignItems="center">
            <Input
              flex={1}
              placeholder="Adicionar novo plano (ex: Treino A)"
              variant="filled"
              value={planTitle}
              onChangeText={setPlanTitle}
              bg="coolGray.100"
              borderRadius="md"
              leftElement={
                <MaterialIcons
                  name="fitness-center"
                  size={18}
                  color={colors.coolGray[400]}
                  style={{ marginLeft: 12 }}
                />
              }
            />
            <Button
              onPress={handleAddPlan}
              colorScheme="indigo"
              leftIcon={<MaterialIcons name="add" size={14} color="white" />}
            />
          </HStack>

          {plans.map((plan, planIndex) => (
            <VStack key={planIndex} space={2} bg="white" p={3} borderRadius="md" shadow={1}>
              <HStack alignItems="center" space={2}>
                <Button
                  flex={1}
                  variant="ghost"
                  bg={selectedPlanIndex === planIndex ? 'indigo.50' : 'coolGray.50'}
                  borderWidth={1}
                  borderColor="coolGray.200"
                  borderRadius="md"
                  _text={{ color: 'coolGray.700', fontWeight: 'medium' }}
                  onPress={() => setSelectedPlanIndex(planIndex)}
                  leftIcon={
                    <MaterialIcons name="fitness-center" size={14} color={colors.indigo[600]} />
                  }
                >
                  {plan.title}
                </Button>
                <IconButton
                  icon={<MaterialIcons name="delete" size={18} color={colors.red[600]} />}
                  onPress={() => handleRemovePlan(planIndex)}
                />
              </HStack>

              {selectedPlanIndex === planIndex && (
                <VStack space={3} mt={2}>
                  <HStack space={2}>
                    <Input
                      variant="filled"
                      flex={1}
                      placeholder="Nome do exercício"
                      value={exerciseName}
                      onChangeText={setExerciseName}
                      bg="coolGray.50"
                      borderRadius="md"
                    />
                    <Input
                      flex={1}
                      variant="filled"
                      placeholder="Repetições"
                      value={repetitions}
                      onChangeText={setRepetitions}
                      bg="coolGray.50"
                      borderRadius="md"
                    />
                    <Input
                      flex={1}
                      variant="filled"
                      placeholder="Intervalo"
                      value={restTime}
                      onChangeText={setRestTime}
                      bg="coolGray.50"
                      borderRadius="md"
                      keyboardType="numeric"
                    />
                  </HStack>
                  <Button
                    onPress={handleAddExercise}
                    colorScheme="indigo"
                    leftIcon={<MaterialIcons name="add-circle" size={16} color="white" />}
                  >
                    Adicionar Exercício
                  </Button>

                  {plan.exercises.map((exercise, exerciseIndex) => (
                    <HStack
                      key={exerciseIndex}
                      alignItems="center"
                      justifyContent="space-between"
                      bg="coolGray.50"
                      p={2}
                      borderRadius="md"
                    >
                      <HStack space={2} alignItems="center">
                        <MaterialIcons name="directions-run" size={14} color={colors.indigo[600]} />
                        <Text color="coolGray.700">
                          {exercise.name} - {exercise.repetitions} reps / {exercise.rest_time}{' '}
                          minutos
                        </Text>
                      </HStack>
                      <IconButton
                        icon={<MaterialIcons name="close" size={16} color={colors.red[600]} />}
                        onPress={() => handleRemoveExercise(planIndex, exerciseIndex)}
                      />
                    </HStack>
                  ))}
                </VStack>
              )}
            </VStack>
          ))}
          {plans.length === 0 && (
            <VStack alignItems="center" p={4} space={2}>
              <MaterialIcons name="fitness-center" size={40} color={colors.coolGray[300]} />
              <Text color="coolGray.400" textAlign="center">
                Comece adicionando seu primeiro plano de treino
              </Text>
            </VStack>
          )}
        </VStack>
      </VStack>
    </Layout>
  );
}
