import React, { useEffect, useLayoutEffect } from 'react'
import Navbar from '../containers/NavbarContainer'
import SwitchTheme from '../components/SwitchTheme'
import MainContainer from '../containers/MainContainer'

function getScrollbarWidth() {
  // Создаем временный элемент
  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll' // добавляем скролл
  outer.style.width = '100px' // фиксированная ширина
  document.body.appendChild(outer)

  const inner = document.createElement('div')
  inner.style.width = '100%'
  outer.appendChild(inner)

  // Получаем ширину скроллбара
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth

  // Удаляем временные элементы
  outer.parentNode.removeChild(outer)

  return scrollbarWidth
}

function App() {
  useLayoutEffect(() => {
    const scrollbarWidth = getScrollbarWidth()
    document.documentElement.style.setProperty(
      '--scrollbar-width',
      `${scrollbarWidth}px`
    )
  }, [])

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
