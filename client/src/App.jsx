import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import UserProvider from './Context/UserProvider'

const App = () => {
  return (
   <UserProvider>
      <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/login' element = {<LoginPage />} />
          <Route path='/profile' element = {<ProfilePage />} />
        </Routes>
      </div> 
    </UserProvider>
  )
}

export default App