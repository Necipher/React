import React from 'react'
import { useState, useEffect, useMemo } from 'react';

// Custom hook for handling state
function useAppState(initialData = null) {
  const [siteData, setSiteData] = useState(initialData || {});
  const [isLoading, setIsLoading] = useState(!initialData);

  const [showOverlay, setShowOverlay] = useState(false)

  const [displayCards, setDisplayCards] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDisplayFunction = () => setDisplayCards(!displayCards)

  async function loadData() {
    const req = await fetch('http://localhost:8000/api/fetchData');
    const data = await req.json();
    setSiteData(data);
    setIsLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [])

  async function updateRecipe(favorite, id) {
    const req = await fetch('http://localhost:8000/api/sendToServer', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ favorite, id })
    })

  }

  return ({
    state: {
      siteData,
      isLoading,
      displayCards,
      searchQuery,
      showOverlay

    },
    changeState: {
      setDisplayCards,
      setSearchQuery,
      setShowOverlay
    },
    action: {
      toggleDisplayFunction,
      updateRecipe
    }
  })
}

export default useAppState
