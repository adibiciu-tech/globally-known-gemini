from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import json
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]


categories_data = [
    {"name": "GREEN TEA", "color": "#33CC33", "sound": "/iy/", "keywords": ["bee", "see", "team"]},
    {"name": "SILVER PIN", "color": "#D9D9D9", "sound": "/ɪ/", "keywords": ["it", "sit", "spot"]},
    {"name": "GRAY DAY", "color": "#7F7F7F", "sound": "/ey/", "keywords": ["day", "say", "cake"]},
    {"name": "RED DRESS", "color": "#FF0000", "sound": "/e/", "keywords": ["bed", "next", "steps"]},
    {"name": "BLACK CAT", "color": "#000000", "sound": "/æ/", "keywords": ["cat", "bad", "magic"]},
    {"name": "WHITE TIE", "color": "#FFFFFF", "sound": "/ay/", "keywords": ["my", "time", "fly"]},
    {"name": "MUSTARD CUP", "color": "#F8F200", "sound": "/ʌ/", "keywords": ["up", "run", "come"]},
    {"name": "PURPLE SHIRT", "color": "#7030A0", "sound": "/ɜr/", "keywords": ["bird", "her", "work"]},
    {"name": "OLIVE SOCK", "color": "#808000", "sound": "/ɑ/", "keywords": ["hot", "not", "top"]},
    {"name": "BLUE MOON", "color": "#0070C0", "sound": "/uw/", "keywords": ["too", "moon", "blue"]},
    {"name": "WOODEN HOOK", "color": "#CA874A", "sound": "/u/", "keywords": ["book", "good", "look"]},
    {"name": "ROSE BOAT", "color": "#FF69A6", "sound": "/ow/", "keywords": ["go", "home", "boat"]},
    {"name": "ORANGE DOOR", "color": "#FF9900", "sound": "/or/", "keywords": ["door", "floor", "more"]},
    {"name": "TURQUOISE TOY", "color": "#00FFFF", "sound": "/oy/", "keywords": ["boy", "toy", "joy"]},
    {"name": "AUBURN DOG", "color": "#C00000", "sound": "/o/", "keywords": ["dog", "log", "fog"]},
    {"name": "BROWN COW", "color": "#C55A11", "sound": "/aw/", "keywords": ["how", "now", "drawn"]}
]


async def seed_database():
    print("Starting database seeding...")
    
    # Clear existing data
    await db.categories.delete_many({})
    await db.words.delete_many({})
    print("Cleared existing data")
    
    # Insert categories
    await db.categories.insert_many(categories_data)
    print(f"Inserted {len(categories_data)} categories")
    
    # Load words from generated JSON file
    try:
        with open('/app/backend/words_3000.json', 'r') as f:
            words_data = json.load(f)
        print(f"Loaded {len(words_data)} words from JSON file")
        
        # Insert words in batches for better performance
        batch_size = 500
        for i in range(0, len(words_data), batch_size):
            batch = words_data[i:i+batch_size]
            await db.words.insert_many(batch)
            print(f"Inserted batch {i//batch_size + 1}: {len(batch)} words")
        
        print(f"Successfully inserted all {len(words_data)} words")
    except FileNotFoundError:
        print("ERROR: words_3000.json not found. Please run generate_3000_words_accurate.py first")
    except Exception as e:
        print(f"ERROR: {e}")
    
    print("Database seeding completed!")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())
