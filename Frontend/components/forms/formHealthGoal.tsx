import React, { useState } from 'react';
import { Button, FormControl, Input, Select, VStack } from 'native-base';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { HealthGoalFormData } from '@/interfaces/healthGoal';

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
    <VStack space={4} p={4}>
      <FormControl>
        <FormControl.Label>Tipo de Meta</FormControl.Label>
        <Select
          selectedValue={formData.goal_type}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, goal_type: value }))}
        >
          <Select.Item label="Perda de Peso" value="Perda de Peso" />
          <Select.Item label="Ganho de Massa" value="Ganho de Massa" />
          <Select.Item label="Manutenção" value="Manutenção" />
        </Select>
      </FormControl>

      <FormControl>
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
        />
      </FormControl>

      <FormControl>
        <FormControl.Label>Peso Objetivo (kg)</FormControl.Label>
        <Input
          keyboardType="numeric"
          value={formData.goal_weight.toString()}
          onChangeText={(value) =>
            setFormData((prev) => ({
              ...prev,
              goal_weight: Number(value) || 0,
            }))
          }
        />
      </FormControl>

      <FormControl>
        <FormControl.Label>Data de Início</FormControl.Label>
        <Button onPress={() => setShowDatePicker((prev) => ({ ...prev, start: true }))}>
          {formData.start_date.toLocaleDateString()}
        </Button>
        {showDatePicker.start && (
          <DateTimePicker
            value={formData.start_date}
            mode="date"
            onChange={handleDateChange('start')}
          />
        )}
      </FormControl>

      <FormControl>
        <FormControl.Label>Data Final Prevista</FormControl.Label>
        <Button onPress={() => setShowDatePicker((prev) => ({ ...prev, end: true }))}>
          {formData.end_date.toLocaleDateString()}
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

      <Button mt={4} onPress={handleSubmit}>
        Salvar Meta
      </Button>
    </VStack>
  );
}

export default HealthGoalForm;
