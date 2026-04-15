import { Link } from "react-router-dom"

const SearchResultsDrop = ({ state, changeState }) => {

    return (
        <>
            {state?.searchResults?.length > 0 ?
                <div className='drop-results open'>
                    {state?.searchResults?.map((item, index) => <Link key={index} className="drop-down-search-button" to={`/recipe/${item.item.idMeal}`} onClick={() => changeState.setSearchResult([])}>{item.item.strMeal}</Link>).slice(0, 10)}
                </div> : ""
            }
        </>
    )
}

export default SearchResultsDrop
