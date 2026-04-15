import { useOutletContext } from "react-router-dom"
import Cards from "../components/Cards"
import { useNavigate } from "react-router-dom"

const Favorites = () => {
    const { siteData, state, changeState, action } = useOutletContext();
    const navigate = useNavigate();
    const favorites = {
        "user": [...state?.siteData?.user?.filter(meal => meal.favorite === true)],
        "library": [...state?.siteData?.library?.filter(meal => meal.favorite === true)]
    }

    return (

        <div style={{ height: "100vh", width: "100vw" }}>
            {favorites.user.length === 0 && favorites.library.length === 0 ?
                <div style={{ display: 'flex', justifySelf: "center", width: "50%", marginTop: "50px"}}>
                    <button className='menu-button' style={{ boxShadow: "3px 3px 5px var(--shadow-color)" }} onClick={() => navigate("/")}>No Favorite recipes yet, return to Main Page</button>
                </div> :
                <div className={state.displayCards ? 'main-vertical' : 'main-horizontal'} style={{marginTop:"50px"}}>
                    <Cards
                        action={action}
                        data={favorites.user}
                        state={state}
                        user={true}
                        changeState={changeState}
                    />
                    <Cards
                        action={action}
                        data={favorites.library}
                        state={state}
                        user={false}
                        changeState={changeState}
                    />
                </div>
            }
        </div>
    )
}

export default Favorites
