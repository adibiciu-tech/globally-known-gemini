import asyncio
import httpx
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import time

load_dotenv('.env')

def simplify_definition(definition: str, max_length: int = 50) -> str:
    """Make definition shorter, simpler, and more colloquial"""
    # Take only the first clause
    for sep in [';', ' (', ' - ', ', or ', ', and ', ' that ', ' which ', ' when ']:
        if sep in definition:
            definition = definition.split(sep)[0]
    
    # Make more colloquial
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
    
    # Trim to max length
    if len(definition) > max_length:
        definition = definition[:max_length].rsplit(' ', 1)[0] + '...'
    
    definition = definition.rstrip('.,;:')
    
    if definition:
        definition = definition[0].upper() + definition[1:]
    
    return definition


async def fetch_definition(client: httpx.AsyncClient, word: str) -> str:
    """Fetch definition from Free Dictionary API"""
    try:
        response = await client.get(
            f"https://api.dictionaryapi.dev/api/v2/entries/en/{word.lower()}",
            timeout=10.0
        )
        
        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0:
                meanings = data[0].get("meanings", [])
                if meanings:
                    definitions = meanings[0].get("definitions", [])
                    if definitions:
                        definition = definitions[0].get("definition", "")
                        return simplify_definition(definition)
        elif response.status_code == 429:
            # Rate limited, wait and retry
            await asyncio.sleep(2)
            return await fetch_definition(client, word)
        return ""
    except Exception as e:
        print(f"Error fetching {word}: {e}")
        return ""


async def populate_definitions():
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    db = client[os.environ['DB_NAME']]
    
    # Get all words
    words = await db.words.find({}).to_list(None)
    total = len(words)
    print(f"Found {total} words to process")
    
    async with httpx.AsyncClient() as http_client:
        batch_size = 10
        for i in range(0, total, batch_size):
            batch = words[i:i+batch_size]
            
            for word_doc in batch:
                word = word_doc['word']
                
                # Skip if already has definition
                if word_doc.get('definition'):
                    continue
                
                definition = await fetch_definition(http_client, word)
                
                if definition:
                    await db.words.update_one(
                        {"word": word},
                        {"$set": {"definition": definition}}
                    )
                    print(f"[{i+1}/{total}] {word}: {definition}")
                else:
                    print(f"[{i+1}/{total}] {word}: No definition found")
                
                # Small delay to avoid rate limiting
                await asyncio.sleep(0.3)
            
            print(f"Processed {min(i+batch_size, total)}/{total} words...")
    
    client.close()
    print("Done!")


if __name__ == "__main__":
    asyncio.run(populate_definitions())
