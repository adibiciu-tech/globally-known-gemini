"""
Generate 3000 most common English words with accurate Color Vowel Chart classifications
using the CMU Pronouncing Dictionary via the 'pronouncing' library
"""

import pronouncing
import json

# ARPAbet to Color Vowel Chart mapping
ARPA_TO_CATEGORY = {
    # GREEN TEA /iy/ - IY sound
    'IY': 'GREEN TEA',
    
    # RED PEPPER /e/ - EH sound
    'EH': 'RED PEPPER',
    
    # SILVER PIN /ɪ/ - IH sound
    'IH': 'SILVER PIN',
    
    # PURPLE SHIRT /ɜr/ - ER sound
    'ER': 'PURPLE SHIRT',
    
    # BROWN COW /aw/ - AW sound
    'AW': 'BROWN COW',
    
    # WHITE TIE /ay/ - AY sound
    'AY': 'WHITE TIE',
    
    # BLACK CAT /æ/ - AE sound
    'AE': 'BLACK CAT',
    
    # OLIVE SOCK /ɑ/ - AA sound
    'AA': 'OLIVE SOCK',
    
    # BLUE MOON /uw/ - UW sound
    'UW': 'BLUE MOON',
    
    # ROSE BOAT /oʊ/ - OW sound
    'OW': 'ROSE BOAT',
    
    # ORANGE DOOR /or/ - AO sound
    'AO': 'ORANGE DOOR',
    
    # GRAY DAY /ey/ - EY sound
    'EY': 'GRAY DAY',
    
    # WOODEN HOOK /u/ - UH sound  
    'UH': 'WOODEN HOOK',
    
    # MUSTARD CUP /ʌ/ - AH sound
    'AH': 'MUSTARD CUP',
    
    # TURQUOISE TOY /oy/ - OY sound
    'OY': 'TURQUOISE TOY',
    
    # AUBURN DOG /o/ - Use AA for now (similar sound)
    # Note: CMU dict doesn't have a separate /o/ phone, using AA
}

def get_stressed_vowel_info(word):
    """
    Get the stressed vowel and its Color Vowel Chart category for a word.
    Returns dict with category, arpa phone, and stressed vowel representation.
    Enhanced to handle multiple pronunciations and better vowel position detection.
    """
    phones_list = pronouncing.phones_for_word(word.lower())
    
    if not phones_list:
        return None
    
    # Try all pronunciations and pick the best one
    # Prefer pronunciations with primary stress on later syllables for multi-syllable words
    best_result = None
    best_score = -1
    
    for phones_str in phones_list:
        phones = phones_str.split()
        
        # Find the primary stressed vowel (ends with '1')
        stressed_phone = None
        stressed_phone_index = -1
        
        for i, phone in enumerate(phones):
            if phone[-1] == '1':  # Primary stress
                stressed_phone = phone[:-1]  # Remove stress marker
                stressed_phone_index = i
                break
        
        if not stressed_phone:
            # If no primary stress, look for secondary stress ('2')
            for i, phone in enumerate(phones):
                if phone[-1] == '2':
                    stressed_phone = phone[:-1]
                    stressed_phone_index = i
                    break
        
        if not stressed_phone:
            # No stress markers - use first vowel
            for i, phone in enumerate(phones):
                if phone[0] in ['A', 'E', 'I', 'O', 'U']:
                    stressed_phone = phone[:-1] if phone[-1] in '012' else phone
                    stressed_phone_index = i
                    break
        
        if not stressed_phone:
            continue
        
        # Map to Color Vowel Chart category
        category = ARPA_TO_CATEGORY.get(stressed_phone, 'BLACK CAT')
        
        # Extract the actual vowel letters and position
        stressed_vowel_result = extract_vowel_letters_v2(word, phones, stressed_phone_index, stressed_phone)
        stressed_vowel, vowel_position = stressed_vowel_result
        
        # Score this pronunciation (prefer later stress for verbs, earlier for nouns)
        # For now, prefer pronunciations where stress is on a later syllable
        vowel_count = sum(1 for p in phones if p[0] in ['A', 'E', 'I', 'O', 'U'])
        stress_position = sum(1 for i, p in enumerate(phones[:stressed_phone_index]) if p[0] in ['A', 'E', 'I', 'O', 'U'])
        
        # Score: prefer stress on second syllable for 2+ syllable words
        if vowel_count >= 2 and stress_position >= 1:
            score = 10  # High score for stress on non-first syllable
        else:
            score = 5  # Lower score for first syllable stress
        
        if score > best_score:
            best_score = score
            best_result = {
                'category': category,
                'arpa': stressed_phone,
                'vowel_letters': stressed_vowel or word[0],
                'vowel_position': vowel_position,
                'full_pronunciation': ' '.join(phones),
                'stress_position': stress_position
            }
    
    return best_result

def extract_vowel_letters_v2(word, phones, phone_index, stressed_phone):
    """
    Enhanced vowel letter extraction using phonetic information.
    Better handles counting vowel positions to match letters to sounds.
    Returns tuple of (vowel_string, start_position_in_word)
    """
    word_lower = word.lower()
    
    # Count how many vowel sounds come before the stressed one
    vowel_sounds_before = 0
    for i in range(phone_index):
        if phones[i][0] in ['A', 'E', 'I', 'O', 'U']:
            vowel_sounds_before += 1
    
    # Map ARPA phones to likely letter patterns
    arpa_to_letters = {
        'IY': ['ee', 'ea', 'ie', 'e', 'i', 'y', 'ey'],
        'IH': ['i', 'y', 'e', 'ui'],
        'EH': ['e', 'ea', 'a', 'ie'],
        'AE': ['a'],
        'AA': ['o', 'a'],
        'AO': ['o', 'a', 'aw', 'au', 'or'],
        'UH': ['oo', 'u', 'ou'],
        'UW': ['oo', 'u', 'ew', 'ue', 'ou', 'ui'],
        'AH': ['u', 'o', 'ou', 'a'],
        'ER': ['er', 'ir', 'ur', 'or', 'ear', 'our'],
        'AY': ['i', 'igh', 'y', 'ie', 'ai'],
        'EY': ['a', 'ay', 'ai', 'ei', 'ey'],
        'OW': ['o', 'oa', 'ow', 'oe', 'ou'],
        'AW': ['ou', 'ow', 'au'],
        'OY': ['oy', 'oi']
    }
    
    # Get likely patterns for this phone
    likely_patterns = arpa_to_letters.get(stressed_phone, ['a', 'e', 'i', 'o', 'u'])
    
    # Find all vowel letter groups in the word with their positions
    vowel_groups = []
    i = 0
    while i < len(word_lower):
        # Check for multi-letter vowel patterns first
        found_pattern = False
        for pattern in likely_patterns:
            if len(pattern) > 1 and word_lower[i:i+len(pattern)] == pattern:
                vowel_groups.append((i, pattern))
                i += len(pattern)
                found_pattern = True
                break
        
        if not found_pattern:
            # Single vowel or y acting as vowel
            if word_lower[i] in 'aeiou':
                vowel_groups.append((i, word_lower[i]))
                i += 1
            elif word_lower[i] == 'y' and i > 0:
                # y acts as vowel when not at start
                vowel_groups.append((i, 'y'))
                i += 1
            else:
                i += 1
    
    # If we found vowel groups, use the one at the right position
    if vowel_groups and vowel_sounds_before < len(vowel_groups):
        pos, vowel_str = vowel_groups[vowel_sounds_before]
        return (vowel_str, pos)
    
    # Fallback: try to match specific patterns for this phone in order
    for pattern in likely_patterns:
        if pattern in word_lower:
            pos = word_lower.find(pattern)
            return (pattern, pos)
    
    # Last resort: return first vowel
    for i, char in enumerate(word_lower):
        if char in 'aeiouy':
            return (char, i)
    
    return ('a', 0)  # Ultimate fallback

def extract_vowel_letters(word, phones, vowel_index):
    """
    Attempt to extract the vowel letters corresponding to a phone.
    Improved to handle 'y' as vowel and better vowel detection.
    """
    word_lower = word.lower()
    
    # Common vowel digraphs and patterns (order matters - check longest first)
    vowel_patterns = [
        'ough', 'augh', 'eigh',  # 4-letter patterns
        'igh', 'our', 'oor', 'air', 'ear', 'eer', 'ire', 'ore', 'ure',  # 3-letter
        'ee', 'ea', 'ie', 'oo', 'ou', 'ow', 'ay', 'ai', 'oi', 'oy',
        'au', 'aw', 'ew', 'ue', 'ui', 'oa', 'oe', 'er', 'ir', 'ur', 
        'ar', 'or', 'eu', 'eo', 'ae', 'ao'  # 2-letter
    ]
    
    # First, try to find multi-letter vowel patterns
    for pattern in vowel_patterns:
        if pattern in word_lower:
            return pattern
    
    # Extract all vowel positions (including 'y' when it acts as vowel)
    vowel_positions = []
    for i, char in enumerate(word_lower):
        if char in 'aeiou':
            vowel_positions.append((i, char))
        elif char == 'y':
            # 'y' acts as vowel when not at beginning or when between consonants
            if i > 0 and (i == len(word_lower) - 1 or 
                         (i > 0 and word_lower[i-1] not in 'aeiou' and 
                          (i == len(word_lower) - 1 or word_lower[i+1] not in 'aeiou'))):
                vowel_positions.append((i, char))
    
    if not vowel_positions:
        return 'a'  # fallback
    
    # Use the vowel_index to pick the right vowel
    # But be smart about stressed syllables (usually not the last weak syllable)
    if vowel_index < len(vowel_positions):
        return vowel_positions[vowel_index][1]
    
    # For words where we can't determine, use the first or middle vowel
    # Heuristic: stressed vowel is often in first syllable for 2-syllable words
    if len(vowel_positions) <= 2:
        return vowel_positions[0][1]
    else:
        # For longer words, often the first or second syllable is stressed
        return vowel_positions[min(1, len(vowel_positions)-1)][1]

def load_common_words():
    """Load 3000 most common English words from Oxford 3000 list"""
    try:
        with open('/app/backend/oxford_3000.txt', 'r', encoding='utf-8') as f:
            words = [line.strip() for line in f if line.strip()]
        print(f"Loaded {len(words)} words from Oxford 3000 list")
        return words
    except FileNotFoundError:
        print("Oxford 3000 file not found, using fallback list")
        # Fallback to basic list if file not found
        return ["the", "be", "to", "of", "and", "a", "in", "that", "have"]

def generate_word_database():
    """Generate classified word database"""
    common_words = load_common_words()
    word_data = []
    successful = 0
    failed = []
    
    for word in common_words:
        info = get_stressed_vowel_info(word)
        if info:
            word_data.append({
                'word': word.lower(),
                'stressedVowel': info['vowel_letters'],
                'vowelPosition': info.get('vowel_position', 0),
                'colorCategory': info['category'],
                'pronunciation': word  # Simplified
            })
            successful += 1
        else:
            failed.append(word)
            # Add with default classification
            word_data.append({
                'word': word.lower(),
                'stressedVowel': 'a',
                'vowelPosition': 0,
                'colorCategory': 'BLACK CAT',
                'pronunciation': word
            })
    
    print(f"Successfully classified: {successful}/{len(common_words)}")
    if failed:
        print(f"Failed to classify {len(failed)} words: {failed[:10]}...")
    
    return word_data

if __name__ == '__main__':
    print("Generating word database with phonetic analysis...")
    words = generate_word_database()
    
    # Print first 20 as examples
    print("\nFirst 20 words:")
    for w in words[:20]:
        print(f"  {w['word']:15} -> {w['colorCategory']:20} (vowel: {w['stressedVowel']})")
    
    # Save to JSON file
    with open('/app/backend/words_3000.json', 'w') as f:
        json.dump(words, indent=2, fp=f)
    
    print(f"\nSaved {len(words)} words to words_3000.json")
