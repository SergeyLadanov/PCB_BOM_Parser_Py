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
          Title
        </a>
        <button
          className="navbar-toggler p-0 border-0"
          type="button"
          onClick={ToogleOffcanvasClickHandler}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="navbar-collapse offcanvas-collapse" id="navbars">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              {/* <a className="nav-link active" aria-current="page" href="/" id = "item1_id">Item1</a> */}
              <Link
                to="/"
                className="nav-link active"
                onClick={ItemClickHandler}
                aria-current="page"
              >
                Main
              </Link>
            </li>

            <li className="nav-item">
              {/* <a className="nav-link" href="/about" id = "item2_id">Item2</a> */}
              <Link
                to="/about"
                className="nav-link"
                onClick={ItemClickHandler}
                aria-current="page"
              >
                About
              </Link>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="dropdown01"
                data-bs-toggle="dropdown"
                aria-expanded="true"
              >
                Item3
              </a>
              <ul className="dropdown-menu" aria-labelledby="dropdown01">
                <li>
                  <a className="dropdown-item" href="#" id="subitem1_id">
                    subitem1
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#" id="subitem2_id">
                    subitem2
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#" id="subitem3_id">
                    subitem3
                  </a>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              {/* <a className="nav-link" href="#" id = "item4_id">Item4</a> */}
              <Link
                to="/contacts"
                className="nav-link"
                onClick={ItemClickHandler}
                aria-current="page"
              >
                Contacts
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
