import React from 'react'
import { useOutletContext } from 'react-router-dom'
import Cards from '../components/Cards'


const MyRecipes = () => {
    const { siteData, state, changeState, action } = useOutletContext()

    return (
        <div style={{ height: "100vh", width: "100vw"}}>
            <div className={state.displayCards ? 'main-vertical' : 'main-horizontal'} style={{ marginTop: "50px" }}>
                {state?.siteData?.user?.length === 0 ?
                    <div style={{ display:'flex', justifySelf: "center", width: "100%"}}>
                        <button className='menu-button' style={{boxShadow: "3px 3px 5px var(--shadow-color)"}} onClick={(e) => { e.preventDefault(); changeState.setShowOverlay(!state.showOverlay) }}>No own recipes added yet, add a recipe</button>
                    </div>
                    :
                    <Cards
                        action={action}
                        data={state.siteData.user}
                        state={state}
                        user={true}
                        changeState={changeState}
                    />
                }
            </div>
        </div>
    )
}

export default MyRecipes


