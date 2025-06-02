import { useEffect, useState } from 'react';
import { View, Text, VStack, HStack, Avatar, Spinner, Icon, Center } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Layout } from '@/components/layout';
import { NavigationProps } from '@/interfaces/navigation';
import routes from '@/api/api';

interface RankingUser {
  id: number;
  name: string;
  points: number;
}

function UserPoints({ navigation }: NavigationProps) {
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRanking();
  }, []);

  async function fetchRanking() {
    try {
      const response = await routes.userPoints();
      if (Array.isArray(response.data.data)) {
        setRanking(response.data.data);
      } else {
        console.error('Dados inválidos:', response.data.data);
        setRanking([]);
      }
    } catch (error) {
      console.error('Erro ao buscar ranking:', error);
      setRanking([]);
    } finally {
      setLoading(false);
    }
  }

  return (
<Layout navigation={navigation}>
  <VStack space={6} px={4} py={8} flex={1} mx={4} bg="white">
    <Text fontSize="3xl" fontWeight="extrabold" textAlign="center" color="indigo.500" mb={6}>
      🏆 Ranking de Pontos
    </Text>

    {loading ? (
      <Center flex={1}>
        <Spinner size="lg" color="primary.500" />
      </Center>
    ) : (
      Array.isArray(ranking) && ranking.map((user, index) => (
        <HStack
          key={user.id}
          alignItems="center"
          justifyContent="space-between"
          bg={index < 3 ? `${['indigo.300', 'indigo.200', 'indigo.100'][index]}` : 'gray.50'}
          p={5}
          rounded="2xl"
          space={3}
          borderWidth={1}
          borderColor="gray.100"
          shadow={index < 3 ? 3 : 0}
        >
          <HStack alignItems="center" space={4} flex={1}>
            <Avatar 
              bg="indigo.500" 
              size="md"
            >
              {index < 3 ? (
                <Icon as={<MaterialIcons name="stars" />} color="white" size="sm" />
              ) : (
                <Text color="white" fontWeight="bold">
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              )}
            </Avatar>
            
            <VStack flex={1}>
              <Text 
                fontSize="lg" 
                fontWeight="semibold"
                numberOfLines={1}
                color={index < 3 ? 'indigo.700' : 'indigo.700'}
              >
                {user.name}
              </Text>
              <Text fontSize="xs" color={index < 3 ? 'gray.500' : 'gray.400'}>
                #{index + 1} no ranking
              </Text>
            </VStack>
          </HStack>

          {/* Pontos */}
          <VStack alignItems="flex-end">
            <Text 
              fontSize="xl" 
              fontWeight="black" 
              color={index < 3 ? 'indigo.600' : 'gray.600'}
            >
              {user.points}
            </Text>
            <Text fontSize="xs" color="gray.500">
              pontos
            </Text>
          </VStack>
        </HStack>
      ))
    )}
  </VStack>
</Layout>
  );
}

export default UserPoints;