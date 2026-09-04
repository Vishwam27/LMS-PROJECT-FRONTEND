import { useState } from 'react'
import LoginPage from './app/pages/LoginPage'
import RegisterPage from './app/pages/RegisterPage'
export default function App() {
const [page, setPage] = useState<'login' | 'register'>('login')

  return page === 'login' ? (
    <LoginPage onSwitch={() => setPage('register')} />
  ) : (
    <RegisterPage onSwitch={() => setPage('login')} />
  )
}
