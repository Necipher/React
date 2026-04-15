
import SearchBar from './SearchBar'
import DropDownMenu from './DropDownMenu'
import SearchResultsDrop from './SearchResultsDrop';
import { useNavigate } from 'react-router-dom';

// Top Bar for showing basic moving around
function TopBar({ state, changeState, action }) {
  const navigate = useNavigate()
  return (
    <div className='Hero'>
      <SearchBar state={state} changeState={changeState} action={action} />
      <SearchResultsDrop state={state} changeState={changeState} />
      <section className='button-group' style={{ marginLeft: "auto" }}>
        <button className='top-bar-button' onClick={(e) => { e.preventDefault(); changeState.setShowOverlay(!state.showOverlay) }}>+</button>
        <button className='top-bar-button' onClick={() => navigate('/favorites')}>{"\u2605"}</button>
        <button className='top-bar-button' onClick={() => navigate('/')}>{"\u2302"}</button>
        <DropDownMenu />
      </section>
    </div>
  )
}

export default TopBar
