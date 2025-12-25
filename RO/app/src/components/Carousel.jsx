import { useNavigate } from 'react-router-dom'
import CardItem from './CardItem'

function Carousel({ data }) {

  const navigate = useNavigate()

  const handleCarouselClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`)
  }

  return (
    <div className='carousel-grid'>
      <div className='carousel-inner'>

        {data.library.map(recipe => (
          <CardItem
            key={recipe.id}
            data={recipe}
            state={{ displayCards: true }}
            onClickOverride={() => handleCarouselClick(recipe.idMeal)}
          />
        ))}

        {data.library.map(recipe => (
          <CardItem
            key={`dup-${recipe.id}`}
            data={recipe}
            state={{ displayCards: true }}
            onClickOverride={() => handleCarouselClick(recipe.idMeal)}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel
