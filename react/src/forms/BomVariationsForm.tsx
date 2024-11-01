import React, { useEffect, useState } from 'react'
import '../scss/styles.scss'
import { Modal } from 'bootstrap'

interface FormProps {
  OnEnButtonClick?: () => void
  OnRuButtonClick?: () => void
  OnElitanButtonClick?: () => void
  OnManufacturersNamesButtonClick?: () => void
  disabled?: boolean
}

function BomVariationsForm({
  OnEnButtonClick,
  OnRuButtonClick,
  OnElitanButtonClick,
  OnManufacturersNamesButtonClick,
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

  const OnManufacturersNameButtonClickedCallback = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (OnManufacturersNamesButtonClick) {
      OnManufacturersNamesButtonClick()
    }
  }

  return (
    <>


      <div className="row p-2">
        <div className="col-md-3 mb-3">
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
        <div className="col-md-3 mb-3">
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
        <div className="col-md-3 mb-3">
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
        <div className="col-md-3 mb-3">
          <button
            type="button"
            className="btn btn-primary"
            data-bs-whatever="manufacturers"
            onClick={OnManufacturersNameButtonClickedCallback}
            disabled={disabled}
          >
            Список наим. произв.
          </button>
        </div>
      </div>
    </>
  )
}

export default BomVariationsForm
