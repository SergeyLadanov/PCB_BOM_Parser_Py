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
    SkipCapVoltage: false
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
      setFormData(prev => ({ ...prev, SkipCapVoltage: value }))
  }

  return Form
}

function SourceDataForm({ form, OnHandleButtonClick }: FormProps) {
  const OnBomListChanged = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    form.SetBomList(event.target.value)
  }

  const OnQuantityChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.SetQuantity(Number(event.target.value))
  }

  const OnTechReserveChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.SetTechReserve(Number(event.target.value))
  }

  const OnSkipResTolChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.SetSkipResTol(Boolean(event.target.checked))
  }
  const OnSkipResPowerChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    form.SetSkipResPower(Boolean(event.target.checked))
  }

  const OnSkipCapTolChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.SetSkipCapTol(Boolean(event.target.checked))
  }
  const OnSkipCapDielChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.SetSkipCapDiel(Boolean(event.target.checked))
  }

  const OnSkipCapVoltageChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    form.SetSkipCapVoltage(Boolean(event.target.checked))
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
                  rows={15}
                  className="form-control"
                  aria-label="With textarea"
                  value={form.BomList}
                ></textarea>
              </div>
            </div>
            <div className="col">
              <p className="h2">Параметры</p>
              <div className="row p-3">
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
