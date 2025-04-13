# -*- coding: utf-8 -*-
import json

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt import decode
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.settings import Settings
from app.dependency.database import SessionConnection
from app.schemas.user import UserInfo
from app.service.user import UserService

oauth_schema = OAuth2PasswordBearer(tokenUrl="auth/login")


class AuthManager:
    @staticmethod
    async def has_authorization(
        session: AsyncSession = Depends(SessionConnection.session),
        token: str = Depends(oauth_schema),
    ) -> UserInfo:
        setting = Settings()  # type: ignore[call-arg]
        try:
            payoad = decode(
                token, setting.SECRET_KEY, algorithms=[setting.ALGORITHM]
            )
            user_payload = (
                json.loads(payoad["sub"])
                if isinstance(payoad["sub"], str)
                else payoad["sub"]
            )

            user = (
                await UserService(session).get_user_by_id(user_payload.get("id"))
                if payoad["sub"]
                else None
            )
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Não foi possível validar as credenciais",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            return user
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Não foi possível validar as credenciais,{e} ",
                headers={"WWW-Authenticate": "Bearer"},
            )
