import React, { useContext, useEffect, useState } from 'react';
import { Center, Input, Stack, View, Button, Icon, Pressable, Text, VStack } from 'native-base';
import { Alert, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { AuthContext } from '@/context/auth';
import { Home } from './home';
type InitialProps = {
  navigation: NavigationProp<any>;
};

export function Login({ navigation }: InitialProps) {
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [show, setShow] = useState<boolean>(false);


  async function login() {
    if (!isValidEmail(email)) {
      Alert.alert('Erro', 'O e-mail informado é inválido.');
      return;
    }
    await authContext.login({ username: email, password: password });
  }

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  return (
    <>
    <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
    <View flex={1} margin={4} padding={1}>
      <Center justifyContent="center" flex={1}>
        <Icon as={<MaterialIcons name="fitness-center" />} size={90} color="indigo.600" />
        <Text fontSize="xl" color="indigo.600" fontWeight="bold">
          GYMCommunity
        </Text>
        <VStack space={2} w="80%" marginTop={10}>
          <Text color="indigo.600" fontWeight={'bold'}>
            Login
          </Text>
          <Input
            InputLeftElement={
              <Icon as={<MaterialIcons name="person" />} size={5} ml="2" color="indigo.600" />
            }
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Input
            type={show ? 'text' : 'password'}
            InputRightElement={
              <Pressable onPress={() => setShow(!show)}>
                <Icon
                  as={<MaterialIcons name={show ? 'visibility' : 'visibility-off'} />}
                  size={5}
                  mr="2"
                  color="indigo.600"
                />
              </Pressable>
            }
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <Button onPress={() => login()} colorScheme="indigo">
            Entrar
          </Button>
          <Button
            variant={'outline'}
            colorScheme={'indigo'}
            onPress={() => navigation.navigate('initial')}
          >
            Voltar
          </Button>
        </VStack>
      </Center>
    </View>
    </>
  );
}
