from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from bson import ObjectId

router = APIRouter(prefix="/api/savings", tags=["savings"])

# Database will be injected
db = None

def set_db(database):
    global db
    db = database


class CreateListRequest(BaseModel):
    name: str


class AddWordRequest(BaseModel):
    word: str
    colorCategory: str
    stressedVowel: Optional[str] = None
    definition: Optional[str] = None


@router.get("/lists")
async def get_all_lists():
    """Get all saving lists"""
    try:
        lists = await db.saving_lists.find().to_list(100)
        result = []
        for lst in lists:
            lst['id'] = str(lst['_id'])
            lst.pop('_id', None)
            result.append(lst)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/lists")
async def create_list(request: CreateListRequest):
    """Create a new saving list"""
    try:
        # Check if list name already exists
        existing = await db.saving_lists.find_one({"name": request.name})
        if existing:
            raise HTTPException(status_code=400, detail="List name already exists")
        
        new_list = {
            "name": request.name,
            "words": []
        }
        result = await db.saving_lists.insert_one(new_list)
        return {"id": str(result.inserted_id), "name": request.name, "words": []}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/lists/{list_id}")
async def get_list(list_id: str):
    """Get a specific saving list"""
    try:
        lst = await db.saving_lists.find_one({"_id": ObjectId(list_id)})
        if not lst:
            raise HTTPException(status_code=404, detail="List not found")
        
        lst['id'] = str(lst['_id'])
        lst.pop('_id', None)
        return lst
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/lists/{list_id}/words")
async def add_word_to_list(list_id: str, request: AddWordRequest):
    """Add a word to a saving list"""
    try:
        lst = await db.saving_lists.find_one({"_id": ObjectId(list_id)})
        if not lst:
            raise HTTPException(status_code=404, detail="List not found")
        
        # Check if word already in list
        existing_words = [w['word'] for w in lst.get('words', [])]
        if request.word in existing_words:
            raise HTTPException(status_code=400, detail="Word already in list")
        
        word_data = {
            "word": request.word,
            "colorCategory": request.colorCategory,
            "stressedVowel": request.stressedVowel,
            "definition": request.definition
        }
        
        await db.saving_lists.update_one(
            {"_id": ObjectId(list_id)},
            {"$push": {"words": word_data}}
        )
        
        return {"message": "Word added successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/lists/{list_id}/words/{word}")
async def remove_word_from_list(list_id: str, word: str):
    """Remove a word from a saving list"""
    try:
        result = await db.saving_lists.update_one(
            {"_id": ObjectId(list_id)},
            {"$pull": {"words": {"word": word}}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Word not found in list")
        
        return {"message": "Word removed successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/lists/{list_id}")
async def delete_list(list_id: str):
    """Delete a saving list"""
    try:
        result = await db.saving_lists.delete_one({"_id": ObjectId(list_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="List not found")
        
        return {"message": "List deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
