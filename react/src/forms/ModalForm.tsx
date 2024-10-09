import React, { useEffect, useState } from 'react'
import '../scss/styles.scss'

interface FormData {
  ModalText: string
  TitleText: string
}

interface FormController extends FormData {
  SetModalText: (value: string) => void
  AddModalTextRow: (value: string) => void
  SetTitleText: (value: string) => void
  Clear: () => void
}

interface FormProps {
  form: FormController
  OnEnButtonClick?: () => void
  OnRuButtonClick?: () => void
  OnElitanButtonClick?: () => void
}

export function useModalForm(): FormController {
  const [formState, setFormData] = useState<FormData>({
    ModalText: '',
    TitleText: ''
  })

  const Form: FormController = {
    ...formState,
    SetModalText: (value: string) =>
      setFormData(prev => ({ ...prev, ModalText: value })),
    AddModalTextRow: (value: string) => {
      setFormData(prev => ({
        ...prev,
        ModalText: `${prev.ModalText}${value}\n`
      }))
    },
    SetTitleText: (value: string) =>
      setFormData(prev => ({ ...prev, TitleText: value })),
    Clear: () => {
      setFormData(prev => ({ ...prev, ModalText: '' }))
    }
  }

  return Form
}

function ModalForm({
  form,
  OnEnButtonClick,
  OnRuButtonClick,
  OnElitanButtonClick
}: FormProps) {
  const OnModalTextChanged = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    form.SetModalText(event.target.value)
  }

  const OnEnButtonClickedCallback = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    form.Clear()
    form.SetTitleText('Список для заказа (ед. измер. на англ.)')
    if (OnEnButtonClick) {
      OnEnButtonClick()
    }
  }

  const OnRuButtonClickedCallback = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    form.Clear()
    form.SetTitleText('Список для заказа (ед. измер. на рус.)')
    if (OnRuButtonClick) {
      OnRuButtonClick()
    }
  }

  const OnElitanButtonClickedCallback = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    form.Clear()
    form.SetTitleText('Список для заказа (магазин Элитан)')
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
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            data-bs-whatever="en"
            onClick={OnEnButtonClickedCallback}
          >
            Список англ.
          </button>
        </div>
        <div className="col-md-2">
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            data-bs-whatever="ru"
            onClick={OnRuButtonClickedCallback}
          >
            Список рус.
          </button>
        </div>
        <div className="col-md-2">
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            data-bs-whatever="elitan"
            onClick={OnElitanButtonClickedCallback}
          >
            Список Элитан
          </button>
        </div>
      </div>
      <p></p>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {form.TitleText}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form method="POST" action="./download_csv">
                <div className="mb-3">
                  <label htmlFor="message-text" className="col-form-label">
                    Компоненты:
                  </label>
                  <textarea
                    name="bom_list"
                    className="form-control"
                    rows={15}
                    id="message-text"
                    value={form.ModalText}
                    onChange={OnModalTextChanged}
                  ></textarea>
                  <br />
                  <button className="btn btn-primary" type="submit">
                    Скачать список в CSV
                  </button>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ModalForm
