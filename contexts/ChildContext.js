'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const ChildContext = createContext();

export const ChildProvider = ({ children }) => {
  const [selectedChild, setSelectedChild] = useState(null);
  const [tempGender, setTempGender] = useState(null);

  // Initialize selected child from localStorage if available
  useEffect(() => {
    const savedChild = localStorage.getItem('selectedChild');
    if (savedChild) {
      try {
        setSelectedChild(JSON.parse(savedChild));
      } catch (e) {
        console.error('Failed to parse saved child', e);
      }
    }
  }, []);

  // Save selected child to localStorage when it changes
  useEffect(() => {
    if (selectedChild) {
      localStorage.setItem('selectedChild', JSON.stringify(selectedChild));
    } else {
      localStorage.removeItem('selectedChild');
    }
  }, [selectedChild]);

  const selectChild = (child) => {
    setSelectedChild(child);
    setTempGender(null); // Clear temp gender when a child is explicitly selected
  };

  const clearSelection = () => {
    setSelectedChild(null);
    setTempGender(null);
  };

  const value = {
    selectedChild,
    selectChild,
    clearSelection,
    tempGender,
    setTempGender,
    // Helper to get active gender for theme
    activeGender: tempGender || selectedChild?.gender || null
  };

  return (
    <ChildContext.Provider value={value}>
      {children}
    </ChildContext.Provider>
  );
};

export const useChild = () => {
  const context = useContext(ChildContext);
  if (!context) {
    throw new Error('useChild must be used within a ChildProvider');
  }
  return context;
};
