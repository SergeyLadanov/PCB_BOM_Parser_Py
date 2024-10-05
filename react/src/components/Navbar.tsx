import React, { useEffect } from 'react'

import '../scss/styles.scss'
import '../css/offcanvas.css'
import '../css/index.css'
import { Dropdown } from 'bootstrap'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

function ToogleOffcanvasClickHandler() {
  document.querySelector('.offcanvas-collapse').classList.toggle('open')
}

function ItemClickHandler(event: any) {
  document.querySelector('.active').classList.remove('active')
  event.target.classList.add('active')
  document.querySelector('.offcanvas-collapse').classList.remove('open')
}

function Navbar() {
  useEffect(() => {
    // Activate dropdown
    document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(item => {
      new Dropdown(item)
    })
  })

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top navbar-dark bg-dark"
      aria-label="Main navigation"
    >
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          BOM Parser
        </a>
        <span id="version_container" className="navbar-text">
          0.0.0
        </span>
      </div>
    </nav>
  )
}

export default Navbar
