import React, { useEffect, useState } from 'react'
import '../scss/styles.scss'

interface FormData {
  ModalText: string
}

interface FormController extends FormData {
  SetModalText: (value: string) => void
}

interface FormProps {
  form: FormController
  // OnButtonClick: () => void
}

export function useModalForm(): FormController {
  const [formState, setFormData] = useState<FormData>({
    ModalText: ''
  })

  const Form: FormController = {
    ...formState,
    SetModalText: (value: string) =>
      setFormData(prev => ({ ...prev, ModalText: value }))
  }

  return Form
}

function ModalForm({ form }: FormProps) {
  return (
    <>
      {/* <div className="my-3 p-3 bg-body rounded shadow-sm"> */}
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
                Заказ
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="message-text" className="col-form-label">
                    Компоненты:
                  </label>
                  <textarea
                    className="form-control"
                    rows={15}
                    id="message-text"
                  ></textarea>
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
      {/* </div> */}
    </>
  )
}

export default ModalForm
