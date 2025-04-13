# -*- coding: utf-8 -*-
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependency.auth import AuthManager
from app.dependency.database import SessionConnection
from app.modules.basic_response import BasicResponse
from app.routers.controller.workout_plan import WorkoutPlanController
from app.schemas.user import UserInfo
from app.schemas.workout_plans import (
    AllFreeWorkoutPlanQuantity,
    CreateWorkoutPlan,
    ExpiringWorkoutPlans,
    LastFinishedWorkoutPlan,
    ListWorkoutPlanActual,
    UpdateWorkoutPlan,
    WorkoutPlanData,
    PreviousWorkoutPlan,
)

router_workout_plan = APIRouter(tags=["workout_plans"], prefix="/workout-plans")


@router_workout_plan.post("/")
async def create_workout_plan(
    workout_plan: CreateWorkoutPlan,
    user: UserInfo = Depends(AuthManager.has_authorization),
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[None]:
    return await WorkoutPlanController(session).create_workout_plan(user, workout_plan)


@router_workout_plan.get("/last-finished")
async def get_name_of_last_finished_workout_plan(
    user: UserInfo = Depends(AuthManager.has_authorization),
    controller: WorkoutPlanController = Depends(SessionConnection.session),
) -> BasicResponse[list[LastFinishedWorkoutPlan]]:
    return await controller.get_name_of_last_finished_workout_plan(user)


@router_workout_plan.get("/expiring")
async def get_all_expiring_workout_plans(
    user: UserInfo = Depends(AuthManager.has_authorization),
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[list[ExpiringWorkoutPlans]]:
    return await WorkoutPlanController(session).get_all_expiring_workout_plans(user)


@router_workout_plan.get("/all-finished")
async def get_all_finished_workout_plans(
    user: UserInfo = Depends(AuthManager.has_authorization),
    controller: WorkoutPlanController = Depends(SessionConnection.session),
) -> BasicResponse[list[WorkoutPlanData]]:
    return await controller.get_all_finished_workout_plans(user)


@router_workout_plan.get("/all-free-quantity")
async def get_quantity_free_workout_plans(
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[AllFreeWorkoutPlanQuantity]:
    return await WorkoutPlanController(session).get_quantity_free_workout_plans()

@router_workout_plan.get("/all-free")
async def get_all_free_workout_plans(
    user: UserInfo = Depends(AuthManager.has_authorization),
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[list[PreviousWorkoutPlan]]:
    return await WorkoutPlanController(session).get_all_free_workout_plans()

@router_workout_plan.get("/all-free-by-professional")
async def get_all_free_workout_plans_by_professional(
    user: UserInfo = Depends(AuthManager.has_authorization),
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[list[PreviousWorkoutPlan]]:
    return await WorkoutPlanController(session).get_all_free_workout_plan_by_professional(user)

@router_workout_plan.get("/actual")
async def get_workout_plan_actual(
    user_id: int,
    controller: WorkoutPlanController = Depends(SessionConnection.session),
) -> BasicResponse[list[WorkoutPlanData]]:
    return await controller.get_workout_plan_actual(user_id)


@router_workout_plan.get("/actual-previous")
async def get_workout_plan_actual_previous(
    user_id: int,
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[list[ListWorkoutPlanActual]]:
    return await WorkoutPlanController(session).get_workout_plan_actual_previous(
        user_id
    )


@router_workout_plan.get("/{diet_id}")
async def get_workout_plan_by_id(
    workout_plan_id: int,
    controller: WorkoutPlanController = Depends(SessionConnection.session),
) -> BasicResponse[list[WorkoutPlanData]]:
    return await controller.get_workout_plan_by_id(workout_plan_id)


@router_workout_plan.put("/{workout_plan_id}")
async def update_workout_plan(
    workout_plan_id: int,
    workout_plan: UpdateWorkoutPlan,
    controller: WorkoutPlanController = Depends(SessionConnection.session),
) -> BasicResponse[None]:
    return await controller.update_workout_plan(workout_plan_id, workout_plan)


@router_workout_plan.delete("/{workout_plan_id}")
async def delete_workout_plan(
    workout_plan_id: int,
    controller: WorkoutPlanController = Depends(SessionConnection.session),
) -> BasicResponse[None]:
    return await controller.delete_workout_plan(workout_plan_id)
