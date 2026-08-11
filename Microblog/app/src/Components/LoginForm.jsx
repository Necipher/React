import React from 'react'
import style from './LoginForm.module.css'

const LoginForm = () => {
    return (
        <div className={style.grid}>
            <div className={style.form}>
                <h1 className={style.title}>USER LOGIN</h1>
                <input type='text' placeholder='Email...' />
                <input type='password' placeholder='Password...' />
            <div className={style.bottomSection}>
                    <button className={style.submitButton}>LOG IN</button>
                    <button className={style.bottomButton}>NO ACCOUNT? REGISTER NEW ACCOUNT HERE</button>
                </div>
            </div>
        </div>
    )
}

export default LoginForm
