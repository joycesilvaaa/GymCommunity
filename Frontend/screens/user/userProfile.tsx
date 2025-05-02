import routes from '@/api/api';
import { Layout } from '@/components/layout';
import { useAuth } from '@/hooks/auth';
import { NavigationProps } from '@/interfaces/navigation';
import { IUserDetails } from '@/interfaces/user';
import { Box, Text, Avatar, Icon } from 'native-base';
import { Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { MaterialIcons, AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { SettingsItem } from '@/components/settingsItem';

export function UserProfile({ navigation, route }: NavigationProps) {
  const { id } = route.params;
  const context = useAuth();
  const { user } = context;
  const [userDetails, setUserDetails] = useState<IUserDetails | null>(null);

  useEffect(() => {
    getUserProfile();
  }, [id]);

  async function getUserProfile() {
    try {
      const response = await routes.userDetails(id);
      console.log('User Details:', response.data.data);
      setUserDetails(response.data.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  async function removeClient() {
    try {
      const response = await routes.removeClient(id);
      if (response.status === 200) {
        Alert.alert('Sucesso', 'Vínculo removido com sucesso!');
        navigation.navigate('ManangerClients');
      } else {
        Alert.alert('Erro', 'Não foi possível remover o vínculo.');
      }
    } catch (error) {
      console.error('Error removing client:', error);
      Alert.alert('Erro', 'Não foi possível remover o vínculo.');
    }
  }

  return (
    <Layout navigation={navigation}>
      <Box flex={1} bg="gray.50">
        {/* Perfil */}
        <Box bg="white" alignItems="center" pt={8} pb={6} shadow={1}>
          <Box position="relative" alignItems="center">
            <Avatar
              size="2xl"
              source={{ uri: 'https://example.com/profile.jpg' }}
              bg="indigo.100"
              borderWidth={2}
              borderColor="indigo.100"
            >
              JD
            </Avatar>
            <Text fontSize="2xl" fontWeight="bold" mt={4} textAlign="center">
              {userDetails?.name}
            </Text>
          </Box>
        </Box>

        <Box mt={6} mx={4}>
          <Box bg="white" borderRadius="lg" overflow="hidden" shadow={1}>
            {user?.user_profile === 3 ? (
              <SettingsItem
                icon={<Icon as={MaterialIcons} name="person-add" color="indigo.600" size="lg" />}
                text="Adicionar Nova Dieta"
                onPress={() => navigation.navigate('CreateDiet', { id })}
              />
            ) : (
              <SettingsItem
                icon={<Icon as={MaterialIcons} name="person-add" color="indigo.600" size="lg" />}
                text="Adicionar Novo Treino"
                onPress={() => navigation.navigate('CreateWorkout', { id })}
              />
            )}
            <SettingsItem
              icon={<Icon as={MaterialIcons} name="delete" color="red.600" size="lg" />}
              text="Remover Aluno"
              onPress={removeClient}
            />
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
