import React, { useEffect, useState } from 'react'

import '../scss/styles.scss'
import '../css/offcanvas.css'
import '../css/index.css'
import { Dropdown } from 'bootstrap'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

interface FormData {
  Version: string
}

interface FormController extends FormData {
  SetVersion: (value: string) => void
}

interface FormProps {
  form: FormController
}

export function useNavbar(): FormController {
  const [formState, setFormData] = useState<FormData>({
    Version: ''
  })

  const Form: FormController = {
    ...formState,
    SetVersion: (value: string) =>
      setFormData(prev => ({ ...prev, Version: value }))
  }

  return Form
}

function ToogleOffcanvasClickHandler() {
  document.querySelector('.offcanvas-collapse').classList.toggle('open')
}

function ItemClickHandler(event: any) {
  document.querySelector('.active').classList.remove('active')
  event.target.classList.add('active')
  document.querySelector('.offcanvas-collapse').classList.remove('open')
}

function Navbar({ form }: FormProps) {
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
          {form.Version}
        </span>
      </div>
    </nav>
  )
}

export default Navbar
