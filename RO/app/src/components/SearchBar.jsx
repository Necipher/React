
import { useState, useEffect } from 'react'


function SearchBar({ state, changeState }) {
  const [searchBarData, setSearchBarData] = useState('')

  useEffect(() => {
    if (!state?.siteData?.library) return

    let found = []

    if (searchBarData.trim() !== '') {
      found = state.siteData.library.filter(item =>
        item.strMeal.toLowerCase().includes(searchBarData.toLowerCase())
      )
    }

    changeState.setSearchQuery(found)
  }, [searchBarData, state?.siteData?.library])


  return (
    <input
      placeholder='Search...'
      className='search-bar'
      value={searchBarData}
      onChange={(e) => setSearchBarData(e.target.value)}
    />
  )
}

export default SearchBar
