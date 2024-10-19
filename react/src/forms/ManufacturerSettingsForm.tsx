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

export function useManufacturerSettingsForm(): FormController {
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

function ManufacturerSettingsForm({ form, csv_link }: FormProps) {
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
        style={{ zIndex: 1500 }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Натсройки производителей
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
              <div className="row p-1">
                <div className="col-md-8 mb-3">
                  <div className="row p-1">
                    <h2 className="fs-5">Для резисторов</h2>
                  </div>
                  <div className="row p-1">
                    <label>SMD</label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                    >
                      <option value="0">Yageo</option>
                      <option value="1">Vishay</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-8 mb-3">
                  <div className="row p-1">
                    <h2 className="fs-5">Для конденсаторов</h2>
                  </div>
                  <div className="row p-1">
                    <label>Керамические SMD</label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                    >
                      <option value="0">Yageo</option>
                      <option value="1">Vishay</option>
                    </select>
                  </div>
                  <div className="row p-1">
                    <label>Тант. SMD</label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                    >
                      <option value="0">Xiangyee</option>
                      <option value="1">Panasonic</option>
                    </select>
                  </div>
                </div>
              </div>
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

export default ManufacturerSettingsForm
