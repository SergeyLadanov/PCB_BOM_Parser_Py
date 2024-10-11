import React, { useEffect } from 'react'
import Navbar from '../containers/NavbarContainer'
import SwitchTheme from '../components/SwitchTheme'
import MainContainer from '../containers/MainContainer'

function App() {
  useEffect(() => {}, [])

  return (
    <>
      <Navbar />
      <div className="container">
        <SwitchTheme />
        <MainContainer />
      </div>
    </>
  )
}

export default App
