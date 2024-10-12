import React, { useEffect, useState } from 'react'
import '../scss/styles.scss'
import { Modal } from 'bootstrap'

interface FormData {
  ModalText: string
  TitleText: string
}

interface FormController extends FormData {
  SetModalText: (value: string) => void
  AddModalTextRow: (value: string) => void
  SetTitleText: (value: string) => void
  Show: () => void
  Close: () => void
  Clear: () => void
}

interface FormControllerExtended extends FormController {
  ModalObj: any
  SetModal: (value: Modal) => void
}

interface FormProps {
  form: FormController
}

export function useModalForm(): FormController {
  const [formState, setFormData] = useState<FormData>({
    ModalText: '',
    TitleText: ''
  })

  const [modal, setModal] = useState(null)

  const Form: FormControllerExtended = {
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
    },
    Show: () => modal.show(),
    Close: () => modal.hide(),
    ModalObj: modal,
    SetModal: (value: Modal) => setModal(value)
  }

  return Form
}

function ModalForm({ form }: FormProps) {

  const modalRef = React.useRef(null)

  const OnTextChanged = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    form.SetModalText(event.target.value)
  }

  // Эффект для инициализации модального окна с использованием Bootstrap
  useEffect(() => {
    if (modalRef.current) {
      ;(form as FormControllerExtended).SetModal(new Modal(modalRef.current))
    }
  }, [])

  return (
    <>
      <div
        className="modal fade"
        ref={modalRef}
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
                onClick={() => form.Close()} // Закрытие модального окна
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
                    onChange={OnTextChanged}
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
                onClick={() => form.Close()} // Закрытие модального окна
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
