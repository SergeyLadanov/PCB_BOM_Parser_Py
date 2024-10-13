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
  csv_link: string
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

function ModalForm({ form, csv_link }: FormProps) {
  const modalRef = React.useRef(null)
  const [ShowDeleteButton, SetShowDeleteButton] = useState(false)

  const OnDeleteManufacturersClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
    const lines = form.ModalText.trim().split('\n')
    form.Clear()
    // Проверка каждой строки
    for (let i = 0; i < lines.length; i++) {
      const parameters = lines[i].split('\t')
      const new_row = `${parameters[0]}\t${parameters[1]}`
      form.AddModalTextRow(new_row)
    }
  }

  // Обработчик события после добавления текста
  useEffect(() => {
    if (form.ModalText) {
      const lines = form.ModalText.trim().split('\n')
      const parameters = lines[0].split('\t')
      if (parameters.length > 2) {
        SetShowDeleteButton(true)
      } else {
        SetShowDeleteButton(false)
      }
    }
  }, [form.ModalText]) // вызовется каждый раз, когда текст изменяется

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
              <form method="POST" action={csv_link}>
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
                    readOnly
                  ></textarea>
                  <br />
                  <div className="row row-cols-2">
                    <div className="col-md-5">
                      <button className="btn btn-primary" type="submit">
                        Скачать спис. в CSV
                      </button>
                    </div>
                    {ShowDeleteButton && (
                      <div className="col-md-5">
                        <button
                          className="btn btn-secondary"
                          onClick={OnDeleteManufacturersClick}
                        >
                          Удал. назв. произв.
                        </button>
                      </div>
                    )}
                  </div>
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
