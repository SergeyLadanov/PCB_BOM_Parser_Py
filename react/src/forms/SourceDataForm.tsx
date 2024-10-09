import React, { useEffect, useState } from 'react'
import '../scss/styles.scss'

interface FormData {
  BomList: string
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
}

export function useSourceDataForm(): FormController {
  const [formState, setFormData] = useState<FormData>({
    BomList: '',
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

function SourceDataForm({ form, OnHandleButtonClick }: FormProps) {
  const SAVE_BOM_STORAGE_KEY = 'save_bom'
  const SAVE_FILTERS_STORAGE_KEY = 'save_filter'
  const BOM_STORAGE_KEY = 'bom_content'

  const SKIP_RES_TOL_STORAGE_KEY = 'skip_res_tol'
  const SKIP_RES_PWR_STORAGE_KEY = 'skip_res_pwr'

  const SKIP_CAP_TOL_STORAGE_KEY = 'skip_cap_tol'
  const SKIP_CAP_VOLT_STORAGE_KEY = 'skip_cap_volt'
  const SKIP_CAP_DIEL_STORAGE_KEY = 'skip_cap_diel'

  const [loading, setLoading] = useState(true)

  const SaveBomList = () => {
    localStorage.setItem(BOM_STORAGE_KEY, form.BomList)
  }

  const stringToBoolean = (value: string): boolean => {
    return value.toLowerCase() === 'true'
  }

  useEffect(() => {
    if (loading) {
      const saveBom = localStorage.getItem(SAVE_BOM_STORAGE_KEY)
      const saveFilter = localStorage.getItem(SAVE_FILTERS_STORAGE_KEY)
      const bomList = localStorage.getItem(BOM_STORAGE_KEY)

      const skip_res_tol = localStorage.getItem(SKIP_RES_TOL_STORAGE_KEY)
      const skip_res_pwr = localStorage.getItem(SKIP_RES_PWR_STORAGE_KEY)

      const skip_cap_tol = localStorage.getItem(SKIP_CAP_TOL_STORAGE_KEY)
      const skip_cap_volt = localStorage.getItem(SKIP_CAP_VOLT_STORAGE_KEY)
      const skip_cap_diel = localStorage.getItem(SKIP_CAP_DIEL_STORAGE_KEY)

      if (saveBom) {
        form.SetSaveBom(stringToBoolean(saveBom))

        if (stringToBoolean(saveBom)) {
          if (bomList) {
            form.SetBomList(bomList)
          }
        } else {
          localStorage.removeItem(BOM_STORAGE_KEY)
        }
      }

      if (saveFilter) {
        form.SetSaveFilters(stringToBoolean(saveFilter))

        if (stringToBoolean(saveFilter)) {
          if (skip_res_tol) {
            form.SetSkipResTol(stringToBoolean(skip_res_tol))
          }

          if (skip_res_pwr) {
            form.SetSkipResPower(stringToBoolean(skip_res_pwr))
          }

          if (skip_cap_tol) {
            form.SetSkipCapTol(stringToBoolean(skip_cap_tol))
          }

          if (skip_cap_volt) {
            form.SetSkipCapVoltage(stringToBoolean(skip_cap_volt))
          }

          if (skip_cap_diel) {
            form.SetSkipCapDiel(stringToBoolean(skip_cap_diel))
          }
        } else {
          localStorage.removeItem(SKIP_RES_TOL_STORAGE_KEY)
          localStorage.removeItem(SKIP_RES_PWR_STORAGE_KEY)

          localStorage.removeItem(SKIP_CAP_TOL_STORAGE_KEY)
          localStorage.removeItem(SKIP_CAP_VOLT_STORAGE_KEY)
          localStorage.removeItem(SKIP_CAP_DIEL_STORAGE_KEY)
        }
      }

      setLoading(false)
    }
    return () => {}
  })

  const OnBomListChanged = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    form.SetBomList(event.target.value)

    if (form.SaveBom) {
      localStorage.setItem(BOM_STORAGE_KEY, event.target.value)
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
    localStorage.setItem(SKIP_RES_TOL_STORAGE_KEY, String(event.target.checked))
  }
  const OnSkipResPowerChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    form.SetSkipResPower(Boolean(event.target.checked))
    localStorage.setItem(SKIP_RES_PWR_STORAGE_KEY, String(event.target.checked))
  }

  const OnSkipCapTolChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.SetSkipCapTol(Boolean(event.target.checked))
    localStorage.setItem(SKIP_CAP_TOL_STORAGE_KEY, String(event.target.checked))
  }
  const OnSkipCapDielChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.SetSkipCapDiel(Boolean(event.target.checked))
    localStorage.setItem(
      SKIP_CAP_DIEL_STORAGE_KEY,
      String(event.target.checked)
    )
  }

  const OnSkipCapVoltageChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    form.SetSkipCapVoltage(Boolean(event.target.checked))
    localStorage.setItem(
      SKIP_CAP_VOLT_STORAGE_KEY,
      String(event.target.checked)
    )
  }

  const OnSaveBomChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.SetSaveBom(Boolean(event.target.checked))
    localStorage.setItem(SAVE_BOM_STORAGE_KEY, String(event.target.checked))

    if (Boolean(event.target.checked)) {
      localStorage.setItem(BOM_STORAGE_KEY, form.BomList)
    }
  }

  const OnSaveFiltersChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.SetSaveFilters(Boolean(event.target.checked))
    localStorage.setItem(SAVE_FILTERS_STORAGE_KEY, String(event.target.checked))

    if (Boolean(event.target.checked)) {
      //localStorage.setItem(BOM_STORAGE_KEY, form.BomList)
      localStorage.setItem(SKIP_RES_TOL_STORAGE_KEY, String(form.SkipResTol))
      localStorage.setItem(SKIP_RES_PWR_STORAGE_KEY, String(form.SkipResPower))

      localStorage.setItem(SKIP_CAP_TOL_STORAGE_KEY, String(form.SkipCapTol))
      localStorage.setItem(SKIP_CAP_DIEL_STORAGE_KEY, String(form.SkipCapDiel))
      localStorage.setItem(
        SKIP_CAP_VOLT_STORAGE_KEY,
        String(form.SkipCapVoltage)
      )
    }
  }

  const HandleButtonClickedCallback = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (OnHandleButtonClick) {
      OnHandleButtonClick()
    }
  }

  return (
    <>
      <div className="my-3 p-3 bg-body rounded shadow-sm">
        <div className="container text-left">
          <div className="row p-3">
            <div className="col">
              <p className="h2">Исходный список компонентов</p>
              <div className="input-group">
                <textarea
                  onChange={OnBomListChanged}
                  id="input_list"
                  rows={23}
                  className="form-control"
                  aria-label="With textarea"
                  value={form.BomList}
                ></textarea>
              </div>
            </div>
            <div className="col">
              <p className="h2">Параметры</p>
              <div className="row p-3">
                <p className="h4">Масштабирование</p>
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

              <div className="row p-3">
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

              <div className="row p-3">
                <p className="h4">Настройки сохранения данных</p>

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

              <div className="row p-3">
                <p className="h4">Коррекция параметров резисторов</p>

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

              <div className="row p-3">
                <p className="h4">Коррекция параметров конденсаторов</p>

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
