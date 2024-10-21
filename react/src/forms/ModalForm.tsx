import React, { useEffect, useState, useRef } from 'react'
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
  const [CopyStatus, SetCopyStatus] = useState(false)
  const timeoutRef = useRef(null)

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

  const OnCopiedButtonClickCallBack = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
    // Копируем текст из textarea в буфер обмена
    navigator.clipboard
      .writeText(form.ModalText)
      .then(() => {
        SetCopyStatus(true)

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
          SetCopyStatus(false)
        }, 2000)
      })
      .catch(err => {
        console.error('Ошибка при копировании текста: ', err)
      })
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
                  <div className="row p-2">
                    <div className="col-md-5 mb-2">
                      <button className="btn btn-primary" type="submit">
                        Скачать спис. в CSV
                      </button>
                    </div>

                    {ShowDeleteButton && (
                      <div className="col-md-5 mb-2">
                        <button
                          className="btn btn-secondary"
                          onClick={OnDeleteManufacturersClick}
                        >
                          Удал. назв. произв.
                        </button>
                      </div>
                    )}

                    <div className="col-md-2 mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="d-none"
                      >
                        <symbol
                          id="copied_status"
                          width="24"
                          height="24"
                          fill="currentColor"
                          className="bi bi-check"
                          viewBox="0 0 16 16"
                        >
                          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                        </symbol>
                        <symbol
                          id="copy_btn"
                          width="24"
                          height="24"
                          fill="currentColor"
                          className="bi bi-copy"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                          />
                        </symbol>
                      </svg>

                      <button
                        className="btn btn-link link-body-emphasis"
                        style={{
                          padding: 0, // убираем отступы
                          width: '2em', // ширина равна ширине SVG
                          height: '2em', // высота равна высоте SVG
                          display: 'inline-block', // для корректного отображения как инлайн-блок элемента
                          marginTop: '5px'
                        }}
                        onClick={OnCopiedButtonClickCallBack}
                      >
                        <svg width="2em" height="2em">
                          <use
                            href={`${CopyStatus ? '#copied_status' : '#copy_btn'}`}
                          ></use>
                        </svg>
                      </button>
                    </div>
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
