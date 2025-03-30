import React from 'react';
import { Box, Text, Center, HStack, Pressable, Icon } from 'native-base';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
type MenuProps = {
  navigation: NavigationProp<any>;
};
export function MenuFooter({ navigation }: MenuProps) {
  const [selected, setSelected] = React.useState(1);

  return (
    <Box justifyContent="flex-end">
      <HStack bg="indigo.600" alignItems="center" safeAreaBottom shadow={6}>
        <Pressable
          opacity={selected === 0 ? 1 : 0.5}
          py="3"
          flex={1}
          onPress={() => {
            setSelected(0);
            navigation.navigate('Home');
          }}
        >
          <Center>
            <Icon
              mb="1"
              as={<MaterialCommunityIcons name={selected === 0 ? 'home' : 'home-outline'} />}
              color="white"
              size="lg"
            />
          </Center>
        </Pressable>

        <Pressable
          opacity={selected === 2 ? 1 : 0.5}
          py="3"
          flex={1}
          onPress={() => {
            setSelected(2);
          }}
        >
          <Center>
            <Icon
              mb="1"
              as={
                <MaterialCommunityIcons name={selected === 2 ? 'timeline' : 'timeline-outline'} />
              }
              color="white"
              size="lg"
            />
          </Center>
        </Pressable>

        <Pressable
          opacity={selected === 3 ? 1 : 0.5}
          py="3"
          flex={1}
          onPress={() => {
            setSelected(3);
            navigation.navigate('UserProfile');
          }}
        >
          <Center>
            <Icon
              mb="1"
              as={<MaterialCommunityIcons name={selected === 3 ? 'account' : 'account-outline'} />}
              color="white"
              size="lg"
            />
          </Center>
        </Pressable>
      </HStack>
    </Box>
  );
}
