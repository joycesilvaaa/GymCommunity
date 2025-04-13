import { ExpiringDietCard } from "@/components/card/customExpiringDiet";
import { Layout } from "@/components/layout";
import { Text, View } from "react-native";
import { NavigationProp } from '@react-navigation/native';
import { NavigationProps } from "@/interfaces/navigation";
import routes from "@/api/api";
import { IExpiringDiet } from "@/interfaces/diet";
import { useState, useEffect } from "react";
import { MaterialIcons } from '@expo/vector-icons';

export function ExpiringDiet({ navigation }: NavigationProps) {  
    const [dietList, setDietList] = useState<IExpiringDiet[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            const response = await routes.expiringDiet();
            setDietList(response.data.data);
        } catch (error) {
            console.error('Error fetching diets:', error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <Layout navigation={navigation}>
                <View style={{ padding: 20 }}>
                    {dietList.length === 0 ? (
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
                                    name="event-available" 
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
                                Nenhuma dieta próxima do vencimento encontrada.
                                {"\n"}Você pode criar novas dietas ou verificar as existentes.
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
                                    🎉 Todas as dietas estão em dia!
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
                                    Dietas a Vencer
                                </Text>
                                <Text style={{
                                    fontSize: 15,
                                    color: '#64748b',
                                    lineHeight: 22
                                }}>
                                    Você tem {dietList.length} dieta{dietList.length > 1 ? 's' : ''} prestes a vencer. 
                                    {"\n"}Revise ou atualize os planos alimentares.
                                </Text>
                            </View>

                            {dietList.map((diet) => (
                                <ExpiringDietCard
                                    key={diet.diet_id.toString()}
                                    title={diet.title}
                                    description={diet.description}
                                    navigation={navigation}
                                    dietId={diet.diet_id.toString()}
                                    iconName="event-note"
                                    userId={diet.user_id.toString()}
                                />
                            ))}
                        </>
                    )}
                </View>
        </Layout>
    );
}