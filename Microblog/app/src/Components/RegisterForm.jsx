import React from 'react'
import { useState } from 'react'
import { useAuthContext } from '../context/AuthContext'
import style from './RegisterForm.module.css'

const RegisterForm = ({ onClose, onSwitchToLogin }) => {
    const { registerNewUser, error, loading } = useAuthContext()
    const [user, setUser] = useState({ 'username': '', 'first_name': '', 'last_name': '', 'email': '', 'password': '', 'confirm': '' })
    const [formError, setFormError] = useState(null);

    function changeUserData(e, inputField) {
        setUser(prev => ({
            ...prev,
            [inputField]: e.target.value
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setFormError(null)
        if (user.username === '' || user.email === '' || user.password === '') {
            setFormError('Please fill in all required fields');
            return
        }
        if (user.confirm !== user.password) {
            setFormError('Passwords do not match')
            return
        }
        const success = await registerNewUser(user.username.toLowerCase(), user.first_name.toLowerCase(), user.last_name.toLowerCase(), user.email.toLowerCase(), user.password)

        if (success) {
            setUser({ 'username': '', 'first_name': '', 'last_name': '', 'email': '', 'password': '', 'confirm': '' });
            onClose()
        }
    }

    return (
        <div className={style.grid}>
            <form
                onSubmit={handleSubmit}
                id='registerForm'
                className={style.form}
            >
                <button type='button' className={style.closeButton} onClick={onClose} >X</button>
                <h1 className={style.title}>REGISTER USER</h1>
                <input type='text' placeholder='Username...' value={user.username} onChange={(e) => changeUserData(e, 'username')} />
                <input type='text' placeholder='First Name (Optional)...' value={user.first_name} onChange={(e) => changeUserData(e, 'first_name')} />
                <input type='text' placeholder='Last Name (Optional)...' value={user.last_name} onChange={(e) => changeUserData(e, 'last_name')} />
                <input type='email' placeholder='Email...' value={user.email} onChange={(e) => changeUserData(e, 'email')} />
                <input type='password' placeholder='Password...' value={user.password} onChange={(e) => changeUserData(e, 'password')} />
                <input type='password' placeholder='Confirm Password...' value={user.confirm} onChange={(e) => changeUserData(e, 'confirm')} />

                {formError && <p>{formError}</p>}
                {error && <p>{error}</p>}

                <div className={style.bottomSection}>
                    <button type='submit' form='registerForm' className={style.submitButton}>REGISTER</button>
                    <button type='button' className={style.bottomButton} onClick={onSwitchToLogin}>ALREADY HAVE AN ACCOUNT? LOG IN INSTEAD</button>
                </div>
            </form>
        </div>
    )
}

export default RegisterForm
