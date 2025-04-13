import {api }from "./config"
import { login } from "../interfaces/auth";
import { IShoppingList } from "@/interfaces/shoppingList";
import { ICreateUser } from "@/interfaces/user";
import { CreateDiet } from "@/interfaces/diet";
import { AllFreeDiets } from "@/screens/diets/allFreeDiets";
import { CreateTraining } from "@/interfaces/workout_plans";
import { all } from "axios";

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
    
    //treinos
    quantityFreeWorkout: () => api.get("/workout-plans/all-free-quantity"),
    actualWorkoutPrevious: (user_id: number) => api.get("/workout-plans/actual-previous",{params: {user_id: user_id}}),
    expiringWorkouts: () => api.get("/workout-plans/expiring"),
    createTraining: (form_data: CreateTraining) => api.post("/workout-plans/", form_data),
    allFreeWorkouts: () => api.get("/workout-plans/all-free"),
    allFreeDietsByProfissional: () => api.get("/workout-plans/all-free-by-professional"),
    //shopping
    allShoppingList: () => api.get("/shopping_list/all-shopping-list"),
    shoppingListActual: () => api.get("/shopping_list/actual"),
    ShoppingListById: (id: number) => api.get(`/shopping_list/${id}`),
    deleteShoppingList: (id: number) => api.delete(`/shopping_list/${id}`),
    createShoppingList: (form_data: IShoppingList) => api.post("/shopping_list/", form_data),

    
}
 
export default routes;