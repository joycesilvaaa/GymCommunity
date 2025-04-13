# -*- coding: utf-8 -*-
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependency.auth import AuthManager
from app.dependency.database import SessionConnection
from app.modules.basic_response import BasicResponse
from app.routers.controller.user import UserController
from app.schemas.user import (
    ClientInfo,
    CreateUser,
    UpdateUser,
    UserDetail,
    UserInfo,
)

router_user = APIRouter(tags=["user"], prefix="/user")


@router_user.put("/")
async def update_user(
    data_update: UpdateUser,
    user: UserInfo = Depends(AuthManager.has_authorization),
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[None]:
    return await UserController(session, user).update_user(data_update)


@router_user.post("/")
async def create_user(
    form_user: CreateUser,
    session: AsyncSession = Depends(SessionConnection.session),
) -> BasicResponse[None]:
    return await UserController(session).create_user(form_user)

@router_user.post("/associate-client-professional/{client_id}")
async def associate_client_professional(
    client_id: int,
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[None]:
    return await UserController(session, user).associate_professional_with_client(client_id)


@router_user.delete("/")
async def disable_user(
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[None]:
    return await UserController(session, user).disable_user()


@router_user.get("/")
async def get_user_by_id(
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[UserInfo]:
    return await UserController(session, user).get_user_by_id()


@router_user.get("/clients-for-professional")
async def get_clients_for_professional(
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[list[ClientInfo]]:
    return await UserController(session, user).get_clients_for_professional()


@router_user.get("/detail/{user_id}")
async def get_user_detail(
    user_id: int,
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[UserDetail]:
    return await UserController(session, user).get_user_detail(user_id)


@router_user.get("/details/cpf/{cpf}")
async def get_user_detail_by_cpf(
    cpf: str,
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[UserInfo]:
    return await UserController(session, user).get_user_detail_by_cpf(cpf)


@router_user.delete("/{user_id}")
async def delete_relations(
    user_id: int,
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[None]:
    return await UserController(session, user).delete_relation(user_id)
