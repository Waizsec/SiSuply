import { useState } from 'react'
import './App.css'
import { Dashboard, Login } from './pages'

function App() {

  return (
    <>
      {/* Login Pages */}
      <Login />

      {/* Dashboard */}
      <Dashboard />
    </>
  )
}

export default App
