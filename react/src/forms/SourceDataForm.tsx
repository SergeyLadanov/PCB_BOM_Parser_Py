import React, { useEffect, useState } from 'react'
import '../scss/styles.scss'

interface FormData {
  BomList: string
  BomListErr: string
  Quantity: number
  TechReserve: number
  SkipResTol: boolean
  SkipResPower: boolean
  SkipCapTol: boolean
  SkipCapDiel: boolean
  SkipCapVoltage: boolean
  SaveBom: boolean
  SaveFilters: boolean
}

interface FormController extends FormData {
  SetBomList: (value: string) => void
  SetBomListErr: (value: string) => void
  SetQuantity: (value: Number) => void
  SetTechReserve: (value: Number) => void
  SetSkipResTol: (value: boolean) => void
  SetSkipResPower: (value: boolean) => void
  SetSkipCapTol: (value: boolean) => void
  SetSkipCapDiel: (value: boolean) => void
  SetSkipCapVoltage: (value: boolean) => void
  SetSaveBom: (value: boolean) => void
  SetSaveFilters: (value: boolean) => void
}

interface FormProps {
  form: FormController
  OnHandleButtonClick?: () => void
  OnManufacturerSettingsClick?: () => void
  OnBomListTextInput?: (value: string) => void
  OnSaveBomCheckedChanged?: (value: boolean) => void
  OnSaveFiltersCheckedChanged?: (value: boolean) => void

  OnSkipResTolCheckedChanged?: (value: boolean) => void
  OnSkipResPwrCheckedChanged?: (value: boolean) => void

  OnSkipCapTolCheckedChanged?: (value: boolean) => void
  OnSkipCapVoltCheckedChanged?: (value: boolean) => void
  OnSkipCapDielCheckedChanged?: (value: boolean) => void
}

export function useSourceDataForm(): FormController {
  const [formState, setFormData] = useState<FormData>({
    BomList: '',
    BomListErr: '',
    Quantity: 1,
    TechReserve: 0,
    SkipResTol: false,
    SkipResPower: false,
    SkipCapTol: false,
    SkipCapDiel: false,
    SkipCapVoltage: false,
    SaveBom: false,
    SaveFilters: false
  })

  const Form: FormController = {
    ...formState,
    SetBomList: (value: string) =>
      setFormData(prev => ({ ...prev, BomList: value })),
    SetBomListErr: (value: string) =>
      setFormData(prev => ({ ...prev, BomListErr: value })),
    SetQuantity: (value: number) =>
      setFormData(prev => ({ ...prev, Quantity: value })),
    SetTechReserve: (value: number) =>
      setFormData(prev => ({ ...prev, TechReserve: value })),
    SetSkipResTol: (value: boolean) =>
      setFormData(prev => ({ ...prev, SkipResTol: value })),
    SetSkipResPower: (value: boolean) =>
      setFormData(prev => ({ ...prev, SkipResPower: value })),
    SetSkipCapTol: (value: boolean) =>
      setFormData(prev => ({ ...prev, SkipCapTol: value })),
    SetSkipCapDiel: (value: boolean) =>
      setFormData(prev => ({ ...prev, SkipCapDiel: value })),
    SetSkipCapVoltage: (value: boolean) =>
      setFormData(prev => ({ ...prev, SkipCapVoltage: value })),
    SetSaveBom: (value: boolean) =>
      setFormData(prev => ({ ...prev, SaveBom: value })),
    SetSaveFilters: (value: boolean) =>
      setFormData(prev => ({ ...prev, SaveFilters: value }))
  }

  return Form
}

function SourceDataForm({
  form,
  OnHandleButtonClick,
  OnBomListTextInput,
  OnSaveBomCheckedChanged,
  OnSaveFiltersCheckedChanged,
  OnSkipResTolCheckedChanged,
  OnSkipResPwrCheckedChanged,
  OnSkipCapTolCheckedChanged,
  OnSkipCapVoltCheckedChanged,
  OnSkipCapDielCheckedChanged,
  OnManufacturerSettingsClick
}: FormProps) {
  useEffect(() => {
    return () => {}
  })

  // Регулярное выражение для проверки строки
  const validateLine = (line: string) => {
    const regex = /^(.*?)(\t|;)(\d+(\.\d+)?|\d+)$/
    return regex.test(line.trim())
  }

  const OnBomListChanged = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    form.SetBomList(event.target.value)
    if (event.target.value != '') {
      const lines = event.target.value.split('\n')

      // Проверка каждой строки
      for (let i = 0; i < lines.length; i++) {
        if (!validateLine(lines[i])) {
          form.SetBomListErr(`Ошибка в строке ${i + 1}`)
          return
        }
      }
    }

    // Если ошибок нет
    form.SetBomListErr('')

    if (OnBomListTextInput) {
      OnBomListTextInput(event.target.value)
    }
  }

  const OnQuantityChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.SetQuantity(Number(event.target.value))
  }

  const OnTechReserveChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.SetTechReserve(Number(event.target.value))
  }

  const OnSkipResTolChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.SetSkipResTol(Boolean(event.target.checked))

    if (OnSkipResTolCheckedChanged) {
      OnSkipResTolCheckedChanged(event.target.checked)
    }
  }
  const OnSkipResPowerChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    form.SetSkipResPower(Boolean(event.target.checked))

    if (OnSkipResPwrCheckedChanged) {
      OnSkipResPwrCheckedChanged(event.target.checked)
    }
  }

  const OnSkipCapTolChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.SetSkipCapTol(Boolean(event.target.checked))

    if (OnSkipCapTolCheckedChanged) {
      OnSkipCapTolCheckedChanged(event.target.checked)
    }
  }
  const OnSkipCapDielChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.SetSkipCapDiel(Boolean(event.target.checked))
    if (OnSkipCapDielCheckedChanged) {
      OnSkipCapDielCheckedChanged(event.target.checked)
    }
  }

  const OnSkipCapVoltageChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    form.SetSkipCapVoltage(Boolean(event.target.checked))
    if (OnSkipCapVoltCheckedChanged) {
      OnSkipCapVoltCheckedChanged(event.target.checked)
    }
  }

  const OnSaveBomChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.SetSaveBom(Boolean(event.target.checked))

    if (OnSaveBomCheckedChanged) {
      OnSaveBomCheckedChanged(event.target.checked)
    }
  }

  const OnSaveFiltersChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.SetSaveFilters(Boolean(event.target.checked))

    if (OnSaveFiltersCheckedChanged) {
      OnSaveFiltersCheckedChanged(event.target.checked)
    }
  }

  const HandleButtonClickedCallback = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (OnHandleButtonClick) {
      OnHandleButtonClick()
    }
  }

  const OpenManufacturersSettingsClickedCallBack = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (OnManufacturerSettingsClick) {
      OnManufacturerSettingsClick()
    }
  }

  return (
    <>
      <div className="my-3 p-3 bg-body rounded shadow-sm">
        {form.BomListErr && (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
              <symbol
                id="exclamation-triangle-fill"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
              </symbol>
            </svg>
            <div
              className="alert alert-danger"
              role="alert"
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                opacity: 0.95
              }}
            >
              <svg
                className="bi flex-shrink-0 me-2"
                width="24"
                height="24"
                role="img"
                aria-label="Info:"
              >
                <use xlinkHref="#exclamation-triangle-fill" />
              </svg>
              {form.BomListErr}: Каждая строка должна содержать наименование
              (текст/числа/пробелы) и количество (число) через табуляцию либо
              точку с запятой. <br />
              Пример: <br />
              100мкФ 10% 10В Тип D;1
              <br />
              LSM6DSLTR 1;1
            </div>
          </>
        )}
        <div className="container text-left">
          <div className="row p-3">
            <div className="col-md-6 mb-3">
              <p className="h4">Исходный список компонентов</p>

              <div className="input-group">
                <textarea
                  onChange={OnBomListChanged}
                  id="input_list"
                  rows={24}
                  className="form-control"
                  aria-label="With textarea"
                  value={form.BomList}
                ></textarea>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <p className="h4">Параметры</p>
              <div className="row p-2">
                {/* <hr className="mt-1 mb-1"/> */}
                <p className="h5">Масштабирование</p>
                <div className="col-md-4">
                  <label htmlFor="deivice_count" className="form-label">
                    Кол. устройств, шт.
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    step="1"
                    value={form.Quantity}
                    className="form-control"
                    id="deivice_count"
                    required
                    onChange={OnQuantityChanged}
                  />
                </div>
              </div>

              <div className="row p-2">
                <div className="col-md-4">
                  <label htmlFor="tech_reserve" className="form-label">
                    Технолог. запас, %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={form.TechReserve}
                    className="form-control"
                    id="tech_reserve"
                    required
                    onChange={OnTechReserveChanged}
                  />
                </div>
              </div>

              <div className="row p-2">
                <hr className="mt-1 mb-1" />
                <p className="h5">Настройки производителей</p>

                <div className="col-md-5">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={OpenManufacturersSettingsClickedCallBack}
                  >
                    Откр. окно настр.
                  </button>
                </div>
              </div>

              <div className="row p-2">
                <hr className="mt-1 mb-1" />
                <p className="h5">Настройки сохранения данных</p>

                <div className="col-md-5">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={form.SaveBom}
                      id="save_bom"
                      required
                      onChange={OnSaveBomChanged}
                    />
                    <label className="form-check-label" htmlFor="save_bom">
                      Запоминать список компонентов
                    </label>
                  </div>
                </div>

                <div className="col-md-5">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={form.SaveFilters}
                      id="save_filters"
                      required
                      onChange={OnSaveFiltersChanged}
                    />
                    <label className="form-check-label" htmlFor="save_filters">
                      Запоминать настройки корреции
                    </label>
                  </div>
                </div>
              </div>

              <div className="row p-2">
                <hr className="mt-1 mb-1" />
                <p className="h5">Коррекция параметров резисторов</p>

                <div className="col-md-5">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={form.SkipResTol}
                      id="skip_res_tol"
                      required
                      onChange={OnSkipResTolChanged}
                    />
                    <label className="form-check-label" htmlFor="skip_res_tol">
                      Пропускать точность
                    </label>
                  </div>
                </div>

                <div className="col-md-5">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={form.SkipResPower}
                      id="skip_res_power"
                      required
                      onChange={OnSkipResPowerChanged}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="skip_res_power"
                    >
                      Пропускать мощность
                    </label>
                  </div>
                </div>
              </div>

              <div className="row p-2">
                <hr className="mt-1 mb-1" />
                <p className="h5">Коррекция параметров конденсаторов</p>

                <div className="col-md-5">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={form.SkipCapTol}
                      id="skip_cap_tol"
                      required
                      onChange={OnSkipCapTolChanged}
                    />
                    <label className="form-check-label" htmlFor="skip_cap_tol">
                      Пропускать точность
                    </label>
                  </div>
                </div>

                <div className="col-md-5">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={form.SkipCapDiel}
                      id="skip_cap_dielectric"
                      required
                      onChange={OnSkipCapDielChanged}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="skip_cap_dielectric"
                    >
                      Пропускать диэлектрик
                    </label>
                  </div>
                </div>

                <div className="col-md-5">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={form.SkipCapVoltage}
                      id="skip_cap_voltage"
                      required
                      onChange={OnSkipCapVoltageChanged}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="skip_cap_voltage"
                    >
                      Пропускать напряжение
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row p-3">
            <button
              type="button"
              id="handle_button"
              className="btn btn-primary"
              onClick={HandleButtonClickedCallback}
              disabled={form.BomListErr != ''}
            >
              Обработать
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default SourceDataForm
