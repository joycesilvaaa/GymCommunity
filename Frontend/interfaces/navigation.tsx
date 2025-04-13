import { NavigationProp as ReactNavigationProp } from '@react-navigation/native';

export interface NavigationProps {
  navigation: ReactNavigationProp<any>;
  route?: any;
}