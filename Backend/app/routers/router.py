# -*- coding: utf-8 -*-
from fastapi import FastAPI

from app.routers.auth import router_auth
from app.routers.chat import router_chat
from app.routers.diets import router_diets
from app.routers.healthGold import router_health_gold
from app.routers.shopping_list import router_shopping_list
from app.routers.user import router_user
from app.routers.workout_plan import router_workout_plan


def define_routes(app: FastAPI) -> None:
    app.include_router(router_auth)
    app.include_router(router_diets)
    app.include_router(router_workout_plan)
    app.include_router(router_user)
    app.include_router(router_shopping_list)
    app.include_router(router_health_gold)
    app.include_router(router_chat)
