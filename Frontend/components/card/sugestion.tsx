import { NavigationProps } from '@/interfaces/navigation';
import { Layout } from '../layout';
import { Text, Box, Button } from 'native-base';
import { SugestionItemProps } from '@/interfaces/chat';
import { HStack, VStack, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'react-native';

function SugestionItem({ navigation, image_url, other_person_name, user_id, create_conversation }: SugestionItemProps) {
  return (

      <HStack
        space={4}
        alignItems="center"
        padding={4}
        borderBottomWidth={1}
        borderBottomColor="coolGray.200"

      >
        {image_url ? (
          <Box
            width={10}
            height={10}
            borderRadius="full"
            overflow="hidden"
            backgroundColor="coolGray.200"
          >
            <Image source={{ uri: image_url }} style={{ width: '100%', height: '100%' }} />
          </Box>
        ) : (
          <>
          <Icon as={<MaterialIcons name="person" />} size={10} color="indigo.600" />
          <Text>{other_person_name}</Text>
          </>
        )}
        <HStack flex={1} alignItems="center" justifyContent="space-between"></HStack>
          <Button onPress={() => create_conversation(user_id)} colorScheme="indigo" size="sm">
            Iniciar Conversa
          </Button>
        </HStack>
  );
}

export default SugestionItem;