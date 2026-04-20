import React from 'react'
import { useState, useEffect, useMemo } from 'react';

// Custom hook for handling state
function useAppState(initialData = null) {
  const [siteData, setSiteData] = useState(initialData || {});
  const [isLoading, setIsLoading] = useState(!initialData);
  const [favorites, setFavorites] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const [showOverlay, setShowOverlay] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [dataForEdit, setDataForEdit] = useState(false)

  const [displayCards, setDisplayCards] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [tempSearchResults, setTempSearchResults] = useState([]);


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

  async function updateRecipe(toData, favorite, id) {
    const req = await fetch('http://localhost:8000/api/sendToServer', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toData, favorite, id })
    })
    loadData()
  }

  async function changeRecipe(data, id) {
    const req = await fetch('http://localhost:8000/api/changeRecipe', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, id })
    })
    loadData()
  }

  async function deleteRecipe(id) {
    const req = await fetch('http://localhost:8000/api/deleteRecipe', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    loadData()
  }

  async function addRecipeToServer(data) {
    const req = await fetch('http://localhost:8000/api/addRecipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    })
    loadData()
  }

  function levenshtein(str1, str2) {
    const y = str1.length
    const x = str2.length

    const matrix = Array.from({ length: x + 1 }, () => Array(y + 1).fill(0))

    for (let i = 0; i <= x; i++) matrix[i][0] = i;
    for (let j = 0; j <= y; j++) matrix[0][j] = j;

    for (let e = 1; e <= x; e++) {
      for (let k = 1; k <= y; k++) {
        if (str1[e - 1] === str2[k - 1]) {
          matrix[e][k] = matrix[e - 1][k - 1]
        } else {
          matrix[e][k] = 1 + Math.min(
            matrix[e - 1][k],
            matrix[e][k - 1],
            matrix[e - 1][k - 1]
          )
        }
      }
    }

    return matrix[x][y]
  }

  function fuzzySearch(query, items, threshold = 2) {
    if (!query) return items.map(item => ({ item, distance: 0, score: 1 }));

    query = query.toLowerCase();

    return items
      .map(item => {
        const target = item.strMeal.toLowerCase();
        const words = target.split(/\s+/);

        const distances = [levenshtein(query, target), ...words.map(word => levenshtein(query, word))];

        const substringMatch = target.includes(query);

        const distance = substringMatch ? 0 : Math.min(...distances);
        const score = 1 - distance / Math.max(query.length, target.length);
        return { item, distance, score }
      })
      .filter(result => result.distance <= threshold)
      .sort((a, b) => a.distance - b.distance);
  }

  function fuzzySearchIngs(query, items, threshold = 2) {
    if (!query) return items.map(item => ({ item, distance: 0, score: 1 }));

    query = query.toLowerCase();

    return items
      .map(item => {
        const ingredientTargets = item.ingredients.map(a => a.ingredient.toLowerCase());

        const distances = ingredientTargets.flatMap(target => {
          const words = target.split(/\s+/);
          if (target.includes(query)) return [0];
          return [levenshtein(query, target), ...words.map(word => levenshtein(query, word))];
        });

        const distance = Math.min(...distances);
        const score = 1 - distance / Math.max(query.length, ...ingredientTargets.map(t => t.length));
        return { item, distance, score };
      })
      .filter(result => result.distance <= threshold)
      .sort((a, b) => a.distance - b.distance);
  }




  return ({
    state: {
      siteData,
      isLoading,
      displayCards,
      searchResults,
      tempSearchResults,
      showOverlay,
      dataForEdit,
      showEdit

    },
    changeState: {
      setDisplayCards,
      setSearchResults,
      setTempSearchResults,
      setShowOverlay,
      setDataForEdit,
      setShowEdit
    },
    action: {
      toggleDisplayFunction,
      updateRecipe,
      addRecipeToServer,
      changeRecipe,
      deleteRecipe,
      fuzzySearch,
      fuzzySearchIngs
    }
  })
}

export default useAppState
