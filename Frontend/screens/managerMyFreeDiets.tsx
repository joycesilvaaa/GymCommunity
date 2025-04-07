import { FormCreate } from '@/components/forms/formCreate';
import { NavigationProp } from '@react-navigation/native';
import { Button, View, Text, Icon, Center, VStack } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Layout } from '@/components/layout';
import { Input } from 'native-base';
import { ItemCard } from '@/components/card/customItemCard';
import { useEffect, useState } from 'react';
import routes from '@/api/api';
import { DietsByProfissional } from '@/interfaces/diet';
interface MenuProps {
  navigation: NavigationProp<any>;
}

export function FreeDiets({ navigation }: MenuProps) {  
    const [modalVisible, setModalVisible] = useState(false);
    const [diets, setDiets] = useState<DietsByProfissional[]>([]);

    useEffect(() => {
        getDietsFreeByProfissional();   
    }
    , []);
    
    async function getDietsFreeByProfissional() {
        try {
            const response = await routes.freeDietsByProfissional();
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
            <View flexDirection="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Text fontSize="xl" color="indigo.700" fontWeight="bold" textAlign="center">
                Dietas
                </Text>
                <Button onPress={() => navigation.navigate('CreateDiet')} colorScheme="indigo">
                Criar Dieta
                </Button>
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