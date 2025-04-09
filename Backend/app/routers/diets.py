# -*- coding: utf-8 -*-
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependency.auth import AuthManager
from app.dependency.database import SessionConnection
from app.modules.basic_response import BasicResponse
from app.routers.controller.diets import DietController
from app.schemas.diet import (
    AllFreeDietQuantity,
    CreateDiet,
    DietData,
    ExpiringDiets,
    LastFinishedDiet,
    ListDietActual,
    UpdateDiet,
)
from app.schemas.user import UserResponse

router_diets = APIRouter(tags=["diets"], prefix="/diets")


@router_diets.post("/")
async def create_diet(
    diet: CreateDiet,
    user: UserResponse = Depends(AuthManager.has_authorization),
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[None]:
    return await DietController(session).create_diet(diet, user)


@router_diets.get("/last-finished")
async def get_last_finished_diet(
    user: UserResponse = Depends(AuthManager.has_authorization),
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[list[LastFinishedDiet]]:
    return await DietController(session).get_name_last_diet(user)


@router_diets.get("/expiring")
async def get_all_expiring_diets(
    user: UserResponse = Depends(AuthManager.has_authorization),
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[list[ExpiringDiets]]:
    return await DietController(session).get_all_expiring_diets(user)


@router_diets.get("/all-finished")
async def get_all_finished_diets(
    user: UserResponse = Depends(AuthManager.has_authorization),
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[list[DietData]]:
    return await DietController(session).get_all_finished_diets(user)


@router_diets.get("/all-free-quantity")
async def get_quantity_free_diets(
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[AllFreeDietQuantity]:
    return await DietController(session).get_quantity_of_free_diets()


@router_diets.get("/actual")
async def get_actual_diet(
    user_id: int,
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[list[DietData]]:
    return await DietController(session).get_diet_actual(user_id)


@router_diets.get("/actual-previous")
async def get_actual_previous_diet(
    user_id: int,
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[list[ListDietActual]]:
    return await DietController(session).get_diet_actual_previous(user_id)


@router_diets.put("/{diet_id}")
async def update_diet(
    diet_id: int,
    diet: UpdateDiet,
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[None]:
    return await DietController(session).update_diet(diet_id, diet)


@router_diets.delete("/{diet_id}")
async def delete_diet(
    diet_id: int,
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[None]:
    return await DietController(session).delete_diet(diet_id)


@router_diets.get("/{diet_id}")
async def get_diet_by_id(
    diet_id: int,
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[list[DietData]]:
    return await DietController(session).get_diet_by_id(diet_id)
