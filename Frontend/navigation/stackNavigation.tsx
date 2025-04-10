import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Initial } from '@/screens/initial';
import { Login } from '@/screens/login';
import { CreateUser } from '@/screens/createUser';
import { CreateProfissional } from '@/screens/createProfissional';
import { Home } from '@/screens/home';
import { MenuFooter } from '@/components/menu';
import { ManagerClients } from '@/screens/managerClients';
import { FreeDiets } from '@/screens/managerMyFreeDiets';
import CreateDietScreen from '@/screens/createDiet';
import { AllFreeDiets } from '@/screens/allFreeDiets';
import { ViewDiet } from '@/screens/viewDiet';
import { UserProfile } from '@/screens/userProfile';
import { ExpiringDiet } from '@/screens/expiringDiet';
import { ShoppingList } from '@/screens/createShoppingList';
import { ListShopping } from '@/screens/listShopping';
import { ViewShoppingList } from '@/screens/viewShoppingList';
import CreateTraining from '@/screens/createWorkouts';
import { AllFreeWorkouts } from '@/screens/allFreeTraining';
import { ViewTraining } from '@/screens/viewWorkout';
import { AuthProvider } from '@/context/auth';
import { useAuth } from '@/hooks/auth';
import { UserConfig } from '@/screens/userConfig';

const Stack = createStackNavigator();

export function StackNavigator() {
  const { user } = useAuth();
  return (
    
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen 
              name="ManangerClients"
              component={ManagerClients}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ManagerMyFreeDiets"
              component={FreeDiets}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CreateDiet"
              component={CreateDietScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AllFreeDiets"
              component={AllFreeDiets}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="ViewDiet" component={ViewDiet} options={{ headerShown: false }} />
            <Stack.Screen
              name="UserProfile"
              component={UserProfile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ExpiringDiet"
              component={ExpiringDiet}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ShoppingList"
              component={ListShopping}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CreateAShoppingList"
              component={ShoppingList}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ViewShoppingList"
              component={ViewShoppingList}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CreateWorkout"
              component={CreateTraining}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AllFreeWorkout"
              component={AllFreeWorkouts}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ViewTraining"
              component={ViewTraining}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="UserConfig"
              component={UserConfig}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="initial" component={Initial} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen
              name="CreateUser"
              component={CreateUser}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CreateProfissional"
              component={CreateProfissional}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
  );
}
