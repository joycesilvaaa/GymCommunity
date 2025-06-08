import React, { useState } from 'react';
import {
  Button,
  FormControl,
  Input,
  Select,
  VStack,
  Box,
  Heading,
  Text,
  HStack,
  Icon,
} from 'native-base';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { HealthGoalFormData } from '@/interfaces/healthGoal';
import { MaterialIcons } from '@expo/vector-icons';

interface HealthGoalFormProps {
  initialData?: HealthGoalFormData;
  onSubmit: (data: HealthGoalFormData) => void;
}

function HealthGoalForm({ initialData, onSubmit }: HealthGoalFormProps) {
  const [formData, setFormData] = useState<HealthGoalFormData>(
    initialData || {
      goal_type: 'Perda de Peso',
      start_weight: 0,
      goal_weight: 0,
      end_weight: 0,
      start_date: new Date(),
      end_date: new Date(),
    },
  );

  const [showDatePicker, setShowDatePicker] = useState({ start: false, end: false });

  const handleDateChange = (type: 'start' | 'end') => (event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker((prev) => ({ ...prev, [type]: false }));
    if (date) {
      setFormData((prev) => ({ ...prev, [`${type}_date`]: date }));
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Box bg="white" borderRadius="lg" shadow={2} p={6} mx={2} my={4} alignItems="center">
      <Heading mb={4} color="indigo.600" size="md">
        Nova Meta de Saúde
      </Heading>
      <VStack space={5} w="100%">
        <FormControl>
          <FormControl.Label>Tipo de Meta</FormControl.Label>
          <Select
            selectedValue={formData.goal_type}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, goal_type: value }))}
            borderRadius="md"
            bg="gray.100"
            _selectedItem={{
              bg: 'primary.100',
              endIcon: <Icon as={MaterialIcons} name="check" size={5} />,
            }}
          >
            <Select.Item label="Perda de Peso" value="Perda de Peso" />
            <Select.Item label="Ganho de Massa" value="Ganho de Massa" />
            <Select.Item label="Manutenção" value="Manutenção" />
          </Select>
        </FormControl>

        <HStack space={3}>
          <FormControl flex={1}>
            <FormControl.Label>Peso Inicial (kg)</FormControl.Label>
            <Input
              keyboardType="numeric"
              value={formData.start_weight.toString()}
              onChangeText={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  start_weight: Number(value) || 0,
                }))
              }
              borderRadius="md"
              bg="gray.100"
            />
          </FormControl>
          <FormControl flex={1}>
            <FormControl.Label>Peso Atual (kg)</FormControl.Label>
            <Input
              keyboardType="numeric"
              value={formData.goal_weight.toString()}
              onChangeText={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  goal_weight: Number(value) || 0,
                }))
              }
              borderRadius="md"
              bg="gray.100"
            />
          </FormControl>
        </HStack>

        <FormControl>
          <FormControl.Label>Peso Desejado (kg)</FormControl.Label>
          <Input
            keyboardType="numeric"
            value={formData.end_weight.toString()}
            onChangeText={(value) =>
              setFormData((prev) => ({
                ...prev,
                end_weight: Number(value) || 0,
              }))
            }
            borderRadius="md"
            bg="gray.100"
          />
        </FormControl>

        <HStack space={3}>
          <FormControl flex={1}>
            <FormControl.Label>Data de Início</FormControl.Label>
            <Button
              variant="outline"
              colorScheme="primary"
              leftIcon={<Icon as={MaterialIcons} name="calendar-today" size={5} />}
              onPress={() => setShowDatePicker((prev) => ({ ...prev, start: true }))}
            >
              <Text color="primary.700">{formData.start_date.toLocaleDateString()}</Text>
            </Button>
            {showDatePicker.start && (
              <DateTimePicker
                value={formData.start_date}
                mode="date"
                onChange={handleDateChange('start')}
              />
            )}
          </FormControl>

          <FormControl flex={1}>
            <FormControl.Label>Data Final Prevista</FormControl.Label>
            <Button
              variant="outline"
              colorScheme="secondary"
              leftIcon={<Icon as={MaterialIcons} name="event" size={5} />}
              onPress={() => setShowDatePicker((prev) => ({ ...prev, end: true }))}
            >
              <Text color="secondary.700">{formData.end_date.toLocaleDateString()}</Text>
            </Button>
            {showDatePicker.end && (
              <DateTimePicker
                value={formData.end_date}
                mode="date"
                minimumDate={formData.start_date}
                onChange={handleDateChange('end')}
              />
            )}
          </FormControl>
        </HStack>

        <Button
          mt={4}
          colorScheme="indigo"
          borderRadius="full"
          leftIcon={<Icon as={MaterialIcons} name="check-circle" size={6} />}
          onPress={handleSubmit}
        >
          Salvar Meta
        </Button>
      </VStack>
    </Box>
  );
}

export default HealthGoalForm;
