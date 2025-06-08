import React, { useState, useEffect } from 'react';
import { Box, Button, Text, VStack, Icon } from 'native-base';

import HealthGoalForm from '../../components/forms/formHealthGoal';
import GoalProgress from '../../components/progress/goalProgress';
import routes from '@/api/api';
import { Layout } from '@/components/layout';
import { NavigationProps } from '@/interfaces/navigation';
import { HealthGoal, HealthGoalFormData } from '@/interfaces/healthGoal';

// Interfaces para criação e atualização de metas de saúde
export interface CreateHealthGoal {
  goal_type: string;
  start_weight: number;
  goal_weight: number;
  end_weight: number;
  start_date: Date;
  end_date: Date;
}

export interface UpdateHealthGoal {
  goal_type?: string;
  start_weight?: number;
  goal_weight?: number;
  end_weight?: number;
  start_date?: Date;
  end_date?: Date;
}

// Função utilitária para formatar datas sem timezone
function toNaiveISOString(date: Date): string {
  // YYYY-MM-DDTHH:mm:ss
  return (
    date.getFullYear() +
    '-' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getDate()).padStart(2, '0') +
    'T' +
    String(date.getHours()).padStart(2, '0') +
    ':' +
    String(date.getMinutes()).padStart(2, '0') +
    ':' +
    String(date.getSeconds()).padStart(2, '0')
  );
}

function HealthGoalsScreen({ navigation }: NavigationProps) {
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<HealthGoal | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await routes.getHealthGoals();
      setGoals(
        response.data.data.map((goal: any) => ({
          ...goal,
          start_date: new Date(goal.start_date),
          end_date: goal.end_date ? new Date(goal.end_date) : null,
        })),
      );
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  async function handleSubmit(formData: HealthGoalFormData) {
    try {
      const payload = {
        goal_type: formData.goal_type,
        start_weight: Math.round(formData.start_weight), // peso inicial
        goal_weight: Math.round(formData.goal_weight), // peso atual
        end_weight: Math.round(formData.end_weight), // peso desejado
        start_date: toNaiveISOString(formData.start_date),
        end_date: toNaiveISOString(formData.end_date),
      };
      console.log('Payload to save:', payload);
      if (editingGoal) {
        // Editar meta existente
        await routes.updateHealthGoal(editingGoal.id, payload);
      } else {
        // Criar nova meta
        await routes.createHealthGoal(payload);
      }
      setShowForm(false);
      setEditingGoal(null);
      await fetchGoals();
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await routes.deleteHealthGoal(id);
      await fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  return (
    <Layout navigation={navigation}>
      <Box flex={1} p={4}>
        {showForm || editingGoal ? (
          <>
            <HealthGoalForm initialData={editingGoal || undefined} onSubmit={handleSubmit} />
          </>
        ) : (
          <VStack flex={1} space={4}>
            <Button onPress={() => setShowForm(true)} bg="indigo.600" _pressed={{ bg: "indigo.700" }}>
              Nova Meta
            </Button>

            {goals.length === 0 ? (
              <Box alignItems="center" mt={8}>
                <Text fontSize="lg" fontWeight="bold" color="gray.500">
                  Nenhuma meta cadastrada
                </Text>
                <Text fontSize="sm" color="gray.400">
                  Comece criando uma nova meta para acompanhar seu progresso!
                </Text>
              </Box>
            ) : (
              <VStack space={4}>
                {goals.map((goal) => (
                  <GoalProgress
                    key={goal.id}
                    goal={goal}
                    onEdit={setEditingGoal}
                    onDelete={handleDelete}
                  />
                ))}
              </VStack>
            )}
          </VStack>
        )}
      </Box>
    </Layout>
  );
}

export default HealthGoalsScreen;
