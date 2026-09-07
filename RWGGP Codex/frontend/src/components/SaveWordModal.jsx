import React, { useState, useEffect, useCallback } from 'react';
import { X, Plus, Search, Bookmark, FolderPlus } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { getAllSavingLists, createSavingList, addWordToList } from '../services/api';
import { toast } from 'sonner';

const SaveWordModal = ({ isOpen, onClose, wordData, onSaved, buttonPosition }) => {
  const [lists, setLists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newListName, setNewListName] = useState('');
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadLists = useCallback(async () => {
    try {
      const data = await getAllSavingLists();
      setLists(data);
    } catch (error) {
      toast.error('Failed to load lists');
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadLists();
    }
  }, [isOpen, loadLists]);

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      toast.error('Please enter a list name');
      return;
    }

    setLoading(true);
    try {
      const newList = await createSavingList(newListName.trim());
      setLists(prev => [...prev, newList]);
      setNewListName('');
      setShowCreateInput(false);
      toast.success('List created!');
    } catch (error) {
      if (error.response?.data?.detail === 'List name already exists') {
        toast.error('List name already exists');
      } else {
        toast.error('Failed to create list');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToList = async (listId, listName) => {
    setLoading(true);
    try {
      await addWordToList(listId, {
        word: wordData.word,
        colorCategory: wordData.colorCategory,
        stressedVowel: wordData.stressedVowel,
        definition: wordData.definition || ''
      });
      toast.success(`Added "${wordData.word}" to ${listName}`);
      onSaved && onSaved();
      onClose();
    } catch (error) {
      if (error.response?.data?.detail === 'Word already in list') {
        toast.error('Word already in this list');
      } else {
        toast.error('Failed to add word');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredLists = lists.filter(list =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  // Calculate position for popup - ensure it stays within viewport
  const getPopupStyle = () => {
    if (buttonPosition) {
      const popupWidth = 288; // w-72 = 18rem = 288px
      const popupHeight = 320; // approximate max height
      const padding = 16;
      
      let top = buttonPosition.top;
      let left = buttonPosition.left;
      
      // Adjust if popup would go off right edge
      if (left + popupWidth / 2 > window.innerWidth - padding) {
        left = window.innerWidth - popupWidth / 2 - padding;
      }
      // Adjust if popup would go off left edge
      if (left - popupWidth / 2 < padding) {
        left = popupWidth / 2 + padding;
      }
      // Adjust if popup would go off bottom edge
      if (top + popupHeight > window.innerHeight - padding) {
        top = buttonPosition.top - popupHeight - 40; // Show above button instead
      }
      
      return {
        position: 'fixed',
        top: top,
        left: left,
        transform: 'translateX(-50%)',
        zIndex: 50,
        maxHeight: 'calc(100vh - 32px)',
      };
    }
    return {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 50,
    };
  };

  return (
    <>
      {/* Invisible backdrop to close on click outside */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Context menu style popup */}
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-72 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        style={getPopupStyle()}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b bg-slate-50">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-indigo-600" />
            <h3 className="font-medium text-sm">Save "{wordData?.word}"</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search lists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 h-8 text-sm"
            />
          </div>
        </div>

        {/* Create New List */}
        <div className="p-2 border-b">
          {showCreateInput ? (
            <div className="flex gap-1">
              <Input
                type="text"
                placeholder="List name..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateList()}
                autoFocus
                className="flex-1 h-8 text-sm"
              />
              <Button onClick={handleCreateList} disabled={loading} size="sm" className="h-8 px-2">
                Add
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 px-2"
                onClick={() => {
                  setShowCreateInput(false);
                  setNewListName('');
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setShowCreateInput(true)}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors w-full p-2 rounded-lg hover:bg-indigo-50 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Create</span>
            </button>
          )}
        </div>

        {/* Lists */}
        <div className="max-h-48 overflow-y-auto">
          {filteredLists.length === 0 ? (
            <div className="p-4 text-center text-slate-500">
              <FolderPlus className="w-8 h-8 mx-auto mb-1 text-slate-300" />
              <p className="text-sm">No lists yet</p>
              <p className="text-xs">Create one to start saving</p>
            </div>
          ) : (
            <div className="p-1">
              {filteredLists.map((list) => (
                <button
                  key={list.id}
                  onClick={() => handleAddToList(list.id, list.name)}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors text-left text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-3 h-3 text-slate-400" />
                    <span className="font-medium">{list.name}</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {list.words?.length || 0}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SaveWordModal;
