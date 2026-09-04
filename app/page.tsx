'use client'

import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

export default function App() {
  const [page, setPage] = useState<'login' | 'register'>('login')

  return page === 'login' ? (
    <LoginPage onSwitch={() => setPage('register')} />
  ) : (
    <RegisterPage onSwitch={() => setPage('login')} />
  )
}