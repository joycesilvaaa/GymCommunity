export interface HealthGoal {
    id: number;
    goal_type: string;
    start_weight: number;
    goal_weight: number;
    end_weight: number;
    start_date: Date;
    end_date: Date;
    success?: boolean;
  }

  export interface HealthGoalFormData {
    goal_type: string;
    start_weight: number;
    goal_weight: number;
    end_weight: number;
    start_date: Date;
    end_date: Date;
  }