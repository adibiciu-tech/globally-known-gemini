from fastapi import APIRouter, HTTPException
from models import Category

router = APIRouter(prefix="/api/categories", tags=["categories"])

# Database will be injected
db = None

def set_db(database):
    global db
    db = database


@router.get("/")
async def get_all_categories():
    """Get all color vowel categories"""
    try:
        categories = await db.categories.find().to_list(100)
        # Remove MongoDB _id fields
        for category in categories:
            category.pop('_id', None)
        return categories
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
