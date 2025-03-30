import { useState } from 'react';
import { Input, Button, View, Text, VStack, HStack } from 'native-base';
import { Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Layout } from '@/components/layout';

type ExerciseOption = {
  id: number;
  name: string;
};

type Exercise = {
  type: string;
  options: ExerciseOption[];
  icon: string;
};

type Training = {
  date: string;
  exercises: Exercise[];
};

export default function CreateTraining({ navigation }: any) {
  const [trainingDate, setTrainingDate] = useState<string>('');
  const [exerciseType, setExerciseType] = useState<string>('');
  const [optionName, setOptionName] = useState<string>('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number | null>(null);

  function handleRemoveOption(exerciseIndex: number, optionId: number) {
    const updatedExercises = exercises.map((exercise, index) =>
      index === exerciseIndex
        ? { ...exercise, options: exercise.options.filter((option) => option.id !== optionId) }
        : exercise,
    );

    setExercises(updatedExercises);
  }

  function handleAddExercise() {
    if (!exerciseType) {
      Alert.alert('Erro', 'O tipo do exercício é obrigatório.');
      return;
    }

    setExercises([...exercises, { type: exerciseType, options: [], icon: '' }]);
    setExerciseType('');
  }

  function handleAddOption() {
    if (!optionName || selectedExerciseIndex === null) {
      Alert.alert('Erro', 'O nome da opção e a seleção do exercício são obrigatórios.');
      return;
    }

    const updatedExercises = exercises.map((exercise, index) =>
      index === selectedExerciseIndex
        ? { ...exercise, options: [...exercise.options, { id: Date.now(), name: optionName }] }
        : exercise,
    );

    setExercises(updatedExercises);
    setOptionName('');
  }

  function handleRemoveExercise(index: number) {
    setExercises(exercises.filter((_, i) => i !== index));
    if (selectedExerciseIndex === index) setSelectedExerciseIndex(null);
  }

  function handleSubmit() {
    if (exercises.length < 4 || !trainingDate) {
      Alert.alert('Erro', 'Adicione uma data e pelo menos 4 exercícios.');
      return;
    }

    console.log('Treino criado:', { date: trainingDate, exercises });
    Alert.alert('Sucesso', 'Treino criado com sucesso!');
    navigation.goBack();
  }

  return (
    <Layout navigation={navigation}>
      <VStack flex={1} p={4} space={2}>
        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="xl" fontWeight="bold" color="indigo.600">
            Criar Novo Treino
          </Text>
          {exercises.length >= 4 ? (
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

        <Input placeholder="Data do Treino" value={trainingDate} onChangeText={setTrainingDate} />
        <HStack space={1} alignItems="center">
          <Input
            flex={1}
            placeholder="Tipo de Exercício"
            value={exerciseType}
            onChangeText={setExerciseType}
          />
          <Button
            onPress={handleAddExercise}
            colorScheme="indigo"
            leftIcon={<MaterialIcons name="add" size={14} color="white" />}
          />
        </HStack>

        {exercises.map((exercise, index) => (
          <HStack key={index} space={1} alignItems="center">
            <Button
              flex={1}
              size={9}
              onPress={() => setSelectedExerciseIndex(index)}
              backgroundColor={selectedExerciseIndex === index ? '#D3D3D3' : '#f9f9f9'}
            >
              <Text>{exercise.type}</Text>
            </Button>
            {exercise.options.length === 0 && (
              <Button backgroundColor="red.500" onPress={() => handleRemoveExercise(index)}>
                <MaterialIcons name="delete" size={15} color="white" />
              </Button>
            )}
          </HStack>
        ))}

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
      </VStack>
    </Layout>
  );
}
