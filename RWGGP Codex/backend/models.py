from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid


class Word(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    word: str
    stressedVowel: str
    colorCategory: str
    pronunciation: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)


class WordCreate(BaseModel):
    word: str
    stressedVowel: str
    colorCategory: str
    pronunciation: str


class Category(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    color: str
    sound: str
    keywords: List[str]


class CategoryCreate(BaseModel):
    name: str
    color: str
    sound: str
    keywords: List[str]
