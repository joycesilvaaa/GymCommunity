from enum import Enum


class UserProfile(Enum):
    _value_: int
    COMMON_USER = 1
    PHYSICAL_EDUCATOR = 2
    GUEST_NUTRITIONIST = 3
    ADMIN = 4


class UserPost(Enum):
    _value_: int
    PROGRESS = 1
    TIPS_SUGGESTIONS = 2
