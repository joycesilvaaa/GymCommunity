import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Initial } from '@/screens/base/initial';
import { Login } from '@/screens/base/login';
import { CreateUser } from '@/screens/user/createUser';
import { CreateProfissional } from '@/screens/user/createProfissional';
import { Home } from '@/screens/base/home';
import { MenuFooter } from '@/components/menu';
import { ManagerClients } from '@/screens/clients/managerClients';
import { FreeDiets } from '@/screens/diets/managerMyFreeDiets';
import CreateDietScreen from '@/screens/diets/createDiet';
import { AllFreeDiets } from '@/screens/diets/allFreeDiets';
import { ViewDiet } from '@/screens/diets/viewDiet';
import { UserProfile } from '@/screens/user/userProfile';
import { ExpiringDiet } from '@/screens/diets/expiringDiet';
import { ShoppingList } from '@/screens/shoppingList/createShoppingList';
import { ListShopping } from '@/screens/shoppingList/listShopping';
import { ViewShoppingList } from '@/screens/shoppingList/viewShoppingList';
import CreateTrainingScreen from '@/screens/workouts/createWorkouts';
import { AllFreeWorkouts } from '@/screens/workouts/allFreeTraining';
import { AuthProvider } from '@/context/auth';
import { useAuth } from '@/hooks/auth';
import { UserConfig } from '@/screens/user/userConfig';
import { NewClient } from '@/screens/clients/newClient';
import ManagerAllFreeTraining from '@/screens/workouts/managerAllFreeTraining';
import ExpiringWorkoutsScreen from '@/screens/workouts/expiringTraining';
import  AllChats  from '@/screens/chat/allChats';
import  ViewChat  from '@/screens/chat/viewChat';
import  WorkoutScreen  from '@/screens/workouts/workoutView';
import StartWorkoutScreen from '@/screens/workouts/startWorkout';
import WorkoutCompleteScreen from '@/screens/workouts/completWorkout';
import HealthGoalsScreen from '@/screens/healthGoal/healthGoal';
import UserPoints from '@/screens/user/userPoints';
import PublicationSuggestion from '@/screens/publication/userPublicationSuggestion';
import PublicationProgress from '@/screens/publication/userPublicationProgress';
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
              component={CreateTrainingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AllFreeWorkout"
              component={AllFreeWorkouts}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="UserConfig"
              component={UserConfig}
              options={{ headerShown: false }}
            />
            <Stack.Screen
            name="NewClient"
            component={NewClient}
            options={{headerShown: false}}/>
            <Stack.Screen
              name="ManagerMyFreeTraining"
              component={ManagerAllFreeTraining}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ExpiringWorkout"
              component={ExpiringWorkoutsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AllChats"
              component={AllChats}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ViewChat"
              component={ViewChat}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ViewWourkout"
              component={WorkoutScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="WorkoutComplete"
              component={WorkoutCompleteScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
            name="StartWorkout"
            component={StartWorkoutScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HealthGoals"
            component={HealthGoalsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UserPoints"
            component={UserPoints}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PublicationSuggestion"
            component={PublicationSuggestion}
            options={{ headerShown: false }}    
          />
          <Stack.Screen
            name="PublicationProgress"
            component={PublicationProgress}
            options={{ headerShown: false }}    
          />
           
          </>
        ) : (
          <>
            <Stack.Screen name="Initial" component={Initial} options={{ headerShown: false }} />
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
