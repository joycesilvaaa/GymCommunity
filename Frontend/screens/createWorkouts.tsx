import { useState } from 'react';
import { Input, Button, View, Text, VStack, HStack } from 'native-base';
import { Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Layout } from '@/components/layout';

interface ICreateTraining {
  plan: { title: string, exercises: { name: string, repetitions: number, duration: number }[] }[]
  is_public: boolean
  days_per_week: number
  title: string
  description: string
}

export default function CreateTraining({ navigation }: any) {
  const [trainingDate, setTrainingDate] = useState<string>('');
  const [exerciseName, setExerciseName] = useState<string>('');
  const [repetitions, setRepetitions] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [exercises, setExercises] = useState<{ name: string, repetitions: number, duration: number }[]>([]);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number | null>(null);

  // Função para adicionar um novo exercício ao plano
  function handleAddExercise() {
    if (!exerciseName || repetitions <= 0 || duration <= 0) {
      Alert.alert('Erro', 'Todos os campos de exercício são obrigatórios.');
      return;
    }

    setExercises([
      ...exercises,
      { name: exerciseName, repetitions, duration }
    ]);
    setExerciseName('');
    setRepetitions(0);
    setDuration(0);
  }

  // Função para remover um exercício
  function handleRemoveExercise(index: number) {
    setExercises(exercises.filter((_, i) => i !== index));
    if (selectedExerciseIndex === index) setSelectedExerciseIndex(null);
  }

  // Função para enviar o formulário de treinamento
  function handleSubmit() {
    if (exercises.length < 4 || !trainingDate) {
      Alert.alert('Erro', 'Adicione uma data e pelo menos 4 exercícios.');
      return;
    }

    const newTraining: ICreateTraining = {
      plan: [{ title: 'Plano de Treinamento', exercises }],
      is_public: true, // Ajuste conforme necessário
      days_per_week: 5, // Ajuste conforme necessário
      title: 'Novo Treinamento',
      description: 'Descrição do Treinamento'
    };

    console.log('Treinamento criado:', newTraining);
    Alert.alert('Sucesso', 'Treinamento criado com sucesso!');
    navigation.goBack();
  }

  return (
    <Layout navigation={navigation}>
      <VStack flex={1} p={4} space={2}>
        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="xl" fontWeight="bold" color="indigo.600">
            Criar Novo Treinamento
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

        <Input placeholder="Data do Treinamento" value={trainingDate} onChangeText={setTrainingDate} />

        <HStack space={1} alignItems="center">
          <Input
            flex={1}
            placeholder="Nome do Exercício"
            value={exerciseName}
            onChangeText={setExerciseName}
          />
          <Input
            flex={1}
            keyboardType="numeric"
            placeholder="Repetições"
            value={String(repetitions)}
            onChangeText={(text) => setRepetitions(Number(text))}
          />
          <Input
            flex={1}
            keyboardType="numeric"
            placeholder="Duração (em segundos)"
            value={String(duration)}
            onChangeText={(text) => setDuration(Number(text))}
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
              <Text>{exercise.name}</Text>
            </Button>
            <Button backgroundColor="red.500" onPress={() => handleRemoveExercise(index)}>
              <MaterialIcons name="delete" size={15} color="white" />
            </Button>
          </HStack>
        ))}
      </VStack>
    </Layout>
  );
}
