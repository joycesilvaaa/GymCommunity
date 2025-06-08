export interface WorkoutActualPrevious {
  id: number;
  start_date: Date;
  end_date: Date;
}

export interface Exercise {
  name: string;
  image_url?: string;
  muscle_group: string;
  rest_time: number;
  description: string;
  repetitions: string;
} 

export interface WorkoutPlan {
  title: string;
  exercises: Exercise[];
}

export interface CreateTraining {
  title: string;
  description: string;
  plans: WorkoutPlan[];
  is_public: boolean;
  days_per_week: number;
  type: string;
  months_valid: number;
  start_date?: string;
  user_id?: number;
  time_to_workout?: string;
}

export interface ViewWorkout {
  id: number
  title: string;
  description: string;
  professional_name?: string;
}

export interface ExpiringWorkout{
  id: number
  title: string;
  description: string;
  user_id: number;
  workout_id: number;
}

export interface WorkoutData {
    id: number;
    title: string;
    description: string;
    start_date: Date;
    end_date: Date;
    time_to_workout: string;
    daily_training: number;
    completed_days: number;
    type: string;
    plans: WorkoutPlan[];
}

export interface TrainingSchedule{
  id: number
  start_date: Date;
  end_date: Date;
  days_per_week: number;
  time_to_workout: string;
}