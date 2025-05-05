import React from 'react';
import { Modal, VStack, HStack, Text, Badge, Button, AspectRatio } from 'native-base';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import ImageViewer from '@/components/imageViewer';
import { Exercise } from '@/interfaces/workout_plans';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  isVisible: boolean;
  onClose: () => void;
}

function ExerciseDetailModal({ exercise, isVisible, onClose }: ExerciseDetailModalProps) {
  if (!exercise) return null;

  return (
    <Modal isOpen={isVisible} onClose={onClose} size="xl">
      <Modal.Content maxHeight="90%">
        <Modal.CloseButton />
        <Modal.Header>{exercise.name}</Modal.Header>

        <Modal.Body>
          {exercise.image_url ? (
            <AspectRatio ratio={16 / 9}>
              <ImageViewer imageUrl={exercise.image_url} />
            </AspectRatio>
          ) : (
            <VStack alignItems="center" space={2}>
              <Text fontSize="4xl" color="gray.500">
                <Icon name="image-off" size={32} color="gray" />
              </Text>
              <Text italic color="gray.500" textAlign="center">
                Nenhuma imagem disponível para este exercício.
              </Text>
            </VStack>
          )}

          <VStack space={2} mt={4}>
            <HStack space={4} justifyContent="space-between">
              <Badge colorScheme="purple" flex={1} textAlign="center" padding={3}>
                {exercise.muscle_group}
              </Badge>
              <Badge colorScheme="blue" flex={1} textAlign="center" padding={3}>
                {`Descanso: ${exercise.rest_time}min`}
              </Badge>
            </HStack>

            <Text bold fontSize="md" mt={2}>
              Execução:
            </Text>
            <Text>{exercise.description}</Text>

            <HStack justifyContent="space-between" mt={4}>
              <Text bold>Séries:</Text>
              <Text color="primary.600">{exercise.repetitions}</Text>
            </HStack>
          </VStack>
        </Modal.Body>

        <Modal.Footer>
          <Button onPress={onClose}>Fechar</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

export default ExerciseDetailModal;
