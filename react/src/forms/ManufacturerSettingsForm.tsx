import React, { useEffect, useState } from 'react'
import '../scss/styles.scss'
import { Modal } from 'bootstrap'

interface FormData {
  SmdResMan: string[]
  SmdCerCapMan: string[]
  SmdTantCapMan: string[]
  SmdResManIndex: number
  SmdCerCapManIndex: number
  SmdTantCapManIndex: number
}

interface FormController extends FormData {
  SetSmdResMan: (value: string[]) => void
  SetSmdCerCapMan: (value: string[]) => void
  SetSmdTantCapMan: (value: string[]) => void
  SetSmdResManIndex: (value: number) => void
  SetSmdCerCapManIndex: (value: number) => void
  SetSmdTantCapManIndex: (value: number) => void
  Show: () => void
  Close: () => void
}

interface FormControllerExtended extends FormController {
  ModalObj: any
  SetModal: (value: Modal) => void
}

interface FormProps {
  form: FormController
  OnSmdResManChanged?: (index: number) => void
  OnSmdCerCapManChanged?: (index: number) => void
  OnSmdTantCapManChanged?: (index: number) => void
}

const OnModalOpened = () => {
  document.documentElement.style.overflow = 'hidden'
  document.documentElement.style.scrollbarGutter = 'stable'
}

const OnModalClosed = () => {
  setTimeout(() => {
    document.documentElement.style.removeProperty('overflow')
  }, 200)
}

export function useManufacturerSettingsForm(): FormController {
  const [formState, setFormData] = useState<FormData>({
    SmdResMan: [],
    SmdCerCapMan: [],
    SmdTantCapMan: [],
    SmdResManIndex: 0,
    SmdCerCapManIndex: 0,
    SmdTantCapManIndex: 0
  })

  const [modal, setModal] = useState(null)

  const Form: FormControllerExtended = {
    ...formState,
    SetSmdResMan: (value: string[]) =>
      setFormData(prev => ({ ...prev, SmdResMan: value })),
    SetSmdCerCapMan: (value: string[]) => {
      setFormData(prev => ({
        ...prev,
        SmdCerCapMan: value
      }))
    },
    SetSmdTantCapMan: (value: string[]) => {
      setFormData(prev => ({
        ...prev,
        SmdTantCapMan: value
      }))
    },

    SetSmdResManIndex: (value: number) =>
      setFormData(prev => ({ ...prev, SmdResManIndex: value })),

    SetSmdCerCapManIndex: (value: number) =>
      setFormData(prev => ({ ...prev, SmdCerCapManIndex: value })),

    SetSmdTantCapManIndex: (value: number) =>
      setFormData(prev => ({ ...prev, SmdTantCapManIndex: value })),

    Show: () => {
      OnModalOpened()
      modal.show()
    },
    Close: () => {
      OnModalClosed()
      modal.hide()
    },
    ModalObj: modal,
    SetModal: (value: Modal) => setModal(value)
  }

  return Form
}

function ManufacturerSettingsForm({
  form,
  OnSmdResManChanged,
  OnSmdCerCapManChanged,
  OnSmdTantCapManChanged
}: FormProps) {
  const modalRef = React.useRef(null)

  // Эффект для инициализации модального окна с использованием Bootstrap
  useEffect(() => {
    if (modalRef.current) {
      ;(form as FormControllerExtended).SetModal(new Modal(modalRef.current))
    }
  }, [])

  const SmdResManChangedCallback = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    form.SetSmdResManIndex(Number(event.target.value))

    if (OnSmdResManChanged) {
      OnSmdResManChanged(Number(event.target.value))
    }
  }

  const SmdCerCapManChangedCallback = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    form.SetSmdCerCapManIndex(Number(event.target.value))
    if (OnSmdCerCapManChanged) {
      OnSmdCerCapManChanged(Number(event.target.value))
    }
  }

  const SmdTantCapManChangedCallback = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    form.SetSmdTantCapManIndex(Number(event.target.value))
    if (OnSmdTantCapManChanged) {
      OnSmdTantCapManChanged(Number(event.target.value))
    }
  }

  const HandleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      OnModalClosed()
    }
  }

  return (
    <>
      <div
        className="modal fade"
        ref={modalRef}
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{ zIndex: 1500 }}
        onClick={HandleBackdropClick}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Настройки производителей
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
                      value={form.SmdResManIndex}
                      onChange={SmdResManChangedCallback}
                    >
                      {/* <option value="0">Yageo</option>
                      <option value="1">Vishay</option> */}
                      {form.SmdResMan.map((item, index) => (
                        <option key={index} value={index}>
                          {item}
                        </option>
                      ))}
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
                      value={form.SmdCerCapManIndex}
                      onChange={SmdCerCapManChangedCallback}
                    >
                      {/* <option value="0">Yageo</option>
                      <option value="1">Vishay</option> */}
                      {form.SmdCerCapMan.map((item, index) => (
                        <option key={index} value={index}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="row p-1">
                    <label>Тант. SMD</label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      value={form.SmdTantCapManIndex}
                      onChange={SmdTantCapManChangedCallback}
                    >
                      {/* <option value="0">Xiangyee</option>
                      <option value="1">Panasonic</option> */}
                      {form.SmdTantCapMan.map((item, index) => (
                        <option key={index} value={index}>
                          {item}
                        </option>
                      ))}
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
