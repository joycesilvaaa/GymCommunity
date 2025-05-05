import React from 'react';
import { Box, Pressable, HStack, VStack, Badge, Image, AspectRatio, Text } from 'native-base';
import { Exercise } from '@/interfaces/workout_plans';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress: () => void;
}

function ExerciseCard({ exercise, onPress }: ExerciseCardProps) {
  return (
    <Pressable onPress={onPress}>
      {({ isPressed }) => (
        <Box
          bg={isPressed ? 'gray.200' : 'gray.50'}
          p={3}
          rounded="lg"
          opacity={isPressed ? 0.9 : 1}
        >
          <HStack space={3} alignItems="center">
            <VStack flex={1}>
              <Text bold fontSize="md">
                {exercise.name}
              </Text>
              <HStack space={2} alignItems="center">
                <Badge colorScheme="blue">{exercise.muscle_group}</Badge>
                <Text color="primary.600">{exercise.repetitions}</Text>
              </HStack>
              <Text fontSize="xs" color="gray.500">
                Descanso: {exercise.rest_time}min
              </Text>
            </VStack>
          </HStack>
        </Box>
      )}
    </Pressable>
  );
}

export default ExerciseCard;
