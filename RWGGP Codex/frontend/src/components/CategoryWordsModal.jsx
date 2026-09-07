import React, { useState, useEffect, useCallback } from 'react';
import { X, Search } from 'lucide-react';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { getWordsByCategory } from '../services/api';

const CategoryWordsModal = ({ isOpen, onClose, category, onWordSelect }) => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadWords = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getWordsByCategory(category.name);
      setWords(data);
    } catch (error) {
      console.error('Failed to load words');
    }
    setLoading(false);
  }, [category]);

  useEffect(() => {
    if (isOpen && category) {
      loadWords();
    }
  }, [isOpen, category, loadWords]);

  const filteredWords = words.filter(word =>
    word.word.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen || !category) return null;

  // Determine text color based on background brightness
  const getTextColor = (hexColor) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  const textColor = getTextColor(category.color);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-40" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div 
          className="p-4 border-b"
          style={{ backgroundColor: category.color }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xl" style={{ color: textColor }}>
                {category.name}
              </h3>
              <p className="text-sm opacity-80" style={{ color: textColor }}>
                {category.sound} • {words.length} words
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full transition-colors hover:bg-black/10"
              style={{ color: textColor }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search words..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Words List */}
        <ScrollArea className="h-80">
          {loading ? (
            <div className="p-8 text-center text-slate-500">
              Loading words...
            </div>
          ) : filteredWords.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No words found
            </div>
          ) : (
            <div className="p-2">
              <div className="grid grid-cols-3 gap-1">
                {filteredWords.map((wordItem) => {
                  // Render word with underlined stressed vowel
                  const { word, stressedVowel, vowelPosition } = wordItem;
                  const vowelLength = stressedVowel ? stressedVowel.length : 1;
                  const before = word.substring(0, vowelPosition);
                  const stressed = word.substring(vowelPosition, vowelPosition + vowelLength);
                  const after = word.substring(vowelPosition + vowelLength);
                  
                  return (
                    <button
                      key={wordItem.word}
                      onClick={() => {
                        onWordSelect && onWordSelect(wordItem);
                        onClose();
                      }}
                      className="p-2 text-left rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium truncate"
                      title={wordItem.word}
                      style={{ color: category.color }}
                    >
                      {before}
                      <span className="underline decoration-2">{stressed}</span>
                      {after}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  );
};

export default CategoryWordsModal;
