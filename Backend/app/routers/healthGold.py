# -*- coding: utf-8 -*-
from fastapi import APIRouter, Body, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependency.auth import AuthManager
from app.dependency.database import SessionConnection
from app.modules.basic_response import BasicResponse
from app.routers.controller.healtGold import HealthGoldController
from app.schemas.healthGold import CreateHealthGold, UpdateHealthGold
from app.schemas.user import UserInfo

router_health_gold = APIRouter(prefix="/health_gold", tags=["health_gold"])


@router_health_gold.post("/")
async def create_health_gold(
    form_data: CreateHealthGold = Body(...),
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[None]:
    return await HealthGoldController(session, user).create_health_gold(form_data)


@router_health_gold.put("/{gold_id}")
async def update_health_gold(
    gold_id: int,
    form_data: UpdateHealthGold = Body(...),
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[None]:
    return await HealthGoldController(session, user).update_health_gold(
        form_data, gold_id
    )


@router_health_gold.delete("/{gold_id}")
async def delete_health_gold(
    gold_id: int,
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[None]:
    return await HealthGoldController(session, user).delete_health_gold(gold_id)


@router_health_gold.get("/")
async def get_health_gold_by_user(
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[list]:
    return await HealthGoldController(session, user).get_health_gold_by_user()


@router_health_gold.get("/{gold_id}")
async def get_health_gold_by_id(
    gold_id: int,
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[None]:
    return await HealthGoldController(session, user).get_health_gold_by_id(gold_id)
