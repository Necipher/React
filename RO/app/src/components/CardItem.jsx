import SectionList from './SectionList';
import { useState } from 'react';
import { Link } from 'react-router-dom';


// Card item - that houses the recepie and ingredients
function CardItem({ data, state, action, onClickOverride }) {
  const [expanded, setExpanded] = useState(false)
  const [localCardData, setLocalCardData] = useState({ 'favorite': data.favorite })

  const mode = state.displayCards ? "vertical" : "horizontal";
  const toggleExpanded = () => setExpanded(prev => !prev);
  const handleClick = onClickOverride || toggleExpanded

  return (
    // Div-Wrapper container for styling 
    <div
      className={`cardItem ${mode}`}
      tabIndex={-1}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setExpanded(false)
        }
      }}
    >
      {/* Title section: name and photo */}
      <header
        className={`firstRow ${expanded && "open"}`}
        onClick={handleClick}
      >
        <p className={`cardTitle`}>{data.strMeal}</p>
        <img
          src={data.strMealThumb}
          className={`cardPhoto`} />
      </header>

      {/* Middle section: Ingredients and Instructions, is collapsable/expandable */}
      <div
        className={`secondRow ${expanded && "open"}`}
      >
        {expanded && <SectionList title={"Ingredients:"} items={data.ingredients} />}   {/* The "expanded state condition is important for better site performance" */}
      </div>

      {/* Footer section: buttons */}
      <footer
        className={`thirdRow`}
      >    {/* Section for functionality buttons */}
        <section>
          <Link to={`/recipe/${data.idMeal}`}>
            <button className='round-elongated-button'>Show Instructions</button>
          </Link>
        </section>
        <section>
          <button onClick={() => {
            const newFavorite = !localCardData.favorite
            setLocalCardData({...localCardData, 'favorite': newFavorite})
          action.updateRecipe(newFavorite, data.idMeal)
          }} className={`round-button favorite-button ${localCardData.favorite && 'active'}`}></button>
      </section>
    </footer>
    </div >
  )
}

export default CardItem
