# -*- coding: utf-8 -*-
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.basic_response import BasicResponse
from app.schemas.user import UserResponse
from app.service.user import UpdateUser, UserService, CreateUser, UserClientsForProfessional, UserDetail


class UserController:
    def __init__(self, session: AsyncSession, user: UserResponse | None = None) -> None:
        self._session = session
        self._service = UserService(session)
        self._user = user

    async def update_user(self) -> BasicResponse[None]:
        try:
            await self._service.update_user(self._user.id, UpdateUser)
            return BasicResponse(data=None)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e
    
    async def create_user(self, form_user: CreateUser) -> BasicResponse[None]:
        try:
            await self._service.create_user(form_user)
            return BasicResponse(data=None)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e
        
    async def disable_user(self) -> BasicResponse[None]:
        try:
            await self._service.disable_user(self._user.id)
            return BasicResponse(data=None)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e
    
    async def get_user_by_id(self) -> BasicResponse[UserResponse]:
        try:
            user = await self._service.get_user_by_id(self._user.id)
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            return BasicResponse(data=user)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e
        
    async def get_clients_for_professional(self) -> BasicResponse[list[UserClientsForProfessional]]:
        try:
            clients = await self._service.get_clients_for_professional(self._user.id)
            return BasicResponse(data=clients)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def get_user_detail(self, user_id: int) -> BasicResponse[UserDetail]:
        try:
            user_detail = await self._service.get_user_details(user_id)
            return BasicResponse(data=user_detail)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e
        
    async def delete_relation(self, user_id: int) -> BasicResponse[None]:
        try:
            await self._service.delete_relation(user_id, self._user.id)
            return BasicResponse(data=None)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e
