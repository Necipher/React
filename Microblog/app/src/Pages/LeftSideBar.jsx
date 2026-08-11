import React from 'react'
import style from './LeftSideBar.module.css'
import logo from '../assets/logo.png'
import MenuSelection from '../Components/MenuSelection'

const LeftSideBar = () => {


    return (
        <div className={style.gridLayout}>

            {/* Website name and logo identification */}
            <section className={style.identification}>
                <img src={logo} className={style.logo} />
                <h2 className={style.siteName}>Company Name</h2> 
            </section>

            <MenuSelection />

        </div>
    )
}

export default LeftSideBar




