import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Shuffle, Search } from 'lucide-react';
import WordDisplay from './components/WordDisplay';
import ColorVowelLegend from './components/ColorVowelLegend';
import WordHistory from './components/WordHistory';
import Savings from './components/Savings';
import SaveWordModal from './components/SaveWordModal';
import Metronome from './components/Metronome';
import MetronomeIcon from './components/MetronomeIcon';
import CategoryWordsModal from './components/CategoryWordsModal';
import { getRandomWord, analyzeWord, getAllCategories, getAllSavingLists } from './services/api';
import { toast, Toaster } from 'sonner';

function App() {
  const [currentWord, setCurrentWord] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [wordToSave, setWordToSave] = useState(null);
  const [savedWords, setSavedWords] = useState([]);
  const [metronomeOpen, setMetronomeOpen] = useState(false);
  const [saveModalPosition, setSaveModalPosition] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const metronomeButtonRef = useRef(null);

  const loadSavedWords = useCallback(async () => {
    try {
      const lists = await getAllSavingLists();
      const words = lists.flatMap(list => list.words?.map(w => w.word.toLowerCase()) || []);
      setSavedWords(words);
    } catch (error) {
      console.error('Failed to load saved words');
    }
  }, []);

  useEffect(() => {
    // Load categories on mount
    const loadCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        toast.error('Failed to load color vowel categories');
      }
    };
    loadCategories();
    loadSavedWords();
  }, [loadSavedWords]);

  const handleGenerateRandom = async () => {
    setLoading(true);
    try {
      const randomWord = await getRandomWord();
      setCurrentWord(randomWord);
      addToHistory(randomWord);
    } catch (error) {
      toast.error('Failed to generate random word');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeWord = async () => {
    if (!inputValue.trim()) {
      toast.error('Please enter a word to analyze');
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeWord(inputValue);
      if (result) {
        setCurrentWord(result);
        addToHistory(result);
        setInputValue('');
      } else {
        toast.error(`"${inputValue}" not found in the word database`);
      }
    } catch (error) {
      toast.error('Failed to analyze word');
    } finally {
      setLoading(false);
    }
  };

  const addToHistory = (wordData) => {
    setHistory(prev => [wordData, ...prev.slice(0, 19)]);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleWordClick = (wordData, event) => {
    setWordToSave(wordData);
    // Get position from the click event
    if (event) {
      const rect = event.currentTarget.getBoundingClientRect();
      setSaveModalPosition({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2,
      });
    }
    setSaveModalOpen(true);
  };

  const handleSaveModalClose = () => {
    setSaveModalOpen(false);
    setWordToSave(null);
    setSaveModalPosition(null);
  };

  const handleWordSaved = () => {
    // Refresh the savings list and saved words
    if (window.refreshSavingsLists) {
      window.refreshSavingsLists();
    }
    loadSavedWords();
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCategoryModalOpen(true);
  };

  const handleCategoryWordSelect = (wordData) => {
    setCurrentWord(wordData);
    // Add to history
    setHistory(prev => {
      const exists = prev.some(h => h.word === wordData.word);
      if (exists) return prev;
      return [wordData, ...prev].slice(0, 20);
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAnalyzeWord();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Toaster position="top-center" />
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Random Word Generator With Guided Pronunciation
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Database: 2,978 common English words
          </p>
          
          {/* Metronome Button */}
          <button
            ref={metronomeButtonRef}
            onClick={() => setMetronomeOpen(!metronomeOpen)}
            className="mt-4 mx-auto flex flex-col items-center gap-1 p-3 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <MetronomeIcon className="w-8 h-8 text-slate-600" />
            <span className="text-xs text-slate-500">Metronome</span>
          </button>
        </div>

        {/* Word Display */}
        {currentWord && (
          <div className="mb-6 animate-in fade-in duration-500">
            <WordDisplay wordData={currentWord} categories={categories} />
          </div>
        )}

        {/* Generate Button */}
        <div className="mb-4 flex justify-center">
          <Button
            onClick={handleGenerateRandom}
            size="lg"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 transition-all"
          >
            <Shuffle className="w-5 h-5 mr-2" />
            {loading ? 'Loading...' : 'Generate Random Word'}
          </Button>
        </div>

        {/* Analyze Input - moved below generate button */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Enter a word to analyze..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="flex-1"
            />
            <Button
              onClick={handleAnalyzeWord}
              variant="outline"
              disabled={loading}
              className="w-full md:w-auto"
            >
              <Search className="w-4 h-4 mr-2" />
              Analyze
            </Button>
          </div>
        </div>

        {/* Word History */}
        {history.length > 0 && (
          <div className="mb-8">
            <WordHistory 
              history={history} 
              onClear={handleClearHistory} 
              categories={categories}
              onWordClick={handleWordClick}
              savedWords={savedWords}
            />
          </div>
        )}

        {/* Savings */}
        <div className="mb-12">
          <Savings categories={categories} onWordSelect={setCurrentWord} />
        </div>

        {/* Color Vowel Legend */}
        <div className="mb-8">
          <ColorVowelLegend categories={categories} onCategoryClick={handleCategoryClick} />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500 mt-12">
          <p>Based on the Color Vowel Chart by Karen Taylor</p>
        </div>

        {/* Save Word Modal */}
        <SaveWordModal
          isOpen={saveModalOpen}
          onClose={handleSaveModalClose}
          wordData={wordToSave}
          onSaved={handleWordSaved}
          buttonPosition={saveModalPosition}
        />

        {/* Metronome Modal */}
        <Metronome
          isOpen={metronomeOpen}
          onClose={() => setMetronomeOpen(false)}
          buttonRef={metronomeButtonRef}
        />

        {/* Category Words Modal */}
        <CategoryWordsModal
          isOpen={categoryModalOpen}
          onClose={() => setCategoryModalOpen(false)}
          category={selectedCategory}
          onWordSelect={handleCategoryWordSelect}
        />
      </div>
    </div>
  );
}

export default App;