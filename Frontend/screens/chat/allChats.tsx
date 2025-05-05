import { Text, View } from 'react-native';
import { Icon, VStack, Box } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import { Layout } from '@/components/layout';
import { NavigationProps } from '@/interfaces/navigation';
import { ChatItem } from '@/components/card/chatsItem';
import { Chats, SugestionChat } from '@/interfaces/chat';
import SugestionItem from '@/components/card/sugestion';
import routes from '@/api/api';
import { useAuth } from '@/hooks/auth';
import { User } from '@/interfaces/user';

function AllChats({ navigation }: NavigationProps) {
  const context = useAuth()
  const user = context?.user as User;
  const [chats, setChats] = useState<Chats[]>([]);
  const [sugestions, setSuggestions] = useState<SugestionChat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchChats();
      fetchSuggestions();
    });

    return unsubscribe;
  }, [navigation]);

  async function createConversation(user_id: number) {
    try {
      const response = await routes.createConversation(user_id);
      if (response.status === 200) {
        console.log('Conversa criada com sucesso!');
        navigation.navigate('ViewChat', { chat_id: response.data.data.chat_id });
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  }

  async function fetchChats() {
    try {
      const response = await routes.allChats(); 
      setChats(response.data.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSuggestions() {
    try {
      const response = await routes.allSugestions(); 
      setSuggestions(response.data.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  }
  if (loading) {
    return (
      <Layout navigation={navigation}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#888' }}>Carregando...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout navigation={navigation}>
      <VStack flex={1} bg="gray.50">
        <Text 
          style={{
            fontSize: 20, 
            fontWeight: '700',
            color: '#4A5568', 
            paddingHorizontal: 16, 
            paddingTop: 16, 
            paddingBottom: 8, 
          }}
        >
          Suas Conversas
        </Text>
        
        {chats?.length > 0 ? (
          chats.map((chat) => (
            <ChatItem
              key={chat.chat_id}
              navigation={navigation}
              chat_id={chat.chat_id}
              other_person_name={chat.other_person_name}
              last_message={chat.last_message}
              image_url={chat.image_url}
            />
          ))
        ) : (
          <Box 
            bg="white" 
            mx={4} 
            my={2} 
            p={6} 
            borderRadius={12}
            alignItems="center"
          >
            <Icon
              as={<MaterialIcons name="forum" />}
              size={8}
              color="gray.400"
              mb={3}
            />
            <Text 
              style={{ textAlign: 'center', color: 'gray.500', fontSize: 15 }}
            >
              Nenhuma conversa ativa.{"\n"}
              Inicie uma nova conversa abaixo!
            </Text>
          </Box>
        )}

        {/* Seção de Sugestões */}
        <Text 
          style={{
            fontSize: 20, // Corresponding to "xl"
            fontWeight: '700',
            color: '#4A5568', // Corresponding to "gray.800"
            paddingHorizontal: 16, // px={4}
            paddingTop: 24, // pt={6}
            paddingBottom: 8, // pb={2}
          }}
        >
          Sugestões
        </Text>
        
        {sugestions?.length > 0 ? (
          sugestions.map((sugestion) => (
            <SugestionItem
              key={sugestion.user_id}
              navigation={navigation}
              user_id={sugestion.user_id}
              other_person_name={sugestion.other_person_name}
              image_url={sugestion.image_url}
              create_conversation={() => createConversation(sugestion.user_id)}
            />
          ))
        ) : (
          <Box 
            bg="white" 
            mx={4} 
            my={2} 
            p={6} 
            borderRadius={12}
            alignItems="center"
          >
            <Icon
              as={<MaterialIcons name="group" />}
              size={8}
              color="gray.400"
              mb={3}
            />
            <Text 
              style={{ textAlign: 'center', color: 'gray.500', fontSize: 15 }}
            >
              Novas sugestões em breve!{"\n"}
              Continue interagindo para ver mais.
            </Text>
          </Box>
        )}
      </VStack>
    </Layout>
  );
}

export default AllChats;
