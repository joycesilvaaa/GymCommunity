# -*- coding: utf-8 -*-
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependency.auth import AuthManager
from app.dependency.database import SessionConnection
from app.routers.controller.user import UserController
from app.schemas.user import UpdateUser, UserResponse, CreateUser, UserClientsForProfessional, UserDetail
from app.modules.basic_response import BasicResponse

router_user = APIRouter(tags=["user"], prefix="/user")


@router_user.put("/")
async def update_user(
    data_update: UpdateUser,
    user: UserResponse = Depends(AuthManager.has_authorization),
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[None]:
    return await UserController(session, user).update_user(data_update)

@router_user.post("/")
async def create_user(
    form_user: CreateUser,
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[None]:
    return await UserController(session).create_user(form_user)

@router_user.delete("/")
async def disable_user(
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserResponse = Depends(AuthManager.has_authorization),
) -> BasicResponse[None]:
    return await UserController(session, user).disable_user()

@router_user.get("/")
async def get_user_by_id(
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserResponse = Depends(AuthManager.has_authorization),
) -> BasicResponse[UserResponse]:
    return await UserController(session, user).get_user_by_id()

@router_user.get("/clients-for-professional")
async def get_clients_for_professional(
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserResponse = Depends(AuthManager.has_authorization),
) -> BasicResponse[list[UserClientsForProfessional]]:
    return await UserController(session, user).get_clients_for_professional()


@router_user.get("/detail")
async def get_user_detail(
    user_id: int,
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserResponse = Depends(AuthManager.has_authorization),
) -> BasicResponse[UserDetail]:
    return await UserController(session, user).get_user_detail(user_id)

@router_user.delete("/{user_id}")
async def delete_relations(
    user_id: int,
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserResponse = Depends(AuthManager.has_authorization),
) -> BasicResponse[None]:
    return await UserController(session, user).delete_relation(user_id)