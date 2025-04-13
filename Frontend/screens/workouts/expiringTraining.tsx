import { Layout } from "@/components/layout";
import { NavigationProps } from "@/interfaces/navigation";
import { Box } from "native-base";
import { useState } from "react";
import { ExpiringWorkout } from "@/interfaces/workout_plans";
import { useEffect } from "react";
import routes from "@/api/api";
import { View, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import ExpiringWorkoutCard from "@/components/card/customExpiringWorkout"; 

function ExpiringWorkoutsScreen({ navigation }: NavigationProps) {
    const [expiringTraining, setExpiringTraining] = useState<ExpiringWorkout[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchExpiringWorkouts();
    }, []);

    async function fetchExpiringWorkouts() {
        try {
            const response = await routes.expiringWorkouts();
            setExpiringTraining(response.data.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching expiring workouts:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Layout navigation={navigation}>
            <View style={{ padding: 20 }}>
                {expiringTraining.length === 0 ? (
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: 400,
                        padding: 20
                    }}>
                        <View style={{
                            backgroundColor: '#e0e7ff',
                            borderRadius: 100,
                            padding: 20,
                            marginBottom: 25
                        }}>
                            <MaterialIcons 
                                name="fitness-center" 
                                size={48} 
                                color="#4f46e5" 
                            />
                        </View>
                        
                        <Text style={{
                            fontSize: 22,
                            fontWeight: '700',
                            color: '#1e293b',
                            textAlign: 'center',
                            marginBottom: 15
                        }}>
                            Tudo Atualizado!
                        </Text>
                        
                        <Text style={{
                            fontSize: 16,
                            color: '#64748b',
                            textAlign: 'center',
                            lineHeight: 24,
                            maxWidth: 300,
                            marginBottom: 30
                        }}>
                            Nenhum treino próximo do vencimento encontrado.
                            {"\n"}Você pode criar novos treinos ou verificar os existentes.
                        </Text>

                        <View style={{
                            backgroundColor: '#f1f5f9',
                            borderRadius: 12,
                            padding: 16,
                            width: '100%',
                            maxWidth: 300
                        }}>
                            <Text style={{
                                color: '#4f46e5',
                                fontSize: 14,
                                fontWeight: '600',
                                textAlign: 'center'
                            }}>
                                🎉 Todos os treinos estão em dia!
                            </Text>
                        </View>
                    </View>
                ) : (
                    <>
                        <View style={{
                            backgroundColor: '#f8fafc',
                            borderRadius: 12,
                            padding: 20,
                            marginBottom: 25,
                            borderLeftWidth: 4,
                            borderLeftColor: '#4f46e5'
                        }}>
                            <Text style={{
                                fontSize: 20,
                                fontWeight: '800',
                                color: '#1e293b',
                                marginBottom: 8
                            }}>
                                Treinos a Vencer
                            </Text>
                            <Text style={{
                                fontSize: 15,
                                color: '#64748b',
                                lineHeight: 22
                            }}>
                                Você tem {expiringTraining.length} treino{expiringTraining.length > 1 ? 's' : ''} prestes a vencer. 
                                {"\n"}Revise ou atualize os planos de treino.
                            </Text>
                        </View>

                        {expiringTraining.map((workout) => (
                            <ExpiringWorkoutCard
                                key={workout.workout_id.toString()}
                                title={workout.title}
                                description={workout.description}
                                navigation={navigation}
                                workoutId={workout.workout_id.toString()}
                                iconName="fitness-center"
                                userId={workout.user_id.toString()}
                            />
                        ))}
                    </>
                )}
            </View>
        </Layout>
    );
}

export default ExpiringWorkoutsScreen;