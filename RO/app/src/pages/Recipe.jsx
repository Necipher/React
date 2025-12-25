import { useOutletContext } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import Instructions from '../components/Instructions'
import ScrollToTop from '../components/ScrollToTop'


const Recipe = () => {
    const { siteData } = useOutletContext()
    const { id } = useParams()
    const chosenRecipe = siteData?.library?.find(recipe => recipe.idMeal == id)

    return (
        <div>
            <ScrollToTop />
            <Instructions recipe={chosenRecipe}/>
        </div>
    )
}

export default Recipe
