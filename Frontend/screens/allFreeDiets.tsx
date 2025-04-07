import { FormCreate } from '@/components/forms/formCreate';
import { NavigationProp } from '@react-navigation/native';
import { Button, View, Text, Icon, Center, VStack } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Layout } from '@/components/layout';
import { Input } from 'native-base';
import { ItemCard } from '@/components/card/customItemCard';
import { useState } from 'react';
import { CustomComponentProps } from 'native-base/lib/typescript/components/types';
import { CustomNavigationProp } from '@/interfaces/navigation';
import { IAllFreeDiets } from '@/interfaces/diet';
import routes from '@/api/api';
import { useEffect } from 'react';
import { Alert } from 'react-native';

export function AllFreeDiets({ navigation }: CustomNavigationProp) {  
    const [diets, setDiets] = useState<IAllFreeDiets[]>([]);
    
    useEffect(() => {
            getDietsFreeByProfissional();   
        }
        , []);
        
    async function getDietsFreeByProfissional() {
            try {
                const response = await routes.allFreeDiets();
                setDiets(response.data.data);
            }
            catch (error) {
                console.error('Error fetching diets:', error);
            }
        }
    return (
        <Layout navigation={navigation} >
            <View flex={1} margin={4} padding={1}>
            <VStack space={4} alignItems="center" width="100%">
                <Input
                placeholder="Digite o nome da dieta"
                variant="filled"
                width="100%"
                bg="white"
                InputRightElement={
                    <Icon margin={2} size="5" color="indigo.600" as={<MaterialIcons name="search" />} />
                }
                onSubmitEditing={(event) => {
                    const query = event.nativeEvent.text;
                    // Add your search logic here
                    console.log('Searching for:', query);
                }}
                fontSize="md"
                py={4}
                />
            </VStack>
            <View height={0.5} bg="gray.200" width="100%" my={2} />
            <View flexDirection="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Text fontSize="xl" color="indigo.700" fontWeight="bold" textAlign="center">
                Dietas
                </Text>
            </View>
            {diets.map((diet) => (
                <ItemCard
                key={diet.id}
                title={diet.title}
                description={diet.description}
                navigation={navigation}
                screen="ViewDiet"
                id={diet.id.toString()}
                iconName="restaurant"
                />
            ))}
            </View>
        </Layout>)
}