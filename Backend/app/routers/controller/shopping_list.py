# -*- coding: utf-8 -*-
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.basic_response import BasicResponse
from app.schemas.shopping_list import CreateShoppingList
from app.schemas.user import UserInfo
from app.service.shopping_list import (
    CreateShoppingList,
    ListShoppingPreviouns,
    ShoppingListData,
    ShoppingListService,
)


class ShoppingListController:
    def __init__(self, session: AsyncSession, user: UserInfo) -> None:
        self._session = session
        self._service = ShoppingListService(session, user)

    async def create_shopping_list(
        self, form_data: CreateShoppingList
    ) -> BasicResponse[None]:
        try:
            await self._service.create_shopping_list(form_data)
            return BasicResponse(data=None)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def get_shopping_list_actual_previous(
        self,
    ) -> BasicResponse[list[ListShoppingPreviouns]]:
        try:
            data = await self._service.get_shopping_list_actual_previous()
            return BasicResponse(data=data)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def get_shopping_list_actual(
        self,
    ) -> BasicResponse[list[ShoppingListData]]:
        try:
            data = await self._service.get_shopping_list_actual()
            return BasicResponse(data=data)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def delete_shopping_list(
        self, shopping_list_id: int
    ) -> BasicResponse[None]:
        try:
            await self._service.delete_shopping_list(shopping_list_id)
            return BasicResponse(data=None)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def get_shopping_list_by_id(
        self, shopping_list_id: int
    ) -> BasicResponse[ShoppingListData]:
        try:
            data = await self._service.get_shopping_list_by_id(shopping_list_id)
            return BasicResponse(data=data)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def get_all_shopping_lists(
        self,
    ) -> BasicResponse[list[ListShoppingPreviouns]]:
        try:
            data = await self._service.get_all_shopping_lists()
            return BasicResponse(data=data)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e
