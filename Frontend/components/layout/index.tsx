

import { ReactNode } from 'react';
import { Box , Icon} from 'native-base';
import { StatusBar } from 'react-native';
import { MenuFooter } from '../menu';
import { NavigationProp } from '@react-navigation/native';
import { ScrollView } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'

interface LayoutProps {
  children: ReactNode;
  navigation: NavigationProp<any>;}

  export function Layout({ children, navigation }: LayoutProps) {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <Box flex={1} flexDirection="column" backgroundColor="white" >
          <Box flexDirection="row" justifyContent="space-between"  backgroundColor="indigo" padding={2} margin={2}>
            <Icon size="8" color="indigo.600" as={<MaterialIcons name="fitness-center" />} />
            <Icon size="8" color="indigo.600" as={<MaterialIcons name="message" />} />
          </Box>    
          
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    {children}
 
          </ScrollView>
          
          <MenuFooter navigation={navigation} />
        </Box>
      </>
    );
  }
  
  