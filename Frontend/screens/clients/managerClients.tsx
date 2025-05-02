import React, { useState, useEffect } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { Button, Box, Text, Icon, Center, VStack, Input, Pressable } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Layout } from '@/components/layout';

import { ItemCard } from '@/components/card/customItemCard';
import routes from '@/api/api';
import { IUserListPrevious } from '@/interfaces/user';
import { NavigationProps } from '@/interfaces/navigation';


export function ManagerClients({ navigation }:NavigationProps) {
 
  const [users, setUsers] = useState<IUserListPrevious[]>([]);


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getAllClients();
    });

    return unsubscribe;
  }, [navigation]);

  async function getAllClients() {
    try {
      const response = await routes.clientsForProfissional();
      setUsers(response.data.data);
      
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  }




  return (
    <Layout navigation={navigation}>
      <Box flex={1} bg="gray.50" p={4} >
        
        <Box flexDirection="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Text fontSize="xl" color="indigo.600" fontWeight="bold">
            Clientes
          </Text>
          {users.length > 0 && (
            <Button onPress={() => navigation.navigate("NewClient")} colorScheme="indigo">
            Novo Cliente
          </Button>
          )}
          
        </Box>

        {users.length === 0 ? (
            <Center flex={1} mt={5}>
            <VStack space={4} alignItems="center">
              <Icon as={MaterialIcons} name="group" size="xl" color="gray.400" />
              <Text fontSize="lg" color="gray.500" textAlign="center">
              Nenhum cliente vinculado ao seu perfil ainda.
              </Text>
              <Button
              onPress={() => navigation.navigate("NewClient")}
              colorScheme="indigo"
              mt={2}
              >
              Adicionar Novo Cliente
              </Button>
            </VStack>
            </Center>
        ) : (
          users.map((user) => (
            <ItemCard
              key={user.id}
              title={user.name}
              description={`E-mail: ${user.email} \nCPF: ${user.cpf}`}
              navigation={navigation}
              screen="UserProfile"
              id={user.id.toString()}
              iconName="person"
            />
          ))
        )}
      </Box>

      
    </Layout>
  );
}

