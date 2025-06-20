# -*- coding: utf-8 -*-
from fastapi import APIRouter, Body, Depends, File, UploadFile, Form
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependency.auth import AuthManager
from app.dependency.database import SessionConnection
from app.modules.basic_response import BasicResponse
from app.routers.controller.user import UserController
from app.routers.controller.images import ImageController
from app.schemas.user import (
    ClientInfo,
    CreateUser,
    CreateUserPostSuggestion,
    CreateUserPublication,
    RankingPoints,
    UpdateUser,
    UserDetail,
    UserInfo,
    UserPublication,
)

router_user = APIRouter(tags=["user"], prefix="/user")


@router_user.put("/")
async def update_user(
    data_update: UpdateUser = Body(...),
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
    return await UserController(session, user).associate_professional_with_client(
        client_id
    )


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


@router_user.get("/ranking-points")
async def get_ranking_points(
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[list[RankingPoints]]:
    return await UserController(session, user).get_ranking_points()


from fastapi import Form, File, UploadFile
from fastapi.responses import FileResponse

@router_user.post("/user-publication-progress")
async def create_user_publication(
    content: str = Form(...),
    is_private: bool = Form(default=False),
    image_files: list[UploadFile] = File(default_factory=list),
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[None]:
    form_data = CreateUserPublication(
        content=content,
        is_private=is_private,
    )
    return await UserController(session, user).create_publication_progress(
        form_data, image_files
    )

@router_user.get("/user-publication-progress/all")
async def get_all_user_publications(
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[list[UserPublication]]:
    return await UserController(session, user).get_user_publications_progress()


@router_user.post("/user-publication-suggestion")
async def create_user_publication_suggestion(
    form_data: CreateUserPostSuggestion = Body(...),
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[None]:
    return await UserController(session, user).create_publication_tips_suggestions(
        form_data
    )

@router_user.get("/user-publication-suggestion/all")
async def get_all_user_publication_suggestions(
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[list[UserPublication]]:
    return await UserController(session, user).get_user_publications_suggestions()

@router_user.delete("/{user_id}")
async def delete_relations(
    user_id: int,
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[None]:
    return await UserController(session, user).delete_relation(user_id)

@router_user.delete("/user-publication-progress/{publication_id}")
async def delete_user_publication(
    publication_id: int,
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[None]:
    return await UserController(session, user).delete_publication_progress(publication_id)

@router_user.delete("/user-publication-suggestion/{publication_id}")
async def delete_user_publication_suggestion(
    publication_id: int,
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[None]:
    return await UserController(session, user).delete_publication_suggestions(publication_id)

@router_user.get("/image/{image_path:path}", response_model=None)
async def get_image(
    image_path: str,
) -> FileResponse | None:
    return await ImageController().get_image(image_path)