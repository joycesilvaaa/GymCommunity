import React, { useState, useEffect } from 'react';
import { Box, Button, Text, VStack, Icon } from 'native-base';

import HealthGoalForm from '../../components/forms/formHealthGoal';
import GoalProgress from '../../components/progress/goalProgress';
import routes from '@/api/api';
import { Layout } from '@/components/layout';
import { NavigationProps } from '@/interfaces/navigation';
import { HealthGoal, HealthGoalFormData } from '@/interfaces/healthGoal';

function HealthGoalsScreen({ navigation }: NavigationProps) {
  const [goals, setGoals] = useState<HealthGoal[]>([
    {
      id: 1,
      goal_type: 'Ganho de Massa',
      start_weight: 68,
      goal_weight: 75,
      end_weight: 0,
      start_date: new Date(2024, 2, 1),
      end_date: new Date(2024, 5, 1),
      success: false
    },
    {
      id: 2,
      goal_type: 'Perda de Peso',
      start_weight: 92,
      goal_weight: 85,
      end_weight: 0,
      start_date: new Date(2024, 3, 15),
      end_date: new Date(2024, 6, 15),
      success: false
    }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<HealthGoal | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      //   const response = await routes.getHealthGoals();
      //   setGoals(response.data.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  async function handleSubmit(formData: HealthGoalFormData) {
    try {
      if (editingGoal) {
      } else {
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
      await fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

    const mockGoals: HealthGoal[] = [
      {
        id: 1,
        goal_type: 'Ganho de Massa',
        start_weight: 68,
        goal_weight: 75,
        end_weight: 0,
        start_date: new Date(2024, 2, 1),
        end_date: new Date(2024, 5, 1),
        success: false
      },
      {
        id: 2,
        goal_type: 'Perda de Peso',
        start_weight: 92,
        goal_weight: 85,
        end_weight: 0,
        start_date: new Date(2024, 3, 15),
        end_date: new Date(2024, 6, 15),
        success: false
      }
    ];
  return (
    <Layout navigation={navigation}>
      <Box flex={1} p={4}>
        {showForm || editingGoal ? (
          <HealthGoalForm initialData={editingGoal || undefined} onSubmit={handleSubmit} />
        ) : (
          <VStack flex={1} space={4}>
            <Button onPress={() => setShowForm(true)}>Nova Meta</Button>

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
