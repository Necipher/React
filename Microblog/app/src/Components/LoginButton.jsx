import React from 'react'
import style from './LoginButton.module.css'
//Context
import { useAuthContext } from '../context/AuthContext'

const LoginButton = () => {
  const { authView, setAuthView } = useAuthContext()
  return (
    <div className={style.layout}>
      <button className={style.login} onClick={() => setAuthView('login')}>LOGIN</button>
      <button className={style.register} onClick={() => setAuthView('register')}>No account yet? Register here.</button>
    </div>
  )
}

export default LoginButton
