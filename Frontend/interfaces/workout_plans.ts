export interface WorkoutActualPrevious {
  id: number;
  start_date: Date;
  end_date: Date;
}

export interface Exercise {
  name: string;
  repetitions: string;
  rest_time: number;
}

export interface TrainingPlan {
  title: string;
  exercises: Exercise[];
}

export interface CreateTraining {
  title: string;
  description: string;
  plans: TrainingPlan[];
  is_public: boolean;
  days_per_week: number;
  type: string;
  months_valid: number;
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