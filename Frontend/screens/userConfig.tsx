// screens/UserConfig.tsx
import { NavigationProp } from '@react-navigation/native';
import { Box, Text, Avatar, Icon } from 'native-base';
import { MaterialIcons, AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { Layout } from '@/components/layout';
import { SettingsItem } from '@/components/settingsItem';
import { CustomNavigationProp } from '@/interfaces/navigation';
import { useState } from 'react';
import { User } from '@/interfaces/user';
import { useAuth } from '@/hooks/auth';


export function UserConfig({ navigation }: CustomNavigationProp) {
    const context = useAuth();
    const user = context.user ?? { name: 'Guest', email: 'guest@example.com' };
    

    
    return (
        <Layout navigation={navigation}>
            <Box flex={1} bg="gray.50">
                {/* Perfil */}
                <Box bg="white" alignItems="center" pt={8} pb={6} shadow={1}>
                    <Box position="relative" alignItems="center">
                        <Avatar
                            size="2xl"
                            source={{ uri: 'https://example.com/profile.jpg' }}
                            bg="indigo.100"
                            borderWidth={2}
                            borderColor="indigo.100"
                        >
                            JD
                            <Avatar.Badge
                                bg="indigo.500"
                                borderWidth={0}
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Icon as={Feather} name="edit-2" size={3} color="white" />
                            </Avatar.Badge>
                        </Avatar>
                        <Text fontSize="2xl" fontWeight="bold" mt={4} textAlign="center">
                            {user.name}
                        </Text>
                        <Text fontSize="sm" color="gray.500" mt={1} textAlign="center">
                            {user.email}
                        </Text>
                    </Box>
                </Box>

                {/* Seções de Configurações */}
                <Box mt={6} mx={4}>
                    <Box bg="white" borderRadius="lg" overflow="hidden" shadow={1}>
                        <SettingsItem icon={<Icon as={MaterialIcons} name="person" color="indigo.600" />} text="Editar Perfil" onPress={() => navigation.navigate('EditProfile')} />
                        <SettingsItem icon={<Icon as={MaterialIcons} name="lock" color="indigo.600" />} text="Gerenciar Permissões" onPress={() => navigation.navigate('Security')} />
                        
                    </Box>

                    <Box bg="white" mt={4} borderRadius="lg" overflow="hidden" shadow={1}>
                        <SettingsItem icon={<Icon as={Feather} name="moon" color="indigo.600" />} text="Modo Noturno" onPress={() => navigation.navigate('Appearance')} hasSwitch />
                        <SettingsItem icon
                        ={<Icon as={Feather} name="bell" color="indigo.600" />} text="Notificações" onPress={() => {}} hasSwitch />
                    </Box>

                    <Box bg="white" mt={4} borderRadius="lg" overflow="hidden" shadow={1}>
                        <SettingsItem icon={<Icon as={MaterialIcons} name="delete-outline" color="red.600" />} text="Excluir Conta" onPress={() => console.log('Excluir Conta')} isDestructive />
                        <SettingsItem icon={<Icon as={AntDesign} name="logout" color="red.600" />} text="Sair da Conta" onPress={() => console.log('Sair da Conta')} isDestructive isLast />
                    </Box>

                    <Box alignItems="center" mt={8} pb={8}>
                        <Text fontSize="xs" color="gray.400"> © 2025 GymCommunity</Text>
                    </Box>
                </Box>
            </Box>
        </Layout>
    );
}
