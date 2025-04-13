import React, { useState } from 'react';
import { Alert, Image, TouchableOpacity } from 'react-native';
import { Input, Button, Text, VStack, Icon, HStack, Box, IconButton } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; 
interface PostProps {
    user: string; 
}

export const PostComponent = ({ user }: PostProps) => {
    const [text, setText] = useState<string>(''); 
    const [imageUri, setImageUri] = useState<string | null>(null); 
    const [likes, setLikes] = useState<number>(0); 

   
    const handleLike = () => {
        setLikes(likes + 1);
    };

    const handleChooseImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Erro", "É necessário permitir o acesso à galeria.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (result.canceled) {
            console.log('O usuário cancelou a escolha da imagem');
        } else if (result.assets && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
        }
    };

    // Função para submeter a publicação
    const handleSubmit = () => {
        if (!text && !imageUri) {
            Alert.alert("Erro", "Adicione um texto ou imagem para a publicação.");
            return;
        }

        // Aqui você pode enviar a publicação para o servidor, por exemplo.
        Alert.alert("Sucesso", "Publicação realizada!");
        setText('');
        setImageUri(null);
    };

    return (
        <Box p={4} bg="white" mb={4} shadow={2} borderRadius={8}>
            <VStack space={3}>
                <Text fontSize="lg" fontWeight="bold">{user}</Text>

                {/* Campo para digitar o texto da publicação */}
                <Input
                    variant="outline"
                    placeholder="Escreva algo..."
                    value={text}
                    onChangeText={setText}
                    multiline
                    numberOfLines={4}
                    size="md"
                />

                {/* Exibe a imagem se houver */}
                {imageUri && (
                    <Image
                        source={{ uri: imageUri }}
                        style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 10 }}
                    />
                )}

                <Button
                    variant="outline"
                    colorScheme="indigo"
                    onPress={handleChooseImage}
                >
                    <IconButton mb="4" variant="solid" bg="red.500" colorScheme="red" borderRadius="full" icon={<Icon as={MaterialIcons} size="6" name="photo-library" _dark={{
                        color: "warmGray.50"
                      }} color="warmGray.50" />} />
                    Adicionar Imagem
                </Button>

                
                <HStack justifyContent="space-between" alignItems="center" mt={3}>
                    {/* Botão de curtir */}
                    <TouchableOpacity onPress={handleLike}>
                        <HStack space={2} alignItems="center">
                            <Icon as={<Text>❤️</Text>} color="red.500" />
                            <Text>{likes} Curtidas</Text>
                        </HStack>
                    </TouchableOpacity>

                    {/* Botão para submeter a publicação */}
                    <Button
                        variant="solid"
                        colorScheme="indigo"
                        onPress={handleSubmit}
                    >
                        Publicar
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
};
