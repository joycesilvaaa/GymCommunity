import { createContext, ReactNode, useContext, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from "@/context/auth";

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("Esse hook deve ser usado dentro de um AuthProvider");
    }
    return context;
}