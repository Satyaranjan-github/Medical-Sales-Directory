import React from 'react'
import {BrowserRouter , Routes, Route} from 'react-router-dom'
import AdminPage from './Pages/AdminPage'
import OperatorPage from './Pages/OperatorPage'
import LoginPage from './Pages/LoginPage'
import Header from './components/Header'
import Home from "./Pages/Home"
import Update from "./Pages/Update"

const App = () => {
  return (
    <div>
      <Header />
      <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Home />}/>
          <Route path='/admin' element={<AdminPage />} />
          <Route path='/operator' element={<OperatorPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/update/:id' element={<Update/>} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
