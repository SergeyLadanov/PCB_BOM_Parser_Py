import React, { useEffect, useState } from 'react'
import '../scss/styles.scss'
import '../css/circle_status.css'

export interface OrderLink {
  OrderLink: string
  StoreName: string
}

interface LinkArrayProps {
  Links: OrderLink[]
  HandleClick?: () => void
}

const LinkArray = ({ Links, HandleClick }: LinkArrayProps) => {
  const [selectedLinkIndex, setSelectedLinkIndex] = useState(null)

  useEffect(() => {
    setSelectedLinkIndex(null)
  }, [Links])

  // Обработчик клика по кнопке
  const handleLinkClick = (index: any) => {
    if (HandleClick) {
      HandleClick()
    }
    setSelectedLinkIndex(index)
  }

  return (
    <>
      {Links.map((link, index) => (
        <span key={index}>
          <a
            id="store_link"
            href={link.OrderLink}
            target="_blank"
            onClick={() => handleLinkClick(index)}
            onMouseUp={(event: any) => {
              if (event.button === 1) {
                handleLinkClick(index)
              }
            }}
          >
            {link.StoreName}
          </a>
          {selectedLinkIndex === index && (
            <span style={{ color: 'green', marginLeft: '8px' }}>&#10004;</span>
          )}
          <br />
        </span>
      ))}
    </>
  )
}

export default LinkArray
