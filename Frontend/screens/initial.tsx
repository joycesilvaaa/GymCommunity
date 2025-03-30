import { Button, View, Text, Icon, Center, VStack } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';

type InitialProps = {
  navigation: NavigationProp<any>;
};

export function Initial({ navigation }: InitialProps) {
  return (
    <View flex={1} margin={5} padding={1}>
      <Center justifyContent="center" flex={1}>
        <Icon
          as={<MaterialIcons name="fitness-center" />}
          size={100}
          color="indigo.600"
        />
        <Text fontSize="xl" color="indigo.600" fontWeight="bold">
          GYMCommunity
        </Text>
      </Center>
      <Center flex={1} justifyContent="flex-end">
        <VStack space={1} w="80%">
          <Button
            variant={'solid'}
            colorScheme={'indigo'}
            onPress={() => navigation.navigate('Login')}
          >
            Login
          </Button>
          <Button variant={'outline'} colorScheme={'indigo'} onPress={() => navigation.navigate('CreateUser')}>
            Cadastre-se
          </Button>
          <View height={0.25} bg="gray.300" my={1} />
          <Center>
            <Text
              color="indigo.600"
              textDecorationLine="underline"
              onPress={() => navigation.navigate('CreateProfissional')}
            >
              Registre-se como Profissional
            </Text>
          </Center>
        </VStack>
      </Center>
    </View>
  );
}
