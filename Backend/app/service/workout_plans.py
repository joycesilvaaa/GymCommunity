# -*- coding: utf-8 -*-
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import bindparam, delete, text, update

from app.core.db_model import WorkoutPlans
from app.schemas.workout_plans import (
    AllFreeWorkoutPlanQuantity,
    CreateWorkoutPlan,
    ExpiringWorkoutPlans,
    LastFinishedWorkoutPlan,
    ListWorkoutPlanActual,
    UpdateWorkoutPlan,
    WorkoutPlanData,
    PreviousWorkoutPlan
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
                ut.end_date
            from workout_plans wp
            join user_trainings ut
                on ut.workout_plan_id = wp.id
            join users u
                on u.id = ut.workout_plan_id
            where u.id = :id
            order by ut.start_date desc
            limit 1
        """).bindparams(bindparam("id", user_id))
        result = await self._session.execute(query)
        workout_plans = result.fetchall()
        return [
            WorkoutPlanData(**dict(workout_plan)) for workout_plan in workout_plans
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
            order by ut.start_date desc
            limit 1
        """).bindparams(bindparam("id", user_id))
        result = await self._session.execute(query)
        workout_plans = result.fetchall()
        return [
            ListWorkoutPlanActual(**dict(workout_plan))
            for workout_plan in workout_plans
        ]

    async def get_workout_plan_by_id(
        self, workout_plan_id: int
    ) -> list[WorkoutPlanData]:
        query = text("""
            select
                wp.id,
                wp.plan,
                wp.title,
                wp.description,
                ut.start_date,
                ut.end_date
            from workout_plans wp
            join user_trainings ut
                on ut.workout_plan_id = wp.id
            where wp.id = :id
        """).bindparams(bindparam("id", workout_plan_id))
        result = await self._session.execute(query)
        workout_plan = result.fetchall()
        return [
            WorkoutPlanData(**dict(workout_plan)) for workout_plan in workout_plan
        ]

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

    async def get_all_finished_workout_plans(
        self, user_id: int
    ) -> list[WorkoutPlanData]:
        query = text("""
            select
                wp.id,
                wp.plan,
                ut.start_date,
                ut.end_date
            from workout_plans wp
            join user_trainings ut
                on ut.workout_plan_id = wp.id
            where ut.user_id = :id
            and ut.is_completed is true
            and ut.end_date < now()
        """).bindparams(bindparam("id", user_id))
        result = await self._session.execute(query)
        workout_plans = result.fetchall()
        return [
            WorkoutPlanData(**dict(workout_plan)) for workout_plan in workout_plans
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
            PreviousWorkoutPlan(**workout_plan._asdict()) for workout_plan in workout_plans
        ]
    
    async def get_workout_plan_by_professional(self, user_id: int) -> list[PreviousWorkoutPlan]:
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
            PreviousWorkoutPlan(**workout_plan._asdict()) for workout_plan in workout_plans
        ]

    async def create_workout_plan(
        self, user_id: int, workout_plan: CreateWorkoutPlan
    ) -> None:
        new_workout_plan = WorkoutPlans(**workout_plan.model_dump(), user_id=user_id)
        self._session.add(new_workout_plan)
        await self._session.flush()
        await self._session.commit()

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
