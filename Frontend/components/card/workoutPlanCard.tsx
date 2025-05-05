
import React from 'react';
import { Box, VStack, Text } from 'native-base';
import ExerciseCard from '@/components/card/exerciseCard';
import { Exercise, WorkoutPlan } from '@/interfaces/workout_plans';

interface WorkoutPlanCardProps {
  plan: WorkoutPlan;
  onExercisePress: (exercise: Exercise) => void;
}

function WorkoutPlanCard({ plan, onExercisePress }: WorkoutPlanCardProps) {
  return (
    <Box bg="white" p={4} rounded="xl" shadow={2}>
      <Text fontSize="xl" bold mb={4} color="primary.800">
        {plan.title}
      </Text>
      <VStack space={3}>
        {plan.exercises.map((exercise, index) => (
          <ExerciseCard key={index} exercise={exercise} onPress={() => onExercisePress(exercise)} />
        ))}
      </VStack>
    </Box>
  );
}

export default WorkoutPlanCard;
