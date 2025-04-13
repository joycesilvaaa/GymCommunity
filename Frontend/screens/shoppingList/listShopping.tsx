import { FormCreate } from '@/components/forms/formCreate';
import { NavigationProp } from '@react-navigation/native';
import { Button, View, Text, Icon, Center, VStack } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Layout } from '@/components/layout';
import { Input } from 'native-base';
import { ItemCard } from '@/components/card/customItemCard';
import { useState, useEffect } from 'react';
import { IShoppingListPrevious } from '@/interfaces/shoppingList';
import routes from '@/api/api';
import { useAuth } from '@/hooks/auth';
import { AuthContext } from '@/context/auth';
import { formatedDateBr } from '@/utils';
interface MenuProps {
  navigation: NavigationProp<any>;
}
export function ListShopping({ navigation}: MenuProps) {
    const context = useAuth()
    const [shoppingLists, setShoppingLists] = useState<IShoppingListPrevious[]>([]);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getShoppingListsPreviouns();
        });

        return unsubscribe;
    }, [navigation]);

    
    async function getShoppingListsPreviouns() {
        const response = await routes.allShoppingList();
        setShoppingLists(response.data.data.length > 0 ? response.data.data : []);
    }
    return (
       <Layout navigation={navigation} >
                   <View flex={1} margin={5} padding={1}>
                   <View flexDirection="row" justifyContent="space-between" alignItems="center" mb={4}>
                       <Text fontSize="xl" color="indigo.700" fontWeight="bold" textAlign="center">
                       Listas de Compras
                       </Text>
                       <Button onPress={() => navigation.navigate("CreateAShoppingList")} colorScheme="indigo">
                       Criar Lista
                       </Button>
                   </View>
                   {shoppingLists.length === 0 ? (
                       <Text fontSize="md" color="gray.500" textAlign="center">
                           Nenhuma lista de compras encontrada.
                       </Text>
                   ) : (
                       shoppingLists.map((item, index) => (
                           <ItemCard
                               key={index}
                               title={item.title}
                               description={`Data de atualização: ${formatedDateBr(item.last_update)}`}
                               navigation={navigation}
                               screen="ViewShoppingList"
                               id={item.id.toString()}
                               iconName="restaurant"
                           />
                       ))
                   )}
                   </View>
               </Layout>
    );
}