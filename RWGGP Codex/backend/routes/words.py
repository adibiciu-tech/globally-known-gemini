from fastapi import APIRouter, HTTPException
from models import Word, WordCreate
import secrets
import httpx

router = APIRouter(prefix="/api/words", tags=["words"])

# Simple in-memory cache for definitions
definition_cache = {}

# Database will be injected
db = None

def set_db(database):
    global db
    db = database


@router.get("/random")
async def get_random_word():
    """Get a random word from the database"""
    try:
        # Count total words
        count = await db.words.count_documents({})
        if count == 0:
            raise HTTPException(status_code=404, detail="No words found in database")
        
        # Get random word (use secrets for a cryptographically secure choice)
        random_index = secrets.randbelow(count)
        cursor = db.words.find().skip(random_index).limit(1)
        word_doc = await cursor.to_list(1)
        
        if not word_doc:
            raise HTTPException(status_code=404, detail="Word not found")
        
        word_data = word_doc[0]
        # Remove MongoDB _id field
        word_data.pop('_id', None)
        return word_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/analyze/{word}")
async def analyze_word(word: str):
    """Analyze a specific word"""
    try:
        word_doc = await db.words.find_one({"word": word.lower()})
        if not word_doc:
            raise HTTPException(status_code=404, detail=f"Word '{word}' not found in database")
        
        # Remove MongoDB _id field
        word_doc.pop('_id', None)
        return word_doc
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
async def get_all_words(category: str = None):
    """Get all words, optionally filtered by category"""
    try:
        query = {}
        if category:
            query["colorCategory"] = category
        
        words = await db.words.find(query).to_list(1000)
        # Remove MongoDB _id fields
        for word in words:
            word.pop('_id', None)
        return words
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/")
async def create_word(word_input: WordCreate):
    """Add a new word to the database"""
    try:
        # Check if word already exists
        existing = await db.words.find_one({"word": word_input.word.lower()})
        if existing:
            raise HTTPException(status_code=400, detail="Word already exists")
        
        word_dict = word_input.dict()
        word_dict["word"] = word_dict["word"].lower()
        word_obj = Word(**word_dict)
        
        await db.words.insert_one(word_obj.dict())
        return {"message": "Word added successfully", "word": word_obj.dict()}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def simplify_definition(definition: str, max_length: int = 50) -> str:
    """Make definition shorter, simpler, and more colloquial"""
    # Take only the first clause (before semicolon, comma with conjunction, or parenthesis)
    for sep in [';', ' (', ' - ', ', or ', ', and ', ' that ', ' which ', ' when ']:
        if sep in definition:
            definition = definition.split(sep)[0]
    
    # Make more colloquial - replace formal phrases
    replacements = {
        'Used to ': 'To ',
        'The act of ': '',
        'The state of being ': 'Being ',
        'The quality of being ': 'Being ',
        'A person who ': 'Someone who ',
        'A thing that ': 'Something that ',
        'One who ': 'Someone who ',
        'That which ': 'What ',
        'In a manner that is ': '',
        'Characterized by ': 'Having ',
        'Pertaining to ': 'About ',
        'Of or relating to ': 'About ',
        'Having the nature of ': 'Like ',
        'To cause to ': 'To make something ',
        'To make or become ': 'To become ',
        'A state of ': '',
        'The process of ': '',
        'An instance of ': '',
    }
    
    for formal, casual in replacements.items():
        if definition.startswith(formal):
            definition = casual + definition[len(formal):]
            break
    
    # Lowercase the first letter if it starts with a capital after replacement
    if definition and definition[0].isupper() and not definition.startswith(('I ', 'A ', 'An ')):
        # Check if it's not a proper noun (simple heuristic)
        words = definition.split()
        if len(words) > 1 and words[1][0].islower():
            definition = definition[0].lower() + definition[1:]
    
    # Trim to max length at word boundary
    if len(definition) > max_length:
        definition = definition[:max_length].rsplit(' ', 1)[0] + '...'
    
    # Remove trailing punctuation and clean up
    definition = definition.rstrip('.,;:')
    
    # Capitalize first letter
    if definition:
        definition = definition[0].upper() + definition[1:]
    
    return definition


@router.get("/definition/{word}")
async def get_definition(word: str):
    """Get the definition of a word from Free Dictionary API"""
    try:
        # Check cache first
        if word.lower() in definition_cache:
            return {"word": word, "definition": definition_cache[word.lower()]}
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.dictionaryapi.dev/api/v2/entries/en/{word.lower()}",
                timeout=5.0
            )
            
            if response.status_code == 200:
                data = response.json()
                if data and len(data) > 0:
                    # Get the first definition from the first meaning
                    meanings = data[0].get("meanings", [])
                    if meanings:
                        definitions = meanings[0].get("definitions", [])
                        if definitions:
                            definition = definitions[0].get("definition", "No definition found")
                            # Simplify the definition
                            definition = simplify_definition(definition)
                            # Cache the result
                            definition_cache[word.lower()] = definition
                            return {"word": word, "definition": definition}
            
            return {"word": word, "definition": "Definition not available"}
    except Exception as e:
        return {"word": word, "definition": "Definition not available"}
