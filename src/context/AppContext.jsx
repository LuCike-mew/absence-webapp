import { createContext, useContext, useState, useCallback, useRef } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children, initialState }) {
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedPairs, setSelectedPairs] = useState(new Set());
  const [selectedForDeletion, setSelectedForDeletion] = useState(new Set());
  const [toastText, setToastText] = useState('');
  const toastTimer = useRef(null);

  const showToast = useCallback((text) => {
    setToastText(text);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastText(''), 2000);
  }, []);

  /**
   * Переключение пары в режиме расписания.
   * key = `${dayIndex}_${pairNum}`
   */
  const togglePair = useCallback((key) => {
    setSelectedPairs((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  /**
   * Переключение пропуска для удаления в истории.
   */
  const toggleDeletion = useCallback((absenceId) => {
    setSelectedForDeletion((prev) => {
      const next = new Set(prev);
      if (next.has(absenceId)) {
        next.delete(absenceId);
      } else {
        next.add(absenceId);
      }
      return next;
    });
  }, []);

  const clearSelectedForDeletion = useCallback(() => {
    setSelectedForDeletion(new Set());
  }, []);

  const clearSelectedPairs = useCallback(() => {
    setSelectedPairs(new Set());
  }, []);

  const value = {
    ...initialState,
    activeTab,
    setActiveTab,
    selectedPairs,
    togglePair,
    clearSelectedPairs,
    selectedForDeletion,
    toggleDeletion,
    clearSelectedForDeletion,
    toastText,
    showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}