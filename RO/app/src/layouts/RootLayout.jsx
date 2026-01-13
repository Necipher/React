import React from 'react'
import TopBar from '../components/TopBar'
import { Outlet, useLoaderData } from 'react-router-dom'
import useAppState from '../hooks/useAppState'
import AddRecipe from '../components/AddRecipe'

const RootLayout = () => {
    const { siteData, paginated } = useLoaderData();
    const { state, changeState, action } = useAppState(siteData)

    return (
        <div>
            <TopBar state={state} changeState={changeState} />
            {state.showOverlay && <AddRecipe changeState={changeState} action={action} />}
            <Outlet context={{ siteData, paginated, state, changeState, action }} />
        </div>
    )
}

export default RootLayout
