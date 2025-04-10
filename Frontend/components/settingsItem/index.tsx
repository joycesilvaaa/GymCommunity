// components/SettingsItem.tsx
import { Box, Button, Center, Divider, Icon, Switch, Text } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { ReactNode } from 'react';

interface SettingsItemProps {
  icon: ReactNode;
  text: string;
  onPress: () => void;
  isLast?: boolean;
  isDestructive?: boolean;
  hasSwitch?: boolean;
}

export function SettingsItem({
  icon,
  text,
  onPress,
  isLast = false,
  isDestructive = false,
  hasSwitch = false,
}: SettingsItemProps) {
  return (
    <>
      <Button 
        variant="unstyled"
        justifyContent="space-between"
        alignItems="center"
        flexDirection="row"
        p={4}
        _pressed={{ bg: 'gray.50' }}
        onPress={onPress}
      >
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" flex={1}>
          <Box flexDirection="row" alignItems="center">
            {icon}
            <Text fontSize="md" ml={4} color={isDestructive ? 'red.500' : 'gray.500'}>
              {text}
            </Text>
          </Box>
          <Box flexDirection="row" alignItems="center">
            {hasSwitch && (
                <Switch
                    size="sm"
                    onTrackColor="indigo.600"
                />
                )}

          </Box>
        </Box>
      </Button>
      {!isLast && <Divider bg="gray.100" />}
    </>
  );
}