import { NavigationProp } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { Box, Image, Text } from 'native-base';

type UserConfigProps = {
  navigation: NavigationProp<any>;
};


export function UserProfile({ navigation }: UserConfigProps) {
    return (
        <ScrollView>
            <Box alignItems="center" padding={5} borderBottomWidth={1} borderBottomColor="#ccc">
                <Image
                    width={100}
                    height={100}
                    borderRadius={50}
                    source={{ uri: 'https://example.com/profile.jpg' }}
                    alt="Profile Image"
                />
                <Text fontSize="lg" fontWeight="bold" mt={2}>Username</Text>
                <Text fontSize="sm" color="gray.500" textAlign="center" mt={1}>This is the user bio</Text>
            </Box>
            <Box padding={5}>
                {/* Render user tweets here */}
                <Text mt={2}>This is a tweet</Text>
                <Text mt={2}>This is another tweet</Text>
            </Box>
        </ScrollView>
    );
}


