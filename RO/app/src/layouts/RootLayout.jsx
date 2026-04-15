import React from 'react'
import TopBar from '../components/TopBar'
import { Outlet, useLoaderData } from 'react-router-dom'
import useAppState from '../hooks/useAppState'
import AddRecipe from '../components/AddRecipe'
import EditRecipe from '../components/EditRecipe'

const RootLayout = () => {
    const { siteData, paginated } = useLoaderData();
    const { state, changeState, action } = useAppState(siteData)

    return (
        <div>
            <TopBar state={state} changeState={changeState} action={action}/>
            {state.showOverlay && <AddRecipe changeState={changeState} action={action} />}
            {state.showEdit && <EditRecipe data={state.dataForEdit} changeState={changeState} action={action} />}
            <Outlet context={{ siteData, paginated, state, changeState, action }} />
        </div>
    )
}

export default RootLayout
