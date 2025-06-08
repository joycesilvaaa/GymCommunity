import {api }from "./config"
import { login } from "../interfaces/auth";
import { IShoppingList } from "@/interfaces/shoppingList";
import { ICreateUser } from "@/interfaces/user";
import { CreateDiet } from "@/interfaces/diet";
import { AllFreeDiets } from "@/screens/diets/allFreeDiets";
import { CreateTraining } from "@/interfaces/workout_plans";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";


const routes = {
    login: (form_data: login) => api.post(
        "/auth/login",
        new URLSearchParams({
          username: form_data.username,
          password: form_data.password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      ),
    registerUser: (form_data: ICreateUser) => api.post("/user/", form_data),
    registerProfissional: (form_data: ICreateUser) => api.post("/user/", form_data),
    clientsForProfissional: () => api.get("/user/clients-for-professional"),
    userProfile: (user_id: number) => api.get(`/user/${user_id}`),
    userDetails: (user_id: number) => api.get(`/user/detail/${user_id}`),
    userDetailsByCpf: (cpf: string) => api.get(`/user/details/cpf/${cpf}`),
    removeClient: (user_id: number) => api.delete(`/user/${user_id}`),
    userPoints: () => api.get("/user/ranking-points"),
    postUserPublicationProgress: (form_data: any) => api.post("/user/user-publication-progress", form_data, {
        headers: {
  "Content-Type": "multipart/form-data",
}
    }),

    associateClientWithProfissional: (user_id: number) => api.post(`/user/associate-client-professional/${user_id}`),
    //dietas
    quantityFreeDiets: () => api.get("/diets/all-free-quantity"),
    actualDietPrevious: (user_id: number) => api.get("/diets/actual-previous",{
        params: {
            user_id: user_id
        }
    }),
    expiringDiet: () => api.get("/diets/expiring"),
    dietActual: (user_id: number) => api.get(`/diets/actual`, { params: { user_id } }),
    createDiet: (form_data: CreateDiet) => api.post("/diets/", form_data),
    deleteDiet: (id: number) => api.delete(`/diets/${id}`),
    freeDietsByProfissional: () => api.get("/diets/by-profissional"),
    dietById: (id: number) => api.get(`/diets/${id}`,),
    allFreeDiets: () => api.get("/diets/all-free"),
    periodDiet: () => api.get("/diets/period"),
    getHealthGoals: () => api.get("/health_gold/"),
    createHealthGoal: (form_data: any) => api.post("/health_gold/", form_data),
    updateHealthGoal: (id: number, form_data: any) => api.put(`/health_gold/${id}`, form_data),
    deleteHealthGoal: (id: number) => api.delete(`/health_gold/${id}`),
    //treinos
    quantityFreeWorkout: () => api.get("/workout-plans/all-free-quantity"),
    actualWorkoutPrevious: () => api.get("/workout-plans/actual-previous"),
    expiringWorkouts: () => api.get("/workout-plans/expiring"),
    createTraining: (form_data: CreateTraining) => api.post("/workout-plans/", form_data),
    allFreeWorkouts: () => api.get("/workout-plans/all-free"),
    allFreeDietsByProfissional: () => api.get("/workout-plans/all-free-by-professional"),
    workoutActual: () => api.get(`/workout-plans/actual`),
    finishDailyWorkout: (id: number) => api.patch(`/workout-plans/finish-daily-workout/${id}`),
    workoutById: (id: number) => api.get(`/workout-plans/${id}`),
    periodWorkout: () => api.get("/workout-plans/period"),
    //shopping
    allShoppingList: () => api.get("/shopping_list/all-shopping-list"),
    shoppingListActual: () => api.get("/shopping_list/actual"),
    ShoppingListById: (id: number) => api.get(`/shopping_list/${id}`),
    deleteShoppingList: (id: number) => api.delete(`/shopping_list/${id}`),
    createShoppingList: (form_data: IShoppingList) => api.post("/shopping_list/", form_data),
    // chats
    allChats: () => api.get(`/chat/all-by-user`),	
    allSugestions: () => api.get(`/chat/sugestions`),
    createConversation: (user_id: number) => api.post(`/chat/create/${user_id}`),
    sendMessage: (form_data: any) => api.post("/chat/", form_data),
    getMessages: (chat_id: number) => api.get(`/chat/${chat_id}`),
    getNameOtherPerson: (chat_id: number) => api.get(`/chat/other-user-name/${chat_id}`),
    //publications
    getUserPublicationProgress: () => api.get(`/user/user-publication-progress/all`),
    createPublicationSuggestion: (form_data: any) => api.post("/user/user-publication-suggestion", form_data),
    getUserPublicationSuggestion: () => api.get(`/user/user-publication-suggestion/all`),
    deletePublicationSuggestion: (id: number) => api.delete(`/user/user-publication-suggestion/${id}`),
    deletePublicationProgress: (id: number) => api.delete(`/user/user-publication-progress/${id}`),
    
}
 
export default routes;