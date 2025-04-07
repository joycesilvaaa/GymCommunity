import { NavigationProp as ReactNavigationProp } from '@react-navigation/native';

export interface CustomNavigationProp {
  navigation: ReactNavigationProp<any>;
  route?: any;
}