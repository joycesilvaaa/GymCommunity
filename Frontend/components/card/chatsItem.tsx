import { View, Text, Image, Pressable } from "react-native";
import { Box, HStack, Icon, VStack } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { Chats } from "@/interfaces/chat";

export function ChatItem({navigation, chat_id, other_person_name, last_message, image_url}: Chats) {
    return (
        <Pressable onPress={() => navigation.navigate("ViewChat", { chat_id })}>
            <HStack space={4} alignItems="center" padding={4} borderBottomWidth={1} borderBottomColor="coolGray.200">
                {image_url ? (
                    <Box
                        width={10}
                        height={10}
                        borderRadius="full"
                        overflow="hidden"
                        backgroundColor="coolGray.200"
                    >
                        <Image
                            source={{ uri: image_url }}
                            style={{ width: "100%", height: "100%" }}
                        />
                    </Box>
                ) : (
                    <Icon as={<MaterialIcons name="person" />} size={10} color="indigo.600" />
                )}
                <VStack>
                    <Text>{other_person_name}</Text>
                    {last_message ? (
                        <Text style={{ color: "gray.500" }}>{last_message}</Text>
                    ) : (
                        <Text style={{ color: "gray.500" }}>Sem mensagens. Comece a conversa!</Text>
                    )}
                </VStack>
            </HStack>
        </Pressable>
    );
}

