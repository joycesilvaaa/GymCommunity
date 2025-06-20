# -*- coding: utf-8 -*-
from fastapi import HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.basic_response import BasicResponse
from app.schemas.user import UserInfo
from app.service.user import (
    ClientInfo,
    CreateUser,
    CreateUserPostSuggestion,
    CreateUserPublication,
    RankingPoints,
    UpdateUser,
    UserDetail,
     UserPublication,
    UserService,
)


class UserController:
    def __init__(self, session: AsyncSession, user: UserInfo | None = None) -> None:
        self._session = session
        self._service = UserService(session)
        self._user = user

    async def get_user_by_id(self) -> BasicResponse[UserInfo]:
        try:
            user = await self._service.get_user_by_id(self._user.id)
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            return BasicResponse(data=user)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def get_clients_for_professional(self) -> BasicResponse[list[ClientInfo]]:
        try:
            clients = await self._service.get_clients_for_professional(self._user.id)
            return BasicResponse(data=clients)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def get_user_detail(self, user_id: int) -> BasicResponse[UserDetail]:
        try:
            user_detail = await self._service.get_user_details(user_id=user_id)
            return BasicResponse(data=user_detail)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def get_user_detail_by_cpf(self, cpf: str) -> BasicResponse[UserInfo]:
        try:
            user_detail = await self._service.get_user_by_cpf(cpf=cpf)
            return BasicResponse(data=user_detail)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def associate_professional_with_client(
        self, user_id: int
    ) -> BasicResponse[None]:
        try:
            await self._service.associate_professional_with_client(
                user_id, self._user.id
            )
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

    async def update_user(self, form_data: UpdateUser) -> BasicResponse[None]:
        try:
            await self._service.update_user(self._user.id, form_data)
            return BasicResponse(data=None)
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

    async def disable_user(self) -> BasicResponse[None]:
        try:
            await self._service.disable_user(self._user.id)
            return BasicResponse(data=None)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def get_ranking_points(self) -> BasicResponse[list[RankingPoints]]:
        try:
            ranking_points = await self._service.get_ranking_points()
            return BasicResponse(data=ranking_points)
        except Exception as e:
            raise e

    async def create_publication_progress(
        self, form_data: CreateUserPublication, imagens: list[UploadFile]
    ) -> BasicResponse[None]:
        try:
            await self._service.create_user_publication(
                self._user.id, form_data, imagens
            )
            return BasicResponse(data=None)
        except Exception as e:
            raise e

    async def create_publication_tips_suggestions(
        self, form_data: CreateUserPostSuggestion
    ) -> BasicResponse[None]:
        try:
            await self._service.create_user_publication_suggestions(
                self._user.id, form_data
            )
            return BasicResponse(data=None)
        except Exception as e:
            raise e
        
    async def get_user_publications_progress(
            self
    )-> BasicResponse[list[UserPublication]]:
        try:
            publications = await self._service.get_publications_progress()
            return BasicResponse[list[UserPublication]](data=publications)
        except Exception as e:
            raise e
    
    async def get_user_publications_suggestions(
            self
    ) -> BasicResponse[list[UserPublication]]:
        try:
            publications = await self._service.get_publications_suggestions()
            return BasicResponse[list[UserPublication]](data=publications)
        except Exception as e:
            raise e
    
    async def delete_publication_progress(
        self, publication_id: int
    ) -> BasicResponse[None]:
        try:
            await self._service.delete_publication_progress(publication_id)
            return BasicResponse(data=None)
        except Exception as e:
            raise e
        
    async def delete_publication_suggestions(
        self, publication_id: int
    ) -> BasicResponse[None]:
        try:
            await self._service.delete_publication_suggestion(publication_id)
            return BasicResponse(data=None)
        except Exception as e:
            raise e