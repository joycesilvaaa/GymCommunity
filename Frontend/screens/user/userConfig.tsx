// screens/UserConfig.tsx
import { NavigationProp } from '@react-navigation/native';
import { Box, Text, Avatar, Icon } from 'native-base';
import { MaterialIcons, AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { Layout } from '@/components/layout';
import { SettingsItem } from '@/components/settingsItem';
import { NavigationProps } from '@/interfaces/navigation';
import { useState } from 'react';
import { User } from '@/interfaces/user';
import { useAuth } from '@/hooks/auth';

export function UserConfig({ navigation }: NavigationProps) {
  const context = useAuth();
  const user = context.user ?? { name: 'Guest', email: 'guest@example.com' };

  function handleLogout() {
    context.logout();
  }

  return (
    <Layout navigation={navigation}>
      <Box flex={1} bg="gray.50">
        <Box bg="white" alignItems="center" pt={8} pb={6} shadow={1}>
          <Box position="relative" alignItems="center">
            <Avatar
              size="2xl"
              bg="indigo.300"
              borderWidth={2}
              borderColor="indigo.100"
            >
              {user.name.charAt(0).toUpperCase()}
              
            </Avatar>
            <Text fontSize="2xl" fontWeight="bold" mt={4} textAlign="center">
              {user.name}
            </Text>
            <Text fontSize="sm" color="gray.500" mt={1} textAlign="center">
              {user.email}
            </Text>
          </Box>
        </Box>

        <Box mt={6} mx={4}>
          <Box bg="white" borderRadius="lg" overflow="hidden" shadow={1}>
            {/* <SettingsItem
              icon={<Icon as={MaterialIcons} name="person" color="indigo.600" />}
              text="Editar Perfil"
              onPress={() => navigation.navigate('EditProfile')}
            />
            <SettingsItem
              icon={<Icon as={MaterialIcons} name="lock" color="indigo.600" />}
              text="Gerenciar Permissões"
              onPress={() => navigation.navigate('Security')}
            /> */}
          </Box>

          <Box bg="white" mt={4} borderRadius="lg" overflow="hidden" shadow={1}>
            {/* <SettingsItem
              icon={<Icon as={Feather} name="bell" color="indigo.600" />}
              text="Notificações"
              onPress={() => {}}
              hasSwitch
            /> */}
          </Box>

          <Box bg="white" mt={4} borderRadius="lg" overflow="hidden" shadow={1}>
            {/* <SettingsItem
              icon={<Icon as={MaterialIcons} name="delete-outline" color="red.600" />}
              text="Excluir Conta"
              onPress={() => console.log('Excluir Conta')}
              isDestructive
            /> */}
            <SettingsItem
              icon={<Icon as={AntDesign} name="logout" color="red.600" />}
              text="Sair da Conta"
              onPress={handleLogout}
              isDestructive
              isLast
            />
          </Box>

          <Box alignItems="center" mt={8} pb={8}>
            <Text fontSize="xs" color="gray.400">
              {' '}
              © 2025 GymCommunity
            </Text>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
