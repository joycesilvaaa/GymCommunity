# -*- coding: utf-8 -*-
from datetime import datetime

from sqlalchemy import (
    BIGINT,
    JSON,
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
    func,
    text,
)
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(AsyncAttrs, DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String)
    cpf: Mapped[str] = mapped_column(String, unique=True)
    is_active: Mapped[bool] = mapped_column(Boolean, server_default=text("true"))
    email: Mapped[str] = mapped_column(String, unique=True)
    password: Mapped[str] = mapped_column(String)
    user_profile: Mapped[int] = mapped_column(Integer)
    images = mapped_column(JSON, server_default=text("'[]'::jsonb"))
    birth_date: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    last_update: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )


class Diets(Base):
    __tablename__ = "diets"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String)
    menu: Mapped[JSON] = mapped_column(JSON, server_default=text("'{}'::jsonb"))
    user_id: Mapped[int] = mapped_column(
        BIGINT, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    is_public: Mapped[bool] = mapped_column(Boolean, server_default=text("false"))
    months_valid: Mapped[int] = mapped_column(
        Integer, comment="Number of months the menu is valid"
    )
    create_date: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    last_update: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )


class WorkoutPlans(Base):
    __tablename__ = "workout_plans"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String)
    plans: Mapped[JSON] = mapped_column(JSON, server_default=text("'[]'::jsonb"))
    user_id: Mapped[int] = mapped_column(
        BIGINT, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    is_public: Mapped[bool] = mapped_column(Boolean, server_default=text("false"))
    months_valid: Mapped[int] = mapped_column(
        Integer,
        server_default=text("3"),
        comment="Number of months the plan is valid",
    )
    days_per_week: Mapped[int] = mapped_column(
        Integer,
        server_default=text("5"),
        comment="Number of days per week the plan is valid",
    )
    type: Mapped[str] = mapped_column(
        String,
        server_default=text("'Musculação'"),
        comment="Type of workout plan",
    )
    create_date: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    last_update: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )


class ShoppingList(Base):
    __tablename__ = "shopping_lists"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(
        String, server_default=text("'Lista de compras'")
    )
    options: Mapped[JSON] = mapped_column(JSON, server_default=text("'[]'::jsonb"))
    user_id: Mapped[int] = mapped_column(
        BIGINT, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    diet_id: Mapped[int | None] = mapped_column(
        BIGINT, ForeignKey("diets.id", ondelete="CASCADE"), index=True
    )
    create_date: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    last_update: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )


class UserDiet(Base):
    __tablename__ = "user_diets"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        BIGINT, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    diet_id: Mapped[int] = mapped_column(
        BIGINT, ForeignKey("diets.id", ondelete="CASCADE"), index=True
    )
    is_actual: Mapped[bool] = mapped_column(Boolean, server_default=text("true"))
    is_completed: Mapped[bool] = mapped_column(Boolean, server_default=text("false"))
    progress: Mapped[float] = mapped_column(
        Float, server_default=text("0.0"), comment="User progress in percentage"
    )
    start_date: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), comment="Start date of the plan"
    )
    end_date: Mapped[datetime] = mapped_column(DateTime)
    last_update: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )


class UserTraining(Base):
    __tablename__ = "user_trainings"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        BIGINT, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    workout_plan_id: Mapped[int] = mapped_column(
        BIGINT, ForeignKey("workout_plans.id", ondelete="CASCADE"), index=True
    )
    is_actual: Mapped[bool] = mapped_column(Boolean, server_default=text("true"))
    is_completed: Mapped[bool] = mapped_column(Boolean, server_default=text("false"))
    start_date: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), comment="Start date of the plan"
    )
    daily_training: Mapped[int] = mapped_column(
        Integer, server_default=text("1"), comment="Daily training"
    )
    completed_days: Mapped[int] = mapped_column(
        Integer, server_default=text("0"), comment="Number of completed days"
    )
    progress: Mapped[float] = mapped_column(
        Float, server_default=text("0.0"), comment="User progress in percentage"
    )
    is_completed: Mapped[bool] = mapped_column(
        Boolean, server_default=text("false"), comment="Is the training completed?"
    )
    end_date: Mapped[datetime] = mapped_column(DateTime)
    last_update: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )


class UserProgressPost(Base):
    __tablename__ = "user_progress_posts"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        BIGINT, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    content: Mapped[str] = mapped_column(
        String, comment="Content of the progress post"
    )
    image_urls: Mapped[list[str]] = mapped_column(
        JSON, server_default=text("'[]'::jsonb"), comment="List of image URLs"
    )
    is_private: Mapped[bool] = mapped_column(
        Boolean,
        server_default=text("false"),
        comment="Indicates if the post is private",
    )
    create_date: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), comment="Date when the post was created"
    )
    last_update: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        comment="Date when the post was last updated",
    )


class Chat(Base):
    __tablename__ = "chats"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, index=True)
    title: Mapped[str | None] = mapped_column(
        String, nullable=True, comment="Title of the chat if it's a group"
    )
    create_date: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), comment="Date when the chat was created"
    )
    last_update: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        comment="Date when the chat was last updated",
    )


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, index=True)
    chat_id: Mapped[int] = mapped_column(
        BIGINT, ForeignKey("chats.id", ondelete="CASCADE"), index=True
    )
    user_id: Mapped[int] = mapped_column(
        BIGINT, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    content: Mapped[str] = mapped_column(String, comment="Content of the message")
    image_urls: Mapped[list[str]] = mapped_column(
        JSON, server_default=text("'[]'::jsonb"), comment="List of image URLs"
    )
    send_date: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), comment="Date when the message was sent"
    )


class Participant(Base):
    __tablename__ = "participants"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        BIGINT, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    chat_id: Mapped[int] = mapped_column(
        BIGINT, ForeignKey("chats.id", ondelete="CASCADE"), index=True
    )
    join_date: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        comment="Date when the user joined the chat",
    )
    __table_args__ = (UniqueConstraint("user_id", "chat_id", name="uq_user_chat"),)


class UserRelations(Base):
    __tablename__ = "user_relations"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        BIGINT, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    professional_id: Mapped[int] = mapped_column(
        BIGINT, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    create_date: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
