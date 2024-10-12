import React, { useEffect, useState } from 'react'
import '../scss/styles.scss'
import { Modal } from 'bootstrap'

interface FormProps {
  OnEnButtonClick?: () => void
  OnRuButtonClick?: () => void
  OnElitanButtonClick?: () => void
  disabled?: boolean
}

function BomVariationsForm({
  OnEnButtonClick,
  OnRuButtonClick,
  OnElitanButtonClick,
  disabled
}: FormProps) {
  const OnEnButtonClickedCallback = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (OnEnButtonClick) {
      OnEnButtonClick()
    }
  }

  const OnRuButtonClickedCallback = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (OnRuButtonClick) {
      OnRuButtonClick()
    }
  }

  const OnElitanButtonClickedCallback = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (OnElitanButtonClick) {
      OnElitanButtonClick()
    }
  }

  return (
    <>
      <p className="h2">Результаты</p>
      <p></p>

      <div className="row row-cols-3">
        <div className="col-md-2">
          <button
            type="button"
            className="btn btn-primary"
            data-bs-whatever="en"
            onClick={OnEnButtonClickedCallback}
            disabled={disabled}
          >
            Список англ.
          </button>
        </div>
        <div className="col-md-2">
          <button
            type="button"
            className="btn btn-primary"
            data-bs-whatever="ru"
            onClick={OnRuButtonClickedCallback}
            disabled={disabled}
          >
            Список рус.
          </button>
        </div>
        <div className="col-md-2">
          <button
            type="button"
            className="btn btn-primary"
            data-bs-whatever="elitan"
            onClick={OnElitanButtonClickedCallback}
            disabled={disabled}
          >
            Список Элитан
          </button>
        </div>
      </div>
      <p></p>
    </>
  )
}

export default BomVariationsForm
