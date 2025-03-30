import { UserProfile } from "@/enum"; // Adjust the path as needed

export interface ICreateUser {
    name: string;
    email: string;
    password: string;
    birth_date: string;
    cpf: string;
    user_profile: UserProfile;
    professional_id?: number | null;
}

export interface IUserListPrevious{
    id: number
    name: string
    email: string
    cpf: string
}

export interface IUserDetails {
    user_id: number
    name: string
    user_training_id?: number | null
    user_diets_id?: number | null
}