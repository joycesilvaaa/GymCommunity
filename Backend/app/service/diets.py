# -*- coding: utf-8 -*-
from datetime import datetime

from dateutil.relativedelta import relativedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import bindparam, text, update

from app.core.db_model import Diets, UserDiet
from app.schemas.diet import (
    AllExpiredDiets,
    AllFreeDietQuantity,
    AllFreeDiets,
    CreateDiet,
    DietData,
    DietsByProfissional,
    LastFinishedDiet,
    ListDietActual,
    UpdateDiet,
)


class DietService:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_diet_actual(self, user_id: int) -> list[DietData]:
        query = text("""
            select
                d.id,
                d.menu,
                d.title,
                d.description,
                ud.start_date,
                ud.end_date
            from diets d
            join user_diets ud
                on d.id = ud.diet_id
            join users u
                on u.id = ud.user_id
            where u.id = :id
                and ud.is_completed is false
                and d.is_deleted = false
                and ud.is_actual = true
        """).bindparams(bindparam("id", user_id))
        result = await self._session.execute(query)
        diets = result.fetchall()
        return [DietData(**diet._asdict()) for diet in diets]

    async def get_diet_actual_previous(self, user_id: int) -> list[ListDietActual]:
        query = text("""
            select
                d.id,
                ud.start_date,
                ud.end_date
            from diets d
            join user_diets ud
                on d.id = ud.diet_id
            join users u
                on u.id = ud.user_id
            where u.id = :id
                and ud.is_completed is false
                and d.is_deleted = false
                and ud.is_actual = true
        """).bindparams(bindparam("id", user_id))
        result = await self._session.execute(query)
        diets = result.fetchall()
        return [ListDietActual(**diet._asdict()) for diet in diets]

    async def get_diet_by_id(self, diet_id: int) -> list[DietData]:
        query = text("""
            select
                d.id,
                d.menu,
                d.title,
                d.description,
                d.is_public,
                d.months_valid,
                d.user_id
            from diets d
            where d.id = :id
                and d.is_deleted = false
        """).bindparams(bindparam("id", diet_id))
        result = await self._session.execute(query)
        diets = result.fetchall()
        return [DietData(**diet._asdict()) for diet in diets]

    async def get_quantity_of_free_diets(self) -> AllFreeDietQuantity:
        query = text("""
            select count(id) as quantity
            from diets
            where is_public = true
            and is_deleted = false
        """)
        result = await self._session.execute(query)
        quantity = result.fetchone()
        return (
            AllFreeDietQuantity(**quantity._asdict())
            if quantity
            else AllFreeDietQuantity()
        )

    async def get_all_expiring_diets(self, user_id: int) -> list[AllExpiredDiets]:
        query = text("""
            SELECT
                d.id,
                d.title,
                d.description,
                ud.user_id,
                ud.diet_id,
                (ud.end_date::DATE - CURRENT_DATE) AS days_remaining
            FROM diets d
            JOIN user_diets ud ON d.id = ud.diet_id
            JOIN user_relations ur ON ud.user_id = ur.user_id
            WHERE
                d.user_id = ur.professional_id
                and d.is_deleted = false
                AND ud.is_completed = false
                AND ud.end_date::DATE BETWEEN CURRENT_DATE AND CURRENT_DATE + 7
                AND ur.professional_id = :id
        """).bindparams(bindparam("id", user_id))
        result = await self._session.execute(query)
        expiring_diets = result.fetchall()
        return [AllExpiredDiets(**diet._asdict()) for diet in expiring_diets]

    async def get_name_last_diet(self, user_id: int) -> list[LastFinishedDiet]:
        query = text("""
            select
                d.id,
                d.title,
                ud.end_date
            from diets d
            join user_diets ud
                on d.id = ud.diet_id
            join users u
                on u.id = ud.user_id
            where u.id = :id
                  and ud.is_completed is true
            order by ud.end_date desc
            limit 1
        """).bindparams(bindparam("id", user_id))
        result = await self._session.execute(query)
        diet = result.fetchall()
        return [LastFinishedDiet(**dict(diet)) for diet in diet]

    async def get_all_finished_diets(self, user_id: int) -> list[DietData]:
        query = text("""
            select
                d.id,
                d.menu,
                ud.start_date,
                ud.end_date
            from diets d
            join user_diets ud
                on d.id = ud.diet_id
            join users u
                on u.id = ud.user_id
            where u.id = :id
                  and ud.is_completed is true
            order by ud.end_date desc
        """).bindparams(bindparam("id", user_id))
        result = await self._session.execute(query)
        diets = result.fetchall()
        return [DietData(**dict(diet)) for diet in diets]

    async def create_diet(self, form_diet: CreateDiet, user_id: int) -> None:
        new_diet = form_diet.model_dump(exclude={"user_id", "start_date"})
        diet = Diets(**new_diet, user_id=user_id)
        self._session.add(diet)
        await self._session.flush()
        await self._session.commit()
        if form_diet.start_date is not None and form_diet.user_id is not None:
            await self._create_user_diet(
                form_diet.user_id,
                diet.id,
                form_diet.start_date,
                form_diet.months_valid,
            )

    async def update_diet(self, diet_id: int, diet: UpdateDiet) -> None:
        update_data = {
            key: value
            for key, value in diet.model_dump().items()
            if value is not None
        }
        await self._session.execute(
            update(Diets).where(Diets.id == diet_id).values(**update_data)
        )
        await self._session.commit()

    async def delete_diet(self, diet_id: int) -> None:
        await self._session.execute(
            update(Diets).where(Diets.id == diet_id).values(is_deleted=True)
        )
        await self._session.commit()

    async def get_diets_by_professional(
        self, user_id: int
    ) -> list[DietsByProfissional]:
        query = text("""
            select
                d.id,
                d.title,
                d.description
            from diets d
            join users u
                on u.id = d.user_id
            where d.is_public is true
                and u.id = :id
        """).bindparams(bindparam("id", user_id))
        result = await self._session.execute(query)
        diets = result.fetchall()
        return [DietsByProfissional(**diet._asdict()) for diet in diets]

    async def get_all_free_diets(self) -> list[AllFreeDiets]:
        query = text("""
            select
                d.id,
                d.title,
                d.description
            from diets d
            where d.is_public = true
        """)
        result = await self._session.execute(query)
        diets = result.fetchall()
        return [AllFreeDiets(**diet._asdict()) for diet in diets]

    async def _create_user_diet(
        self, user_id: int, diet_id: int, start_date: datetime, months_valid: int
    ) -> None:
        user_diet = UserDiet(
            user_id=user_id,
            diet_id=diet_id,
            start_date=start_date,
            end_date=self.__calcule_diet_end_date(start_date, months_valid),
        )
        self._session.add(user_diet)
        await self._session.flush()
        await self._session.commit()

    @staticmethod
    def __calcule_diet_end_date(start_date: datetime, months_valid: int) -> str:
        return start_date + relativedelta(months=months_valid)
