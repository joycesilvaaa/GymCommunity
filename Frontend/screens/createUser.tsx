import { FormCreate } from '@/components/forms/formCreate';
import { NavigationProp } from '@react-navigation/native';
import { Button, View, Text, Icon, Center, VStack } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
type InitialProps = {
  navigation: NavigationProp<any>;
};

export function CreateUser({ navigation }: InitialProps) {
  return (
    <View flex={1} margin={5} padding={1}>
      <Center justifyContent="center">
        <Icon as={<MaterialIcons name="fitness-center" />} size={90} color="indigo.600" />
        <Text fontSize="xl" color="indigo.600" fontWeight="bold">
          GYMCommunity
        </Text>
      </Center>
      <FormCreate type="cliente" navigation={navigation} />
    </View>
  );
}
