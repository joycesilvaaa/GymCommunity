# -*- coding: utf-8 -*-
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.basic_response import BasicResponse
from app.schemas.user import UserInfo
from app.schemas.workout_plans import (
    AllFreeWorkoutPlanQuantity,
    CreateWorkoutPlan,
    ExpiringWorkoutPlans,
    LastFinishedWorkoutPlan,
    ActualWorkoutPlanPrevious,
    PreviousWorkoutPlan,
    UpdateWorkoutPlan,
    WorkoutPlanData,
    WorkoutPlan,
)
from app.service.workout_plans import WorkoutPlanService


class WorkoutPlanController:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session
        self._service = WorkoutPlanService(session)

    async def get_workout_plan_actual(
        self, user: UserInfo
    ) -> BasicResponse[WorkoutPlanData | None]:
        try:
            workout_plan = await self._service.get_workout_plan_actual(user.id)
            return BasicResponse(data=workout_plan)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            )
        
    async def finish_daily_training(
        self, user: UserInfo, daily_training: int
    ) -> BasicResponse[None]:
        try:
            await self._service.finish_daily_training(user.id, daily_training)
            return BasicResponse()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            )

    async def get_workout_plan_actual_previous(
        self, user : UserInfo
    ) -> BasicResponse[ActualWorkoutPlanPrevious | None]:
        try:
            workout_plan = await self._service.get_workout_plan_actual_previous(
                user.id
            )
            return BasicResponse(data=workout_plan)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            )

    async def get_workout_plan_by_id(
        self, workout_plan_id: int
    ) -> BasicResponse[WorkoutPlan | None]:
        try:
            workout_plan = await self._service.get_workout_plan_by_id(
                workout_plan_id
            )
            return BasicResponse(data=workout_plan)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            )

    async def get_quantity_free_workout_plans(
        self,
    ) -> BasicResponse[AllFreeWorkoutPlanQuantity]:
        try:
            quantity = await self._service.get_quantity_of_free_workout_plans()
            return BasicResponse(data=quantity)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            )

    async def get_all_expiring_workout_plans(
        self, user: UserInfo
    ) -> BasicResponse[list[ExpiringWorkoutPlans]]:
        try:
            expiring_workout_plans = (
                await self._service.get_all_expiring_workout_plans(user.id)
            )
            return BasicResponse(data=expiring_workout_plans)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            )

    async def get_all_finished_workout_plans(
        self, user: UserInfo
    ) -> BasicResponse[list[WorkoutPlanData]]:
        try:
            finished_workout_plans = (
                await self._service.get_all_finished_workout_plans(user.id)
            )
            return BasicResponse(data=finished_workout_plans)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            )

    async def get_name_of_last_finished_workout_plan(
        self, user: UserInfo
    ) -> BasicResponse[list[LastFinishedWorkoutPlan]]:
        try:
            last_finished_workout_plan = (
                await self._service.get_name_of_last_finished_workout_plan(user.id)
            )
            return BasicResponse(data=last_finished_workout_plan)
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            )

    async def create_workout_plan(
        self, user: UserInfo, data: CreateWorkoutPlan
    ) -> BasicResponse[None]:
        try:
            await self._service.create_workout_plan(user.id, data)
            return BasicResponse()
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            )

    async def get_all_free_workout_plans(
        self,
    ) -> BasicResponse[list[PreviousWorkoutPlan]]:
        try:
            free_workout_plans = await self._service.get_all_free_workout_plans()
            return BasicResponse(data=free_workout_plans)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            )

    async def get_all_free_workout_plan_by_professional(
        self, user: UserInfo
    ) -> BasicResponse[list[PreviousWorkoutPlan]]:
        try:
            workout_plan = await self._service.get_workout_plan_by_professional(
                user.id
            )
            return BasicResponse(data=workout_plan)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            )

    async def update_workout_plan(
        self, workout_plan_id: int, data: UpdateWorkoutPlan
    ) -> BasicResponse[None]:
        try:
            await self._service.update_workout_plan(workout_plan_id, data)
            return BasicResponse()
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            )

    async def delete_workout_plan(self, workout_plan_id: int) -> BasicResponse[None]:
        try:
            await self._service.delete_workout_plan(workout_plan_id)
            return BasicResponse()
        except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            )
