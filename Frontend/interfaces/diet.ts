export interface dietActualPrevious {
  id: number;
  start_date: Date;
  end_date: Date;
}

export interface IViewDiet {
  id: number;
  title: string;
  description: string;
  menu: Meal[];
  is_public: boolean;
  months_valid: number;
}

export type OptionType = 'unidade' | 'gramas' | 'quilos' | 'livre';

export interface Meal {
  title: string;
  options: {
    name: string;
    quantity: number;
    type: OptionType;
  }[];
  time_to_eat: string;
}
export interface CreateDiet {
  title: string;
  description: string;
  menu:Meal[];
  is_public: boolean;
  months_valid: number;
  start_date?: string
  user_id?: number
}
export interface DietsByProfissional{
  id: number;
  title: string;
  description: string;
}

export interface IAllFreeDiets {
  id: number;
  title: string;
  description: string;
}

export interface IExpiringDiet{
  id: number
  title: string;
  description: string;
  user_id: number;
  diet_id: number;
}