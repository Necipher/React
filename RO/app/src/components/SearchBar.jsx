
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


function SearchBar({ state, changeState, action }) {
  const navigate = useNavigate()
  const [searchBarData, setSearchBarData] = useState("")
  const database = [
    ...(state?.siteData?.user),
    ...(state?.siteData?.library)
  ]

  function handleSearch(e) {
    const query = e.target.value
    setSearchBarData(query)

    if (query === "") {
      changeState.setSearchResults([])
    } else {
      changeState.setSearchResults(action.fuzzySearch(query, database))
    }


  }

  return (
    <input
      placeholder='Search...'
      className='search-bar'
      value={searchBarData}
      onChange={handleSearch}
      onKeyDown={(e) => e.key === "Enter" ? e.target.value === "" ? navigate('/') : navigate('/home/search') : null}
    />
  )
}

export default SearchBar
