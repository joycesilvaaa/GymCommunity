import React, { useState, useEffect } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { Button, View, Text, Icon, Center, VStack, Input, Pressable, Box } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Layout } from '@/components/layout';
import { ModalCreateUser } from '@/components/modal/createUser';
import { ItemCard } from '@/components/card/customItemCard';
import routes from '@/api/api';
import { IUserListPrevious } from '@/interfaces/user';

type InitialProps = {
  navigation: NavigationProp<any>;
};

export function ManagerClients({ navigation }: InitialProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [users, setUsers] = useState<IUserListPrevious[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUserListPrevious[]>([]);
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

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
      setFilteredUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  }

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.trim() === '') {
      setFilteredUsers(users);
      setShowSuggestions(false);
    } else {
      const filtered = users.filter((user) => user.cpf.includes(text));
      setFilteredUsers(filtered);
      setShowSuggestions(filtered.length > 0);
    }
  };

  const handleSelectSuggestion = (cpf: string) => {
    setQuery(cpf);
    setShowSuggestions(false);
    setFilteredUsers(users.filter((user) => user.cpf === cpf));
  };

  return (
    <Layout navigation={navigation}>
      <View flex={1} margin={4} padding={1}>
        <VStack space={2} alignItems="center" width="100%">
          <Input
            placeholder="Digite o CPF do cliente"
            variant="filled"
            width="100%"
            bg="white"
            shadow={1}
            borderRadius={5}
            InputRightElement={
              <Icon margin={2} size="5" color="indigo.600" as={<MaterialIcons name="search" />} />
            }
            onChangeText={handleSearch}
            value={query}
            fontSize="md"
            py={4}
            autoComplete="off"
          />

          {showSuggestions && (
            <View bg="white" borderRadius={5} width="100%">
              {filteredUsers.slice(0, 3).map((item) => (
                <Pressable key={item.id} onPress={() => handleSelectSuggestion(item.cpf)}>
                  <Box bg="gray.100" borderColor="gray.300" p={3}>
                    <Text>{item.cpf} - {item.name}</Text>
                  </Box>
                </Pressable>
              ))}
            </View>
          )}
        </VStack>

        <View height={0.5} bg="gray.200" width="100%" my={4} />
        <View flexDirection="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Text fontSize="xl" color="indigo.600" fontWeight="bold">
            Clientes
          </Text>
          <Button onPress={() => setModalVisible(true)} colorScheme="indigo">
            Novo Cliente
          </Button>
        </View>

        {filteredUsers.length === 0 ? (
          <Center flex={1} mt={5}>
            <Text fontSize="lg" color="gray.500">
              Não existem clientes cadastrados.
            </Text>
          </Center>
        ) : (
          filteredUsers.map((user) => (
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
      </View>

      <ModalCreateUser
        navigation={navigation}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </Layout>
  );
}

