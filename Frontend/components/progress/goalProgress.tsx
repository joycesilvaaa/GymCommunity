import React from 'react';
import { Box, Text, Progress, VStack, HStack, IconButton, Spacer } from 'native-base';
import { Feather } from '@expo/vector-icons';
import { HealthGoal } from '@/interfaces/healthGoal';

interface GoalProgressProps {
  goal: HealthGoal;
  onEdit: (goal: HealthGoal) => void;
  onDelete: (id: number) => void;
}

const GoalProgress = ({ goal, onEdit, onDelete }: GoalProgressProps) => {
  let progress = 0;
  const initialWeight = goal.start_weight;
  const currentWeight = goal.goal_weight;
  const targetWeight = goal.end_weight;
  console.log('Goal', goal);

  if (goal.goal_type === 'Ganho de Massa') {
    progress = targetWeight > 0 ? currentWeight / targetWeight : 0;
  } else if (goal.goal_type === 'Perda de Peso') {
    if (currentWeight <= targetWeight) {
      progress = 1;
    } else {
      progress = targetWeight / currentWeight;
    }
  } else if (goal.goal_type === 'Manutenção') {
    if (currentWeight === targetWeight) {
      progress = 1; // Meta atingida
    }
    else if (currentWeight < targetWeight) {
      progress = currentWeight / targetWeight; 
      console.log('Progresso de manutenção:', progress);
      console.log('Peso atual:', currentWeight, 'Peso alvo:', targetWeight);
    } else {
      progress = 0; // Excedeu a meta
    }
  }

  // Garantir que o progresso esteja entre 0 e 1
  const safeProgress = Math.min(1, Math.max(0, progress));

  // Para compatibilidade com componente Progress que pode esperar 0-100
  const displayProgress = Math.round(safeProgress * 100);

  return (
    <Box bg="white" p={4} borderRadius="md" shadow={1}>
      <VStack space={4}>
        <HStack alignItems="center">
          <Text fontSize="xl" fontWeight="bold" color="indigo.700">
        {goal.goal_type}
          </Text>
          <Spacer />
          <HStack space={1}>
        <IconButton
          icon={<Feather name="edit-2" size={18} color="#6366f1" />}
          variant="solid"
          bg="indigo.100"
          borderRadius="full"
          size="sm"
          onPress={() => onEdit({
            id: goal.id,
            goal_type: goal.goal_type,
            goal_weight: goal.goal_weight,
            start_weight: goal.start_weight,
            end_weight: goal.end_weight,
            start_date: goal.start_date,
            end_date: goal.end_date
          })}
          _pressed={{ bg: "indigo.200" }}
        />
        <IconButton
          icon={<Feather name="trash-2" size={18} color="#ef4444" />}
          variant="solid"
          bg="red.100"
          borderRadius="full"
          size="sm"
          onPress={() => onDelete(goal.id)}
          _pressed={{ bg: "red.200" }}
        />
          </HStack>
        </HStack>

        <VStack space={1}>
          <Text fontSize="sm" color="coolGray.500">
        {new Date(goal.start_date).toLocaleDateString('pt-BR')} até{' '}
        {new Date(goal.end_date).toLocaleDateString('pt-BR')}
          </Text>
          <HStack justifyContent="space-between" alignItems="center">
        <Text fontSize="sm" color="coolGray.700">
          <Text color="coolGray.400">Inicial:</Text> {initialWeight} kg{' '}
          <Text color="coolGray.400">Atual:</Text> {currentWeight} kg{' '}
          <Text color="coolGray.400">Meta:</Text> {targetWeight} kg
        </Text>
        <Box
          bg={goal.goal_type === 'Perda de Peso' ? "green.100" : "blue.100"}
          px={3}
          py={1}
          borderRadius="md"
        >
          <Text fontWeight="bold" color={goal.goal_type === 'Perda de Peso' ? "green.700" : "blue.700"}>
            {displayProgress}% completo
          </Text>
        </Box>
          </HStack>
        </VStack>

        <Progress
          value={Math.max(0, Math.min(100, displayProgress))}
          max={100}
          colorScheme={goal.goal_type === 'Perda de Peso' ? 'green' : 'blue'}
          height={3}
          borderRadius="full"
          bg="coolGray.100"
        />
      </VStack>
    </Box>
  );
};

export default GoalProgress;
