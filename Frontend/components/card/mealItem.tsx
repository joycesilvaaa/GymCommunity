import { Box, Text, HStack, Pressable, Icon } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
interface Meal {
    name: string;
    options: string[];
}

interface MealItemProps {
    meal: Meal;
    navigation: NavigationProp<any>;
}

export function MealItem({ meal, navigation }: MealItemProps) {
    return (
            <Box
            bg="white"
            shadow={2}
            rounded="md"
            overflow="hidden"
            margin={2}
            >
            <Box>
            <Box p={2} bg="indigo.600">
            <Text bold color="white" fontSize="lg">{meal.name}</Text>
            </Box>
            <Box p={2}>
            <Box ></Box>
                {meal.options.map((option, index) => (
                    <HStack key={index} alignItems="center" mt={1}>
                        <Icon as={MaterialCommunityIcons} name="food-apple" size="sm" color="indigo.600" />
                        <Text ml={2} color="gray.700">{option}</Text>
                    </HStack>
                ))}
            </Box>
            </Box>
            </Box>

    );
}
