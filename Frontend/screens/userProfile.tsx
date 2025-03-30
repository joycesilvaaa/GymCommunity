import { Layout } from '@/components/layout';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { Box, Text, Icon, View, Center } from 'native-base';
import { Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import routes from '@/api/api';
import { IUserDetails } from '@/interfaces/user';

type UserProfileProps = {
  navigation: NavigationProp<any>;
  route: any;
};

export function UserProfile({ navigation, route }: UserProfileProps) {
  const id = route.params?.id;
  const context = useAuth();
  const user = context.user;
  const previousRoute = navigation.getState()?.routes[navigation.getState().index - 1]?.name;
  const [typeView, setTypeView] = useState<string>('default');
  const [userProfile, setUserProfile] = useState<IUserDetails| null>(null);

  useEffect(() => {
    if (previousRoute === 'ExpiringDiet' || previousRoute === 'ManangerClients') {
      setTypeView('expiring');
    } else {
      setTypeView('default');
    }
  }, [previousRoute]);
  
  useEffect(() => {
    getUser();
  }, [route]);

  async function getUser() {
    try {
      const response = await routes.userDetails(id);
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }}

  function handleLogout() {
    context.logout();
  };

  function handleViewDiet() {
    if (userProfile?.user_diets_id) {
      navigation.navigate('ViewDiets', { id: userProfile.user_diets_id });
    } else {
      alert('Você não possui nenhuma dieta atual.');
    }
  }
  function handleViewWorkout() {
    if (userProfile?.user_diets_id) {
      navigation.navigate('ViewWorkout', { id: userProfile.user_training_id });
    } else {
      alert('Você não possui nenhum treino atual.');
    }
  }

  return (
    <Layout navigation={navigation}>
      <View flexDirection="row" justifyContent="space-between">
        <Box alignItems="center" padding={2} flex={0.5}>
          <Box width={90} height={90} borderRadius={75} backgroundColor="gray.200" justifyContent="center" alignItems="center">
            <Icon as={MaterialIcons} name="person" size="4xl" color="indigo.500" />
          </Box>
          <Text fontSize="lg" fontWeight="bold" mt={2}>{userProfile?.name}</Text>
          {typeView === 'default' && user?.user_profile === 1 && (
            <Pressable onPress={handleLogout}>
              <Box mt={4} p={2} borderWidth={1} borderColor="gray.300" borderRadius={10} backgroundColor="white" shadow={3} flexDirection="row" alignItems="center" justifyContent="center">
                <Icon as={MaterialIcons} name="logout" size="md" color="red.500" mr={2} />
                <Text color="red.500" fontWeight="bold" fontSize="md">Logout</Text>
              </Box>
            </Pressable>
          )}
        </Box>
        <View padding={2} flex={0.5}>
          {typeView === 'expiring' ? (
            <>
              {user?.user_profile === 3 ? (
                <Pressable onPress={() => navigation.navigate("CreateDiet")}>
                  <Box mt={4} p={4} borderWidth={1} borderColor="gray.300" borderRadius={10} backgroundColor="white" shadow={3} flexDirection="row" alignItems="center">
                    <Icon as={MaterialIcons} name="folder" size="lg" color="gray.400" mr={3} />
                    <Text color="gray.400" fontWeight="bold" fontSize="md">Nova Dieta</Text>
                  </Box>
                </Pressable>
              ) : (
                <Pressable onPress={() => navigation.navigate("CreateDiet")}>
                  <Box mt={4} p={4} borderWidth={1} borderColor="gray.300" borderRadius={10} backgroundColor="white" shadow={3} flexDirection="row" alignItems="center">
                    <Icon as={MaterialIcons} name="folder" size="lg" color="gray.400" mr={3} />
                    <Text color="gray.400" fontWeight="bold" fontSize="md">Novo Treino</Text>
                  </Box>
                </Pressable>
              )}
              <Pressable onPress={() => console.log('Remover vínculo de cliente')}>
                <Box mt={4} p={4} borderWidth={1} borderColor="gray.300" borderRadius={10} backgroundColor="white" shadow={3} flexDirection="row" alignItems="center">
                  <Icon as={MaterialIcons} name="delete" size="lg" color="red.500" mr={3} />
                  <Text color="red.500" fontSize="sm">Remover Aluno</Text>
                </Box>
              </Pressable>
            </>
          ):(
            <>
            <Pressable onPress={handleViewDiet}>
            <Box mt={4} p={4} borderWidth={1} borderColor="gray.300" borderRadius={10} backgroundColor="white" shadow={3} flexDirection="row" alignItems="center">
              <Icon as={MaterialIcons} name="folder" size="lg" color="gray.400" mr={3} />
              <Text color="gray.400" fontWeight="bold" fontSize="md">Dieta</Text>
            </Box>
          </Pressable>
            <Pressable onPress={handleViewWorkout}>
            <Box mt={4} p={4} borderWidth={1} borderColor="gray.300" borderRadius={10} backgroundColor="white" shadow={3} flexDirection="row" alignItems="center">
              <Icon as={MaterialIcons} name="folder" size="lg" color="gray.400" mr={3} />
              <Text color="gray.400" fontWeight="bold" fontSize="md">Treino</Text>
            </Box>
          </Pressable>
            </>
          )}
          
        </View>
      </View>
      <View padding={2} flex={1} margin={2}>
        {/* Espaço reservado para publicação ou outra funcionalidade futura */}
      </View>
    </Layout>
  );
}
