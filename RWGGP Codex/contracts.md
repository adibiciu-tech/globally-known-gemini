# Color Vowel Chart - Backend Integration Contracts

## API Endpoints

### 1. GET /api/words/random
- **Purpose**: Get a random word from the database
- **Response**: 
```json
{
  "word": "tree",
  "stressedVowel": "ee",
  "colorCategory": "GREEN TEA",
  "pronunciation": "tree"
}
```

### 2. GET /api/words/analyze/{word}
- **Purpose**: Analyze a specific word
- **Parameters**: word (string)
- **Response**: Same as random word OR 404 if not found

### 3. GET /api/words
- **Purpose**: Get all words (with optional filtering by color category)
- **Query params**: category (optional)
- **Response**: Array of word objects

### 4. POST /api/words
- **Purpose**: Add a new word to the database
- **Body**:
```json
{
  "word": "example",
  "stressedVowel": "a",
  "colorCategory": "GRAY DAY",
  "pronunciation": "ex-AM-ple"
}
```

### 5. GET /api/categories
- **Purpose**: Get all color vowel categories
- **Response**: Array of category objects with colors and sounds

## MongoDB Collections

### Collection: `words`
```json
{
  "_id": ObjectId,
  "word": "tree",
  "stressedVowel": "ee",
  "colorCategory": "GREEN TEA",
  "pronunciation": "tree",
  "createdAt": Date
}
```

### Collection: `categories`
```json
{
  "_id": ObjectId,
  "name": "GREEN TEA",
  "color": "#2D8659",
  "sound": "/iy/",
  "keywords": ["bee", "see", "team"]
}
```

## Mock Data to Replace

**File**: `/app/frontend/src/mock.js`
- Remove `wordDatabase` array
- Remove `colorVowelChart` array
- Remove mock functions

**Changes needed**:
- Replace `getRandomWord()` with API call to `/api/words/random`
- Replace `analyzeWord()` with API call to `/api/words/analyze/{word}`
- Fetch categories from `/api/categories` on app load

## Frontend Integration Steps

1. Create API service file (`/app/frontend/src/services/api.js`)
2. Update `App.js` to fetch from backend instead of mock
3. Update `ColorVowelLegend.jsx` to use API data
4. Remove mock.js imports
5. Add error handling for API failures

## Backend Implementation Steps

1. Create MongoDB models for words and categories
2. Implement CRUD endpoints
3. Seed database with initial word data
4. Add error handling and validation
5. Test endpoints with curl

## Data Migration

- Move all 56 words from mock.js to MongoDB
- Move all 14 categories to MongoDB
- Ensure GREEN TEA shows /iy/ notation
