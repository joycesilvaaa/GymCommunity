import React from 'react';
import { Box, Text, Progress, HStack, VStack, Divider, IconButton } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { HealthGoal } from '@/interfaces/healthGoal';

interface GoalProgressProps {
  goal: HealthGoal;
  onEdit: (goal: HealthGoal) => void;
  onDelete: (id: number) => void;
}

function GoalProgress({ goal, onEdit, onDelete }: GoalProgressProps) {
  const currentDate = new Date();
  const totalDays = Math.ceil(
    (goal.end_date.getTime() - goal.start_date.getTime()) / (1000 * 60 * 60 * 24),
  );
  const passedDays = Math.ceil(
    (currentDate.getTime() - goal.start_date.getTime()) / (1000 * 60 * 60 * 24),
  );
  const progress = Math.min((passedDays / totalDays) * 100, 100);

  return (
    <Box p={4} m={2} bg="white" borderRadius={8} shadow={2}>
      <HStack justifyContent="space-between" alignItems="center">
        <Text fontSize="lg" fontWeight="bold">
          {goal.goal_type}
        </Text>
        <HStack space={2}>
          <IconButton icon={<MaterialIcons name="edit" size={20} />} onPress={() => onEdit(goal)} />
          <IconButton
            icon={<MaterialIcons name="delete" size={20} />}
            onPress={() => onDelete(goal.id)}
          />
        </HStack>
      </HStack>

      <Divider my={2} />

      <VStack space={2}>
        <Text>Progresso: {progress.toFixed(1)}%</Text>
        <Progress value={progress} colorScheme="emerald" />

        <HStack space={4} mt={2}>
          <VStack>
            <Text fontSize="sm" color="gray.500">
              Inicial
            </Text>
            <Text fontWeight="bold">{goal.start_weight} kg</Text>
          </VStack>

          <VStack>
            <Text fontSize="sm" color="gray.500">
              Objetivo
            </Text>
            <Text fontWeight="bold">{goal.goal_weight} kg</Text>
          </VStack>

          <VStack>
            <Text fontSize="sm" color="gray.500">
              Prazo
            </Text>
            <Text fontWeight="bold">{goal.end_date.toLocaleDateString()}</Text>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
}

export default GoalProgress;
