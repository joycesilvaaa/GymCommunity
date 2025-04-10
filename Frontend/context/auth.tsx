import { createContext, useState, useEffect, PropsWithChildren } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from "@/interfaces/auth";
import routes from "@/api/api";
import { jwtDecode } from 'jwt-decode';
import { api } from "@/api/config";
import { StackActions } from "@react-navigation/routers";
import { useNavigation } from "@react-navigation/native"; 
import { Dict } from "native-base/lib/typescript/theme/tools";
import { StackNavigationProp } from '@react-navigation/stack';
import { User } from "@/interfaces/user";
interface AuthContextProps {
    isAuthenticaded: boolean,
    login: (form_data: login) => void,
    logout: () => void,
    user: undefined | User
}

type RootStackParamList = {
    Home: undefined;
    Login: undefined;
};

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);


export function AuthProvider({ children }: PropsWithChildren) {
    const [isAuthenticaded, setIsAuthenticaded] = useState(false);
    const [user, setUser] = useState<User | undefined>();


    async function login(form_data: login) {
        try {
            
            const response = await routes.login(form_data);
            console.log(response.data.access_token);
            const token = response.data.access_token;
            api.defaults.headers["Authorization"] = `Bearer ${token}`;
            AsyncStorage.setItem("token", token);
            const decodedToken = jwtDecode(token);
            const userInformation = decodedToken.sub ? JSON.parse(decodedToken.sub) : undefined;
            setUser(userInformation);
            console.log(userInformation);
            setIsAuthenticaded(true);
            StackActions.replace("Home");
        } catch (error) {
            console.log(error);
        }
    }

    async function logout() {
        try {
            AsyncStorage.removeItem("token");
            setIsAuthenticaded(false);
            setUser(undefined);
            api.defaults.headers["Authorization"] = null;
            StackActions.replace("Login");
            console.log("Logout realizado com sucesso!");
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticaded}}>
            {children}
        </AuthContext.Provider>
    )
}