import { Layout } from '@/components/layout';
import { NavigationProps } from '@/interfaces/navigation';
import {
  Box,
  HStack,
  Input,
  Button,
  Text,
  Icon,
  Avatar,
  VStack,
  Spinner,
  useToast,
  Pressable,
} from 'native-base';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/auth';
import routes from '@/api/api';
import { ChatMessages, ChatNameOtherPerson } from '@/interfaces/chat';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { formatedDateBr } from '@/utils';
import { ScrollView } from 'react-native';

function ViewChat({ navigation, route }: NavigationProps) {
  const { chat_id } = route.params;
  const context = useAuth();
  const user = context?.user;
  const [messages, setMessages] = useState<ChatMessages[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const toast = useToast();
  const scrollViewRef = useRef<ScrollView>(null);
  const [nameOtherPerson, setNameOtherPerson] = useState<ChatNameOtherPerson | null>(null);

  const fetchMessages = async () => {
    try {
      const response = await routes.getMessages(chat_id);
      setMessages(response.data.data);
    } catch (error) {
      showError('Erro ao carregar mensagens');
    } finally {
      setLoading(false);
    }
  };

  async function fetchNameOtherPerson() {
    try {
      const response = await routes.getNameOtherPerson(chat_id);
      setNameOtherPerson(response.data.data);
      
    } catch (error) {
      showError('Erro ao carregar nome do outro usuário');
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      await routes.sendMessage({
        chat_id,
        content: newMessage,
        image_urls: [],
      });

      setNewMessage('');
      await fetchMessages();
    } catch (error) {
      showError('Erro ao enviar mensagem');
    } finally {
      setIsSending(false);
    }
  };

  const showError = (message: string) => {
    toast.show({
      description: message,
      bg: 'red.500',
      placement: 'top',
    });
  };

  useEffect(() => {
    console.log('chat_id', chat_id);
    fetchNameOtherPerson();
    fetchMessages();
  }, [chat_id]);

  if (loading) {
    return (
      <Layout navigation={navigation}>
        <Box flex={1} justifyContent="center" alignItems="center">
          <Spinner size="lg" color="primary.600" />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout navigation={navigation}>
      <Box flex={1} bg="gray.50">
        <Box bg="white" p={4} borderBottomWidth={1} borderBottomColor="gray.200" bgColor="gray.100">
          <HStack alignItems="center" space={2}>
            <Pressable onPress={() => navigation.goBack()}>
              <Icon as={<Ionicons name="arrow-back" />} size={6} color="indigo.600" />
            </Pressable>
            {route.params?.image_url ? (
              <Avatar source={{ uri: route.params.image_url }} size="sm" />
            ) : (
              <Icon as={<Ionicons name="person-circle-outline" />} size={8} color="indigo.600" />
            )}
            <VStack>
              <Text fontSize="md" fontWeight="bold">
                {nameOtherPerson?.other_user_name || route.params?.other_person_name || ''}
              </Text>
            </VStack>
          </HStack>
        </Box>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ padding: 16 }}
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }}
        >
          <VStack space={3} p={4}>
            {messages.map((item) => (
              <Box
                key={item.chat_message}
                alignSelf={item.sender_name === user?.name ? 'flex-end' : 'flex-start'}
                bg={item.sender_name === user?.name ? 'indigo.100' : 'white'}
                borderRadius="xl"
                p={3}
                maxWidth="80%"
                shadow={1}
              >
                <Text fontSize="md" color="gray.800">
                  {item.content}
                </Text>
                <HStack justifyContent="space-between" mt={1}>
                  <Text fontSize="xs" color="gray.500">
                    {formatedDateBr(item.send_date)}
                  </Text>
                </HStack>
              </Box>
            ))}
          </VStack>
        </ScrollView>

        <HStack
          space={2}
          p={3}
          bg="white"
          borderTopWidth={1}
          borderTopColor="gray.200"
          alignItems="center"
        >
          <Input
            flex={1}
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChangeText={setNewMessage}
            variant="filled"
            bg="gray.100"
            _focus={{ bg: 'gray.100' }}
            onSubmitEditing={sendMessage}
            multiline
            fontSize="md"
          />

          <Button
            onPress={sendMessage}
            borderRadius="full"
            px={4}
            bg="indigo.600"
            _pressed={{ bg: 'indigo.600' }}
            isLoading={isSending}
            isDisabled={!newMessage.trim()}
          >
            <Icon as={<MaterialIcons name="send" />} size={5} color="white" />
          </Button>
        </HStack>
      </Box>
    </Layout>
  );
}

export default ViewChat;
