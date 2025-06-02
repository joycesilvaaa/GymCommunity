# -*- coding: utf-8 -*-
from datetime import datetime

from dateutil.relativedelta import relativedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import bindparam, delete, select, text, update

from app.core.db_model import UserTraining, WorkoutPlans
from app.schemas.workout_plans import (
    ActualWorkoutPlanPrevious,
    AllFreeWorkoutPlanQuantity,
    CreateWorkoutPlan,
    ExpiringWorkoutPlans,
    LastFinishedWorkoutPlan,
    PreviousWorkoutPlan,
    UpdateWorkoutPlan,
    WorkoutPlan,
    WorkoutPlanData,
)


class WorkoutPlanService:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session
        self._query = WorkoutPlanQuerys(session)

    async def get_workout_plan_actual(self, user_id: int) -> WorkoutPlanData | None:
        query = text("""
            select
                wp.id,
                wp.plans,
                wp.title,
                wp.description,
                ut.start_date,
                ut.end_date,
                ut.time_to_workout,
                ut.daily_training,
                ut.completed_days,
                ut.last_update,
                wp.type
            from workout_plans wp
            join user_trainings ut
                on ut.workout_plan_id = wp.id
            join users u
                on u.id = ut.user_id
            where u.id = :id
            and ut.is_completed = false
            and ut.is_actual = true
        """).bindparams(bindparam("id", user_id))
        result = await self._session.execute(query)
        workout_plans = result.fetchone()
        return WorkoutPlanData(**workout_plans._asdict()) if workout_plans else None

    async def get_workout_plan_actual_previous(
        self, user_id: int
    ) -> WorkoutPlanData | None:
        result = await self._query.get_actual_workout_plan_previous(user_id)
        if not result:
            return None
        workout_plan_id, start_date, end_date = result
        return ActualWorkoutPlanPrevious(
            id=workout_plan_id,
            start_date=start_date,
            end_date=end_date,
        )

    async def get_quantity_of_free_workout_plans(self) -> AllFreeWorkoutPlanQuantity:
        quantity = await self._query.get_quantity_of_free_workout_plans()
        return AllFreeWorkoutPlanQuantity(quantity=quantity)

    async def get_workout_plan_by_id(
        self, workout_plan_id: int
    ) -> WorkoutPlanData | None:
        workout_plan = await self._query.get_workout_plan_by_id(workout_plan_id)
        return WorkoutPlan(**workout_plan.__dict__) if workout_plan else None

    async def get_all_expiring_workout_plans(
        self, user_id: int
    ) -> list[ExpiringWorkoutPlans]:
        query = text("""
            select
                wp.id,
                wp.title,
                ut.user_id,
                wp.id as workout_id
            from workout_plans wp
            join user_trainings ut
                on ut.workout_plan_id = wp.id
            join user_relations ur
                on ur.user_id = ut.user_id
            where wp.user_id = ur.professional_id
            and ut.is_completed = false
            and ut.end_date::DATE BETWEEN CURRENT_DATE AND CURRENT_DATE + 7
            and ur.professional_id = :id
        """).bindparams(bindparam("id", user_id))
        result = await self._session.execute(query)
        workout_plans = result.fetchall()
        return [
            ExpiringWorkoutPlans(**workout_plan._asdict())
            for workout_plan in workout_plans
        ]

    async def get_name_of_last_finished_workout_plan(
        self, user_id: int
    ) -> list[LastFinishedWorkoutPlan]:
        query = text("""
            select
                wp.id,
                wp.title,
                ut.end_date
            from workout_plans wp
            join user_trainings ut
                on ut.workout_plan_id = wp.id
            where ut.user_id = :id
            and ut.end_date < now()
            order by ut.end_date desc
            limit 1
        """).bindparams(bindparam("id", user_id))
        result = await self._session.execute(query)
        workout_plan = result.fetchall()
        return [
            LastFinishedWorkoutPlan(**dict(workout_plan))
            for workout_plan in workout_plan
        ]

    async def get_all_free_workout_plans(self) -> list[PreviousWorkoutPlan]:
        query = text("""
            select
                wp.id,
                wp.title,
                wp.description,
                u."name" as professional_name
            from workout_plans wp
            join users u on u.id = wp.user_id
            where wp.is_public = true
        """)
        result = await self._session.execute(query)
        workout_plans = result.fetchall()
        return [
            PreviousWorkoutPlan(**workout_plan._asdict())
            for workout_plan in workout_plans
        ]

    async def get_workout_plan_by_professional(
        self, user_id: int
    ) -> list[PreviousWorkoutPlan]:
        query = text("""
            select
                wp.id,
                wp.title,
                wp.description
            from workout_plans wp
            where wp.user_id = :id
            and wp.is_public = true
        """).bindparams(bindparam("id", user_id))
        result = await self._session.execute(query)
        workout_plans = result.fetchall()
        return [
            PreviousWorkoutPlan(**workout_plan._asdict())
            for workout_plan in workout_plans
        ]

    async def create_workout_plan(
        self, user_id: int, workout_plan: CreateWorkoutPlan
    ) -> None:
        workout_plan_data = workout_plan.model_dump(
            exclude={"user_id", "start_date", "time_to_workout"}
        )
        new_workout_plan = WorkoutPlans(**workout_plan_data, user_id=user_id)
        self._session.add(new_workout_plan)
        await self._session.flush()
        await self._session.commit()
        print(new_workout_plan.id)
        print(workout_plan.start_date)
        print(workout_plan.time_to_workout)
        print(workout_plan.user_id)
        if (
            workout_plan.start_date is not None
            and workout_plan.time_to_workout is not None
            and workout_plan.user_id is not None
        ):
            await self._create_user_training(
                user_id=workout_plan.user_id,
                workout_plan_id=new_workout_plan.id,
                start_date=workout_plan.start_date,
                time_to_workout=workout_plan.time_to_workout,
            )

    async def update_workout_plan(
        self, workout_plan_id: int, workout_plan: UpdateWorkoutPlan
    ) -> None:
        update_data = {
            key: value
            for key, value in workout_plan.model_dump().items()
            if value is not None
        }
        await self._session.execute(
            update(WorkoutPlans)
            .where(WorkoutPlans.id == workout_plan_id)
            .values(**update_data)
        )
        await self._session.commit()

    async def delete_workout_plan(self, workout_plan_id: int) -> None:
        await self._session.execute(
            delete(WorkoutPlans).where(WorkoutPlans.id == workout_plan_id)
        )
        await self._session.commit()

    async def _create_user_training(
        self,
        user_id: int,
        workout_plan_id: int,
        start_date: datetime,
        time_to_workout: str,
    ) -> None:
        workout_plan = await self._query.get_workout_plan_by_id(workout_plan_id)
        if not workout_plan:
            raise ValueError("Workout plan not found")
        new_user_training = UserTraining(
            user_id=user_id,
            workout_plan_id=workout_plan_id,
            is_completed=False,
            is_actual=True,
            start_date=start_date,
            end_date=self.__calculate_end_date(
                start_date,
                workout_plan.months_valid,
            ),
            time_to_workout=time_to_workout,
        )
        self._session.add(new_user_training)
        await self._session.flush()
        await self._session.commit()

    async def finish_daily_training(self, user_id: int, daily_training: int) -> None:
        workout_plan = await self._query.get_actual_workout_plan_by_user_id(user_id)
        user_training = await self._query.get_user_training_by_user_id(
            user_id, workout_plan.id
        )
        progress = self.__calculate_progress(
            user_training.start_date,
            user_training.end_date,
            workout_plan.days_per_week,
            user_training.completed_days + 1,
        )
        if not user_training:
            raise ValueError("User training not found")
        await self._session.execute(
            update(UserTraining)
            .where(
                UserTraining.id == user_training.id,
            )
            .values(
                completed_days=user_training.completed_days + 1,
                progress=progress,
                daily_training=daily_training,
                last_update=datetime.now(),
                is_completed=progress >= 100.0,
                is_actual=progress < 100.0,
            )
        )
        await self._session.commit()

    @staticmethod
    def __calculate_end_date(
        start_date: datetime,
        months_valid: int,
    ) -> datetime:
        return start_date + relativedelta(months=months_valid)

    @staticmethod
    def __calculate_progress(
        start_date: datetime,
        end_date: datetime,
        days_per_week: int,
        completed_days: int,
    ) -> float:
        if start_date > end_date or days_per_week <= 0:
            return 0.0

        total_days = (end_date - start_date).days + 1
        full_weeks = total_days // 7
        remaining_days = total_days % 7

        total_training_days = (full_weeks * days_per_week) + min(
            remaining_days, days_per_week
        )

        if total_training_days == 0:
            return 0.0

        progress_percentage = (completed_days / total_training_days) * 100
        return round(progress_percentage, 2)


class WorkoutPlanQuerys:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_user_training_by_user_id(
        self, user_id: int, workout_plan_id: int
    ) -> UserTraining | None:
        result = await self._session.execute(
            select(UserTraining).where(
                UserTraining.user_id == user_id,
                UserTraining.is_actual,
                UserTraining.workout_plan_id == workout_plan_id,
            )
        )
        return result.scalar_one_or_none()

    async def get_workout_plan_by_id(
        self, workout_plan_id: int
    ) -> WorkoutPlans | None:
        result = await self._session.execute(
            select(WorkoutPlans).where(WorkoutPlans.id == workout_plan_id)
        )
        return result.scalar_one_or_none()

    async def get_actual_workout_plan_by_user_id(
        self, user_id: int
    ) -> WorkoutPlans | None:
        result = await self._session.execute(
            select(WorkoutPlans)
            .join(UserTraining)
            .where(
                UserTraining.user_id == user_id,
                UserTraining.is_actual,
                not UserTraining.is_completed,
                UserTraining.workout_plan_id == WorkoutPlans.id,
            )
        )
        return result.scalar_one_or_none()

    async def get_quantity_of_free_workout_plans(self) -> int:
        result = await self._session.execute(
            text("""
            select count(*)
            from workout_plans wp
            where wp.is_public = true
        """)
        )
        return result.scalar() if result else 0

    async def get_actual_workout_plan_previous(
        self, user_id: int
    ) -> tuple[int, datetime, datetime] | None:
        result = await self._session.execute(
            select(WorkoutPlans.id, UserTraining.start_date, UserTraining.end_date)
            .join(UserTraining)
            .where(
                UserTraining.user_id == user_id,
                UserTraining.is_actual,
                not UserTraining.is_completed,
                UserTraining.workout_plan_id == WorkoutPlans.id,
            )
        )
        return result.one_or_none()
