import React from 'react'
import { useState } from 'react'
import { useAuthContext } from '../context/AuthContext'
import style from './LoginForm.module.css'

const LoginForm = ({ onClose, onSwitchToRegister }) => {
    const { login, error, loading } = useAuthContext();
    const [user, setUser] = useState({ "email": '', "password": '' });
    const [formError, setFormError] = useState(null)

    function changeUserData(e, inputField) {
        setUser(prev => ({
            ...prev,
            [inputField]: e.target.value
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setFormError(null);

        if (user.email === '' || user.password === '') {
            setFormError('Both fields must be filled out')
            return
        }
        const success = await login(user.email.toLowerCase(), user.password);

        if (success) {
            setUser({ "email": '', "password": '' })
            onClose();
        }
    }

    return (
        <div className={style.grid}>
            <form
                id='loginForm'
                onSubmit={handleSubmit}
                className={style.form}>
                <button type='button' className={style.closeButton} onClick={onClose}>X</button>
                <h1 className={style.title}>USER LOGIN</h1>
                <input type='email' placeholder='Email...' value={user.email} onChange={(e) => changeUserData(e, 'email')} />
                <input type='password' placeholder='Password...' value={user.password} onChange={(e) => changeUserData(e, 'password')} />

                {formError && <p>{formError}</p>}
                {error && <p>{error}</p>}

                <div className={style.bottomSection}>
                    <button type='submit' className={style.submitButton} form='loginForm'>LOG IN</button>
                    <button type='button' className={style.bottomButton} onClick={onSwitchToRegister}>NO ACCOUNT? REGISTER NEW ACCOUNT HERE</button>
                </div>
            </form>
        </div>
    )
}

export default LoginForm
