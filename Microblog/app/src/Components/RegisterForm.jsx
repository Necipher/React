import React from 'react'
import style from './RegisterForm.module.css'

const RegisterForm = () => {
    return (
        <div className={style.grid}>
            <div className={style.form}>
                <h1 className={style.title}>REGISTER USER</h1>
                <input type='text' placeholder='Username...' />
                <input type='text' placeholder='First Name (Optional)...' />
                <input type='text' placeholder='Last Name (Optional)...' />
                <input type='text' placeholder='Email...' />
                <input type='password' placeholder='Password...' />
                <div className={style.bottomSection}>
                    <button className={style.submitButton}>REGISTER</button>
                    <button className={style.bottomButton}>ALREADY HAVE AN ACCOUNT? LOG IN INSTEAD</button>
                </div>
            </div>
        </div>
    )
}

export default RegisterForm
