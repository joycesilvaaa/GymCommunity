# -*- coding: utf-8 -*-
from datetime import datetime, timedelta

from dateutil.relativedelta import relativedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import bindparam, delete, text, update

from app.core.db_model import UserTraining, WorkoutPlans
from app.schemas.workout_plans import (
    AllFreeWorkoutPlanQuantity,
    CreateWorkoutPlan,
    ExpiringWorkoutPlans,
    LastFinishedWorkoutPlan,
    ListWorkoutPlanActual,
    PreviousWorkoutPlan,
    UpdateWorkoutPlan,
    WorkoutPlanData,
)


class WorkoutPlanService:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_workout_plan_actual(self, user_id: int) -> list[WorkoutPlanData]:
        query = text("""
            select
                wp.id,
                wp.plan,
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
                on u.id = ut.workout_plan_id
            where u.id = :id
            and ut.is_completed = false
            and ut.is_actual = true
        """).bindparams(bindparam("id", user_id))
        result = await self._session.execute(query)
        workout_plans = result.fetchall()
        return [
            WorkoutPlanData(**workout_plan._asdict())
            for workout_plan in workout_plans
        ]

    async def get_workout_plan_actual_previous(
        self, user_id: int
    ) -> list[ListWorkoutPlanActual]:
        query = text("""
            select
                wp.id,
                ut.start_date,
                ut.end_date
            from workout_plans wp
            join user_trainings ut
                on ut.workout_plan_id = wp.id
            join users u
                on u.id = ut.workout_plan_id
            where u.id = :id
            and ut.is_completed = false
            and ut.is_actual = true
        """).bindparams(bindparam("id", user_id))
        result = await self._session.execute(query)
        workout_plans = result.fetchall()
        return [
            ListWorkoutPlanActual(**dict(workout_plan))
            for workout_plan in workout_plans
        ]

    async def _get_workout_plan_by_id(
        self, workout_plan_id: int
    ) -> WorkoutPlans | None:
        query = text("""
            select * from workout_plans wp
            where wp.id = :id
        """).bindparams(bindparam("id", workout_plan_id))
        result = await self._session.execute(query)
        workout_plan = result.fetchone()
        return WorkoutPlans(**workout_plan._asdict()) if workout_plan else None

    async def get_quantity_of_free_workout_plans(self) -> AllFreeWorkoutPlanQuantity:
        query = text("""
            select count(*)
            from workout_plans wp
            where wp.is_public = true
        """)
        result = await self._session.execute(query)
        quantity = result.scalar()
        return (
            AllFreeWorkoutPlanQuantity(quantity=quantity)
            if quantity
            else AllFreeWorkoutPlanQuantity()
        )

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
        workout_plan = await self._get_workout_plan_by_id(workout_plan_id)
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
                workout_plan.days_per_week,
            ),
            time_to_workout=time_to_workout,
        )
        self._session.add(new_user_training)
        await self._session.flush()
        await self._session.commit()

    async def finish_daily_training(
        self, user_id: int, workout_plan_id: int
    ) -> None:
        workout_plans = await self.get_workout_plan_actual(user_id)
        workout_plan = workout_plans[0]
        total_days = (workout_plan.end_date - workout_plan.start_date).days

        await self._session.execute(
            update(UserTraining)
            .where(
                UserTraining.user_id == user_id,
                UserTraining.workout_plan_id == workout_plan_id,
                not UserTraining.is_completed,
                UserTraining.is_actual,
            )
            .values(
                completed_days=UserTraining.completed_days + 1,
                progress=float(
                    (UserTraining.completed_days + 1) / total_days * 100, 2
                ),
                daily_training=UserTraining.daily_training + 1,
                last_update=datetime.now(),
                is_completed=(UserTraining.completed_days + 1) >= total_days,
                is_actual=False
                if (UserTraining.completed_days + 1) >= total_days
                else True,
            )
        )
        await self._session.commit()

    @staticmethod
    def __calculate_end_date(
        start_date: datetime, months_valid: int, days_per_week: int
    ) -> datetime:
        end_date_limit = start_date + relativedelta(months=months_valid)
        total_days = (end_date_limit - start_date).days
        total_weeks = total_days // 7
        total_workouts = total_weeks * days_per_week
        interval_days = 7 / days_per_week
        workouts_done = 0
        current_day = start_date
        last_workout_date = start_date

        while workouts_done < total_workouts:
            last_workout_date = current_day
            current_day += timedelta(days=interval_days)
            workouts_done += 1

        return last_workout_date.date()
