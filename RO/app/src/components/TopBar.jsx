
import SearchBar from './SearchBar'
import DropDownMenu from './DropDownMenu'

// Top Bar for showing basic moving around
function TopBar({ state, changeState }) {
  return (
    <div className='Hero'>
      <SearchBar state={state} changeState={changeState} />
      <button className='top-bar-button'>{"\u2605"}</button>
      <button className='top-bar-button' onClick={(e) => {e.preventDefault(); changeState.setShowOverlay(!state.showOverlay)}}>+</button>
      <DropDownMenu />
    </div>
  )
}

export default TopBar
