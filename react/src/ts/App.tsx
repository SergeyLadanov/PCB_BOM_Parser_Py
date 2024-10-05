import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import SwitchTheme from '../components/SwitchTheme'
import MainContainer from '../containers/MainContainer'

function App() {
  useEffect(() => {}, [])

  return (
    <>
      <Navbar />
      <SwitchTheme />
      <MainContainer />
    </>
  )
}

export default App
