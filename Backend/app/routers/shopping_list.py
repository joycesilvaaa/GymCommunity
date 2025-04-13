# -*- coding: utf-8 -*-
from fastapi import APIRouter, Body, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependency.auth import AuthManager
from app.dependency.database import SessionConnection
from app.modules.basic_response import BasicResponse
from app.routers.controller.shopping_list import ShoppingListController
from app.schemas.shopping_list import (
    CreateShoppingList,
    ListShoppingPreviouns,
    ShoppingListData,
)
from app.schemas.user import UserInfo

router_shopping_list = APIRouter(prefix="/shopping_list", tags=["shopping_list"])


@router_shopping_list.post("/")
async def create_shopping_list(
    form_data: CreateShoppingList = Body(...),
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[None]:
    return await ShoppingListController(session, user).create_shopping_list(
        form_data
    )


@router_shopping_list.get("/actual_previous")
async def get_shopping_list_actual_previous(
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[list[ListShoppingPreviouns]]:
    return await ShoppingListController(
        session, user
    ).get_shopping_list_actual_previous()


@router_shopping_list.get("/actual")
async def get_shopping_list_actual(
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[list[ShoppingListData]]:
    return await ShoppingListController(session, user).get_shopping_list_actual()


@router_shopping_list.get("/all-shopping-list")
async def get_all_shopping_list(
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[list[ListShoppingPreviouns]]:
    return await ShoppingListController(session, user).get_all_shopping_lists()


@router_shopping_list.delete("/{shopping_list_id}")
async def delete_shopping_list(
    shopping_list_id: int,
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[None]:
    return await ShoppingListController(session, user).delete_shopping_list(
        shopping_list_id
    )


@router_shopping_list.get("/{shopping_list_id}")
async def get_shopping_list_by_id(
    shopping_list_id: int,
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[ShoppingListData]:
    return await ShoppingListController(session, user).get_shopping_list_by_id(
        shopping_list_id
    )
