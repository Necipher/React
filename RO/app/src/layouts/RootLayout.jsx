import React from 'react'
import TopBar from '../components/TopBar'
import { Outlet, useLoaderData } from 'react-router-dom'
import useAppState from '../hooks/useAppState'

const RootLayout = () => {
    const siteData = useLoaderData();
    const {state, changeState, action} = useAppState(siteData)

    return (
        <div>
            <TopBar state={state} changeState={changeState}/>
            <Outlet context={{ siteData, state, changeState, action }} />
        </div>
    )
}

export default RootLayout
