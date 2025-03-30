import { FormCreate } from '@/components/forms/formCreate'; 
import { NavigationProp } from '@react-navigation/native';
import { Button, View, Text, Icon, Center, VStack } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Layout } from '@/components/layout';
import { Input } from 'native-base';
import { ItemCard } from '@/components/card/customItemCard';
import { useState } from 'react';

interface MenuProps {
  navigation: NavigationProp<any>;
}

export function AllFreeWorkouts({ navigation }: MenuProps) {  
    const [modalVisible, setModalVisible] = useState(false);
    const workouts = [
        { id: 1, name: 'Treino HIIT', description: 'Treino de alta intensidade para queima de gordura.' },
        { id: 2, name: 'Treino Funcional', description: 'Exercícios que melhoram a mobilidade e resistência.' },
        { id: 3, name: 'Treino de Força', description: 'Treino voltado para o ganho de massa muscular.' },
    ];
    return (
        <Layout navigation={navigation} >
            <View flex={1} margin={5} padding={1}>
            <VStack space={4} alignItems="center" width="100%">
                <Input
                placeholder="Digite o nome do treino"
                variant="filled"
                width="100%"
                bg="white"
                InputRightElement={
                    <Icon margin={2} size="5" color="indigo.600" as={<MaterialIcons name="search" />} />
                }
                onSubmitEditing={(event) => {
                    const query = event.nativeEvent.text;
                    // Adicione sua lógica de pesquisa aqui
                    console.log('Buscando por:', query);
                }}
                fontSize="md"
                py={4}
                />
            </VStack>
            <View height={0.5} bg="gray.200" width="100%" my={4} />
            <View flexDirection="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Text fontSize="xl" color="indigo.700" fontWeight="bold" textAlign="center">
                Treinos
                </Text>
            </View>
            {workouts.map((workout) => (
                <ItemCard
                key={workout.id}
                title={workout.name}
                description={workout.description}
                navigation={navigation}
                screen="ViewWorkout"
                id={workout.id.toString()}
                iconName="fitness-center"
                />
            ))}
            </View>
        </Layout>)
}
