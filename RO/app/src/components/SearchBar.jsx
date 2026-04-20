import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'


function SearchBar({ state, changeState, action }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchBarData, setSearchBarData] = useState("");
  const database = [
    ...(state?.siteData?.user),
    ...(state?.siteData?.library)
  ];

  function handleSearch(e) {
    const query = e.target.value
    setSearchBarData(query)

    if (query === "") {
      changeState.setSearchResults([])
    } else {
      if (location.pathname === '/ingredients') {
        changeState.setSearchResults(action.fuzzySearchIngs(query, database))
      } else {
        changeState.setSearchResults(action.fuzzySearch(query, database))
      }
    }
  }

  function handleKeyDown(e) {
    if (e.key !== "Enter") return

    if (e.key === "Enter" && e.target.value !== "") {
      navigate('/home/search');
      changeState.setTempSearchResults(state.searchResults)
    } else {
      navigate('/')
    }
  }

  return (
    <input
      placeholder='Search...'
      className='search-bar'
      value={searchBarData}
      onChange={handleSearch}
      onKeyDown={handleKeyDown}
    />
  )
}

export default SearchBar
