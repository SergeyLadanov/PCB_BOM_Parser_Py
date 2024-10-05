import React, { useEffect } from 'react'
// import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom' // Навигация по хэш
import Navbar from '../components/Navbar'
import About from '../pages/About'
import SwitchTheme from '../components/SwitchTheme'
import MainContainer from '../containers/MainContainer'

const NotFound = () => <h2>404: Страница не найдена</h2>

function removeLoadingSpinner() {
  const loadingElement = document.querySelector('.first_loading') as HTMLElement
  if (loadingElement) {
    loadingElement.style.transition = 'opacity 0.5s'
    loadingElement.style.opacity = '0'
    setTimeout(() => {
      loadingElement.remove() // Удаление после анимации
      document.body.classList.remove('loading-dark-theme')
      document.body.classList.remove('loading-light-theme')
    }, 500) // Удалить после завершения анимации
  }
}

function App() {
  useEffect(() => {
    removeLoadingSpinner() // Убираем индикатор после загрузки React
  }, [])

  return (
    <BrowserRouter>
      <Navbar />
      <SwitchTheme />
      <Routes>
        <Route path="/" element={<MainContainer />} />
        <Route path="/about" element={<About />} />
        {/* Обработка несуществующего маршрута */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
