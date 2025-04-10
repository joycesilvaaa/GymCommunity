import { Layout } from '@/components/layout';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { Box, Text, Icon, View, Center, Avatar, Button, Badge, HStack, VStack, useColorModeValue } from 'native-base';
import { Pressable, Alert } from 'react-native';
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

  const previousRoute = navigation.getState()?.routes[navigation.getState().index - 1]?.name;
  const [typeView, setTypeView] = useState<string>('default');
  const [userProfile, setUserProfile] = useState<IUserDetails | null>(null);
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  useEffect(() => {
    if (previousRoute === 'ExpiringDiet' || previousRoute === 'ManangerClients') {
      setTypeView('expiring');
      getUser()
    } else {
      setTypeView('default');
    }
  }, [previousRoute]);
  
  useEffect(() => {
    getUser();
  }, [route]);

  async function removeClient() {
    try{
      const response = await routes.removeClient(id);
      if (response.status === 200) {
        Alert.alert('Sucesso', 'Vínculo removido com sucesso!');
        navigation.navigate('ManangerClients');
      } else {
        Alert.alert('Erro', 'Não foi possível remover o vínculo.');
      }
    }catch (error) {
      console.error('Error removing client:', error);
      Alert.alert('Erro', 'Não foi possível remover o vínculo.');
    }
  }
  
  async function getUser() {
    try {
      const response = await routes.userDetails(typeView === 'expiring' ? id );
     
      setUserProfile(response.data.data);
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
      Alert.alert('Atenção', 'Você não possui nenhuma dieta atual.');
    }
  }
  function handleViewWorkout() {
    if (userProfile?.user_diets_id) {
      navigation.navigate('ViewWorkout', { id: userProfile.user_training_id });
    } else {
      Alert.alert('Atenção', 'Você não possui nenhum treino atual.');
    }
  }
  // ... (manter useEffect e funções existentes)

  return (
    <Layout navigation={navigation}>
      <View flex={1} p={4} bg={useColorModeValue('gray.50', 'gray.900')}>
        {/* Profile Header */}
        <Center>
          <Avatar 
            bg="indigo.500" 
            size="2xl" 
            source={{ uri: 'https://example.com/placeholder-avatar' }} // Substituir por URL real
            borderWidth={2}
            borderColor="indigo.100"
          >
            <Text fontSize="4xl" color="white">
              {userProfile?.name?.[0]?.toUpperCase()}
            </Text>
          </Avatar>
          
          <Text fontSize="2xl" fontWeight="bold" mt={4} color={textColor}>
            {userProfile?.name}
          </Text>
          
          <HStack space={2} mt={2}>
            <Badge colorScheme="indigo" rounded="full" px={3} py={1}>
              <Text fontWeight="bold">ID: {userProfile?.user_id}</Text>
            </Badge>
          </HStack>
        </Center>

        {/* Content Section */}
        <VStack space={4} mt={8}>
          {typeView === 'expiring' ? (
            <ProfessionalSection 
              navigation={navigation} 
              user={user} 
              onRemove={removeClient} 
            />
          ) : (
            <ClientSection 
              onViewDiet={handleViewDiet}
              onViewWorkout={handleViewWorkout}
              onLogout={handleLogout}
              hasDiet={!!userProfile?.user_diets_id}
              hasWorkout={!!userProfile?.user_training_id}
            />
          )}
        </VStack>
      </View>
    </Layout>
  );
}

// Componentes Auxiliares
const ProfessionalSection = ({ navigation, user, onRemove }: any) => (
  <>
    <ActionButton
      icon="addfile"
      title={user?.user_profile === 3 ? 'Criar Nova Dieta' : 'Criar Novo Treino'}
      colorScheme="indigo"
      onPress={() => navigation.navigate("CreateDiet")}
    />

    <ActionButton
      icon="delete"
      title="Remover Aluno"
      colorScheme="red"
      variant="outline"
      onPress={onRemove}
    />
  </>
);

const ClientSection = ({ onViewDiet, onViewWorkout, onLogout, hasDiet, hasWorkout }: any) => (
  <>
    <VStack space={4}>
      <PlanCard 
        icon="book"
        title="Dieta"
        status={hasDiet ? 'Ativa' : 'Não Ativa'}
        statusColor={hasDiet ? 'green' : 'red'}
        onPress={onViewDiet}
      />

      <PlanCard 
        icon="table"
        title="Treino"
        status={hasWorkout ? 'Ativo' : 'Não Ativo'}
        statusColor={hasWorkout ? 'green' : 'red'}
        onPress={onViewWorkout}
      />
    </VStack>

    <Button 
      mt={8}
      leftIcon={<Icon as={AntDesign} name="logout" />}
      colorScheme="gray"
      variant="ghost"
      onPress={onLogout}
    >
      Sair da Conta
    </Button>
  </>
);

const PlanCard = ({ icon, title, status, statusColor, onPress }: any) => (
  <Pressable onPress={onPress}>
    <View bg={useColorModeValue('white', 'gray.700')} p={4} borderRadius="xl" shadow={1}>
      <HStack alignItems="center" space={4}>
        <Icon as={AntDesign} name={icon} size="2xl" color="indigo.500" />
        
        <VStack flex={1}>
          <Text fontSize="lg" fontWeight="semibold">{title}</Text>
          <HStack alignItems="center">
            <Box w={2} h={2} bg={`${statusColor}.500`} rounded="full" mr={2} />
            <Text color={`${statusColor}.500`} fontSize="sm">{status}</Text>
          </HStack>
        </VStack>
        
        <Icon as={AntDesign} name="right" size="md" color="gray.400" />
      </HStack>
    </View>
  </Pressable>
);

const ActionButton = ({ icon, title, colorScheme, variant = 'solid', onPress }: any) => (
  <Button
    leftIcon={<Icon as={AntDesign} name={icon} />}
    colorScheme={colorScheme}
    variant={variant}
    _text={{ fontWeight: 'bold' }}
    py={3}
    borderRadius="lg"
    onPress={onPress}
  >
    {title}
  </Button>
);