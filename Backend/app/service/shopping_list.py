# -*- coding: utf-8 -*-
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import bindparam, delete, text
from fastapi import HTTPException
from app.core.db_model import ShoppingList
from app.schemas.shopping_list import (
    CreateShoppingList,
    ListShoppingPreviouns,
    ShoppingListData,
)
from app.schemas.user import UserResponse


class ShoppingListService:
    def __init__(self, session: AsyncSession, user: UserResponse) -> None:
        self._session = session
        self._user = user

    async def create_shopping_list(self, form_data: CreateShoppingList) -> None:
        data_created = {key: value for key, value in form_data.model_dump().items() if value is not None}
        print(data_created)
        shopping_list = ShoppingList(**data_created)
        shopping_list.user_id = self._user.id
        print(shopping_list)
        self._session.add(shopping_list)
        await self._session.flush()
        await self._session.commit()

    async def get_shopping_list_actual_previous(self) -> list[ListShoppingPreviouns]:
        query = text(
            """SELECT
                id,
                title,
                last_update
            FROM shopping_lists
            WHERE user_id = :user_id
            ORDER BY create_date DESC
            LIMIT 1
            """
        ).bindparams(bindparam("user_id", self._user.id))
        result = await self._session.execute(query)
        shopping_list = result.fetchall()
        return [
            ListShoppingPreviouns(**shopping_list._asdict())
            for shopping_list in shopping_list
        ]

    async def get_shopping_list_actual(self) -> list[ShoppingListData]:
        query = text(
            """SELECT
                id,
                diet_id,
                title,
                last_update,
                list as options
            FROM shopping_lists
            WHERE user_id = :user_id
            ORDER BY create_date DESC
            LIMIT 1
            """
        ).bindparams(bindparam("user_id", self._user.id))
        result = await self._session.execute(query)
        shopping_list = result.fetchall()
        return [
            ShoppingListData(**shopping_list._asdict())
            for shopping_list in shopping_list
        ]

    async def get_all_shopping_lists(self) -> list[ListShoppingPreviouns]:
        query = text(
            """SELECT
                id,
                title,
                last_update
            FROM shopping_lists
            WHERE user_id = :user_id
            ORDER BY last_update DESC
            """
        ).bindparams(bindparam("user_id", self._user.id))
        result = await self._session.execute(query)
        shopping_list = result.fetchall()
        return [
            ListShoppingPreviouns(**shopping_list._asdict())
            for shopping_list in shopping_list
        ]

    async def delete_shopping_list(self, shopping_list_id: int) -> None:
        await self._session.execute(
            delete(ShoppingList).where(ShoppingList.id == shopping_list_id)
        )
        await self._session.commit()

    async def get_shopping_list_by_id(
        self, shopping_list_id: int
    ) -> ShoppingListData:
        query = text(
            """SELECT
                id,
                diet_id,
                title,
                last_update,
                options
            FROM shopping_lists
            WHERE id = :shopping_list_id
            """
        ).bindparams(bindparam("shopping_list_id", shopping_list_id))
        result = await self._session.execute(query)

        shopping_list = result.fetchone()
        if not shopping_list:
            raise HTTPException(
                status_code=404, detail="Shopping list not found"
            )
        return ShoppingListData(**shopping_list._asdict())
