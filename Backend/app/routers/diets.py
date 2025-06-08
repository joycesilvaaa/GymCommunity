# -*- coding: utf-8 -*-
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependency.auth import AuthManager
from app.dependency.database import SessionConnection
from app.modules.basic_response import BasicResponse
from app.routers.controller.diets import DietController
from app.schemas.diet import (
    AllExpiredDiets,
    AllFreeDietQuantity,
    AllFreeDiets,
    CreateDiet,
    DietData,
    DietsByProfissional,
    LastFinishedDiet,
    ListDietActual,
    UpdateDiet,
    DietPeriodCalendar,
)
from app.schemas.user import UserInfo

router_diets = APIRouter(tags=["diets"], prefix="/diets")


@router_diets.post("/")
async def create_diet(
    diet: CreateDiet,
    user: UserInfo = Depends(AuthManager.has_authorization),
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[None]:
    return await DietController(session).create_diet(diet, user)


@router_diets.get("/last-finished")
async def get_last_finished_diet(
    user: UserInfo = Depends(AuthManager.has_authorization),
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[list[LastFinishedDiet]]:
    return await DietController(session).get_name_last_diet(user)


@router_diets.get("/expiring")
async def get_all_expiring_diets(
    user: UserInfo = Depends(AuthManager.has_authorization),
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[list[AllExpiredDiets]]:
    return await DietController(session).get_all_expiring_diets(user)


@router_diets.get("/all-finished")
async def get_all_finished_diets(
    user: UserInfo = Depends(AuthManager.has_authorization),
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[list[DietData]]:
    return await DietController(session).get_all_finished_diets(user)


@router_diets.get("/all-free-quantity")
async def get_quantity_free_diets(
    user: UserInfo = Depends(AuthManager.has_authorization),
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
    user: UserInfo = Depends(AuthManager.has_authorization),
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[list[ListDietActual]]:
    return await DietController(session).get_diet_actual_previous(user.id)


@router_diets.get("/by-profissional")
async def get_diets_by_profissional(
    user: UserInfo = Depends(AuthManager.has_authorization),
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[list[DietsByProfissional]]:
    return await DietController(session).get_diets_by_profissional(user)


@router_diets.get("/all-free")
async def get_all_free_diets(
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[list[AllFreeDiets]]:
    return await DietController(session).get_all_free_diets()


@router_diets.get("/period")
async def get_period_calendar(
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[DietPeriodCalendar | None]:
    return await DietController(session).get_period_diet(user)


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
