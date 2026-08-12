import React from 'react'
import { useState } from 'react'
import style from './RegisterForm.module.css'

const RegisterForm = () => {
    const [user, setUser] = useState({ 'username': '', 'first_name': '', 'last_name': '', 'email': '', 'password': '', 'confirm': '' })

    function changeUser(e, inputField) {
        setUser(prev => ({
            ...prev,
            [inputField]: e.target.value
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (user.username === '' || user.email === '' || user.password === '') {
            return
        }
        if (user.confirm !== user.password) {
            return
        }

    }

    return (
        <div className={style.grid}>
            <form
                onSubmit={handleSubmit}
                id='registerForm'
                className={style.form}>
                <h1 className={style.title}>REGISTER USER</h1>
                <input type='text' placeholder='Username...' value={user.username} onChange={(e) => changeUser(e, 'username')} />
                <input type='text' placeholder='First Name (Optional)...' value={user.first_name} onChange={(e) => changeUser(e, 'first_name')} />
                <input type='text' placeholder='Last Name (Optional)...' value={user.last_name} onChange={(e) => changeUser(e, 'last_name')} />
                <input type='email' placeholder='Email...' value={user.email} onChange={(e) => changeUser(e, 'email')} />
                <input type='password' placeholder='Password...' value={user.password} onChange={(e) => changeUser(e, 'password')} />
                <input type='password' placeholder='Confirm Password...' value={user.confirm} onChange={(e) => changeUser(e, 'confirm')} />
                <div className={style.bottomSection}>
                    <button type='submit' form='registerForm' className={style.submitButton}>REGISTER</button>
                    <button className={style.bottomButton}>ALREADY HAVE AN ACCOUNT? LOG IN INSTEAD</button>
                </div>
            </form>
        </div>
    )
}

export default RegisterForm
