import React, { useEffect, useState } from 'react'
import '../scss/styles.scss'

interface FormData {
  BomList: String;
  Quantity: Number;
  TechReserve: Number;
  SkipResTol: Boolean;
  SkipResPower: Boolean;
  SkipCapTol: Boolean;
  SkipCapDiel: Boolean;
  SkipCapVoltage: Boolean;
}

interface FormController extends FormData {
  SetBomList: (value: string) => void;
  SetQuantity: (value: Number) => void;
  SetTechReserve: (value: Number) => void;
  SetSkipResTol: (value: Boolean) => void;
  SetSkipResPower: (value: Boolean) => void;
  SetSkipCapTol: (value: Boolean) => void;
  SetSkipCapDiel: (value: Boolean) => void;
  SetSkipCapVoltage: (value: Boolean) => void;
}

interface FormProps {
  form: FormController
  // OnButtonClick: () => void
}

export function useMainForm(): FormController {
  const [formState, setFormData] = useState<FormData>({
    BomList: '',
    Quantity: 1,
    TechReserve: 0,
    SkipResTol: false,
    SkipResPower: false,
    SkipCapTol: false,
    SkipCapDiel: false,
    SkipCapVoltage: false,
  })

  const Form: FormController = {
    ...formState,
    SetBomList: (value: string) => setFormData(prev => ({ ...prev, BomList: value })),
    SetQuantity: (value: Number) => setFormData(prev => ({ ...prev, Quantity: value })),
    SetTechReserve: (value: Number) => setFormData(prev => ({ ...prev, TechReserve: value })),
    SetSkipResTol: (value: Boolean) => setFormData(prev => ({ ...prev, SkipResTol: value })),
    SetSkipResPower: (value: Boolean) => setFormData(prev => ({ ...prev, SkipResPower: value })),
    SetSkipCapTol: (value: Boolean) => setFormData(prev => ({ ...prev, SkipCapTol: value })),
    SetSkipCapDiel: (value: Boolean) => setFormData(prev => ({ ...prev, SkipCapDiel: value })),
    SetSkipCapVoltage: (value: Boolean) => setFormData(prev => ({ ...prev, SkipCapVoltage: value })),
  }

  return Form
}

function Main({ form }: FormProps) {
  return (
    <>
      {/* Блок исходных данных */}
      <div className="container">
        <div className="my-3 p-3 bg-body rounded shadow-sm">
          <div className="container text-left">
            <div className="row p-3">
              <div className="col">
                <p className="h2">Исходный список компонентов</p>
                <div className="input-group">
                  <textarea
                    id="input_list"
                    rows={15}
                    className="form-control"
                    aria-label="With textarea"
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
                      value="1"
                      className="form-control"
                      id="deivice_count"
                      required
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
                      value="0"
                      className="form-control"
                      id="tech_reserve"
                      required
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
                        value=""
                        id="skip_res_tol"
                        required
                      />
                      <label
                        className="form-check-label"
                        htmlFor="skip_res_tol"
                      >
                        Пропускать точность
                      </label>
                    </div>
                  </div>

                  <div className="col-md-5">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="skip_res_power"
                        required
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
                        value=""
                        id="skip_cap_tol"
                        required
                      />
                      <label
                        className="form-check-label"
                        htmlFor="skip_cap_tol"
                      >
                        Пропускать точность
                      </label>
                    </div>
                  </div>

                  <div className="col-md-5">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="skip_cap_dielectric"
                        required
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
                        value=""
                        id="skip_cap_voltage"
                        required
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
              >
                Обработать
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Блок результатов */}
    </>
  )
}

export default Main
