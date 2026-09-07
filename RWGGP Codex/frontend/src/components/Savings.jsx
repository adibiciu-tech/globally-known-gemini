import React, { useState, useEffect, useCallback } from 'react';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Bookmark, ChevronRight, Trash2, X } from 'lucide-react';
import { getAllSavingLists, deleteSavingList, removeWordFromList } from '../services/api';
import { getColorForCategory } from '../services/api';
import { toast } from 'sonner';

const Savings = ({ categories, onWordSelect }) => {
  const [lists, setLists] = useState([]);
  const [expandedList, setExpandedList] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadLists = useCallback(async () => {
    try {
      const data = await getAllSavingLists();
      setLists(data);
    } catch (error) {
      console.error('Failed to load lists');
    }
  }, []);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  const handleDeleteList = async (listId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this list?')) return;
    
    try {
      await deleteSavingList(listId);
      setLists(prev => prev.filter(l => l.id !== listId));
      if (expandedList === listId) setExpandedList(null);
      toast.success('List deleted');
    } catch (error) {
      toast.error('Failed to delete list');
    }
  };

  const handleRemoveWord = async (listId, word, e) => {
    e.stopPropagation();
    try {
      await removeWordFromList(listId, word);
      setLists(prev => prev.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            words: list.words.filter(w => w.word !== word)
          };
        }
        return list;
      }));
      toast.success('Word removed');
    } catch (error) {
      toast.error('Failed to remove word');
    }
  };

  const toggleList = (listId) => {
    setExpandedList(expandedList === listId ? null : listId);
  };

  // Refresh lists when component becomes visible
  const refreshLists = useCallback(() => {
    loadLists();
  }, [loadLists]);

  // Expose refresh function
  useEffect(() => {
    window.refreshSavingsLists = refreshLists;
    return () => {
      delete window.refreshSavingsLists;
    };
  }, [refreshLists]);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bookmark className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold">Savings</h3>
      </div>

      {lists.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-4">
          No saved lists yet. Click on a word in history to save it.
        </p>
      ) : (
        <div className="space-y-2">
          {lists.map((list) => (
            <div key={list.id} className="border rounded-lg overflow-hidden">
              {/* List Header */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleList(list.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleList(list.id); } }}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-50 transition-colors cursor-pointer"
                data-testid={`savings-list-toggle-${list.id}`}
              >
                <div className="flex items-center gap-2">
                  <ChevronRight 
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      expandedList === list.id ? 'rotate-90' : ''
                    }`}
                  />
                  <span className="font-medium">{list.name}</span>
                  <span className="text-sm text-slate-400">
                    ({list.words?.length || 0})
                  </span>
                </div>
                <button
                  onClick={(e) => handleDeleteList(list.id, e)}
                  className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition-colors"
                  data-testid={`savings-list-delete-${list.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* List Words */}
              {expandedList === list.id && list.words && list.words.length > 0 && (
                <div className="border-t bg-slate-50 p-2">
                  <ScrollArea className="max-h-40">
                    {list.words.map((wordItem) => {
                      const color = getColorForCategory(categories, wordItem.colorCategory);
                      return (
                        <div
                          key={wordItem.word}
                          className="flex items-center justify-between p-2 hover:bg-white rounded transition-colors cursor-pointer"
                          onClick={() => onWordSelect && onWordSelect(wordItem)}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-sm font-medium">{wordItem.word}</span>
                          </div>
                          <button
                            onClick={(e) => handleRemoveWord(list.id, wordItem.word, e)}
                            className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </ScrollArea>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default Savings;
