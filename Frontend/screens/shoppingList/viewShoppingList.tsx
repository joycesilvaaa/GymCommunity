import React, { useState, useEffect } from 'react';
import { Text, View } from 'native-base';
import { Alert } from 'react-native';
import { Layout } from '@/components/layout';
import { NavigationProp } from '@react-navigation/native';
import { Button } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { IShoppingList, Options } from '@/interfaces/shoppingList';
import  routes from '@/api/api';

type ShoppingListProps = {
  navigation: NavigationProp<any>;
  route: { params?: { id?: number } };
};

export function ViewShoppingList({ navigation, route }: ShoppingListProps) {
  const id = route.params?.id ?? 1; 
  const [title, setTitle] = useState<string|null>(null);
  const [items, setItems] = useState<Options[]>([]);

  async function shoppingListActual() {
    try {
      const response = await routes.ShoppingListById(id);
      if (response?.data?.data) {
        setTitle(response.data.data.title || 'Lista de Compras');
        setItems(response.data.data.options || []);
      } else {
        console.error('Unexpected response structure:', response);
        setTitle('Lista de Compras');
        setItems([]);
      }
    } catch (error) {
      console.error('Error fetching shopping list:', error);
      setTitle('Lista de Compras');
      setItems([]);
    }
  }
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      shoppingListActual();
  });

  return unsubscribe;
    
  }, [navigation, route.params?.id]);

  async function handleDelete(id: number) {
    try {
        const confirmDelete = await new Promise((resolve) => {
          Alert.alert(
            'Confirmação',
            'Tem certeza que deseja deletar esta lista de compras?',
            [
              { text: 'Cancelar', onPress: () => resolve(false), style: 'cancel' },
              { text: 'Deletar', onPress: () => resolve(true) },
            ],
            { cancelable: false }
          );
        });
        if (confirmDelete) {
            await routes.deleteShoppingList(id);
            navigation.navigate("ShoppingList");
        }
    }
    catch (error) {
        console.log(error);
    }
}

  return (
    <Layout navigation={navigation}>
      <View mt={2} p={2} borderWidth={1} borderColor="gray.200" borderRadius={5} margin={5}>
        {title && items.length === 0 ? (
          <>
            <Text fontSize="xl" fontWeight="bold" color="indigo.700" textAlign="center">
              Lista de Compras Vazia
            </Text>
          </>
        ) : (
          <>
            <Text fontSize="xl" fontWeight="bold" color="indigo.700" textAlign="center">
              {title}
            </Text>
            {items.map((item: Options, idx: number) => (
              <View key={idx} style={{ marginBottom: 16 }}>
                <Text fontSize="md" fontWeight="medium" color="gray.700">
                  {item.name}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Quantidade: {item.quantity}
                </Text>
              </View>
            ))}
            <Button
              mt={4}
              leftIcon={<MaterialIcons name="delete" size={16} color="white" />}
              colorScheme="red"
              onPress={() => {
                handleDelete(id);
              }}
            >
              Deletar Lista
            </Button>
          </>
        )}
      </View>
    </Layout>
  );
}

