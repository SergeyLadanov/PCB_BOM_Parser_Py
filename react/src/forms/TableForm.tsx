import React, { useEffect, useState } from 'react'
import '../scss/styles.scss'
import '../css/circle_status.css'
import LinkArray, { OrderLink } from '../components/LinkArray'
import { ExcelColumnKey, REQUIRED_EXCEL_COLUMN_KEYS } from '../ts/api'
import { StorageSettings } from '../ts/StorageSettings'

interface ExcelColumnOption {
  key: ExcelColumnKey
  label: string
  required?: boolean
}

const EXCEL_COLUMN_OPTIONS: ExcelColumnOption[] = [
  { key: 'number', label: '#', required: true },
  { key: 'designator', label: 'Поз. обознач.' },
  {
    key: 'source_name',
    label: 'Исходное наименование',
    required: true
  },
  { key: 'component_type', label: 'Тип элемента' },
  { key: 'parameters', label: 'Параметры' },
  { key: 'english_name', label: 'Список на англ.' },
  { key: 'russian_name', label: 'Список на рус.' },
  { key: 'manufacturer_part_name', label: 'Наимен. произв.' },
  { key: 'manufacturer', label: 'Производитель' },
  { key: 'quantity', label: 'Количество', required: true },
  { key: 'store_elitan', label: 'Ссылка: Элитан' },
  { key: 'store_chipdip', label: 'Ссылка: Чип и Дип' },
  { key: 'store_platan', label: 'Ссылка: Платан' },
  { key: 'store_promelec', label: 'Ссылка: Промэлектроника' },
  { key: 'store_dko_electronshik', label: 'Ссылка: Электронщик' }
]

const addRequiredExcelColumns = (
  columns: ExcelColumnKey[]
): ExcelColumnKey[] => {
  const selectedColumns = new Set(columns)
  REQUIRED_EXCEL_COLUMN_KEYS.forEach(key => selectedColumns.add(key))
  return EXCEL_COLUMN_OPTIONS.filter(option =>
    selectedColumns.has(option.key)
  ).map(option => option.key)
}

export interface TableRow {
  Designator: string
  Name: string
  Type: string
  Parameters: string[]
  Quantity: Number
  Links: OrderLink[]
}

interface TableController {
  RowArray: TableRow[]
  // RowIdArray: Number[];
  RowStatusArray: any[]
  AddRow: (value: TableRow) => void
  Clear: () => void
  ToggleStatus: (index: number) => void
  SetStatus: (index: number, value: string) => void
}

export function useTableForm(): TableController {
  const [formState, setFormData] = useState<TableRow[]>([])
  const [rowStatuses, setRowStatus] = useState([])

  const SetRowStatusFn = (index: number, value: string) => {
    const newRowStates = [...rowStatuses]
    if (value === 'yellow') {
      const yellowButtonIndex = newRowStates.indexOf('yellow')
      if (yellowButtonIndex !== -1) {
        newRowStates[yellowButtonIndex] = 'gray'
      }
    }
    newRowStates[index] = value
    setRowStatus(newRowStates)
  }

  const Form: TableController = {
    RowArray: formState,
    RowStatusArray: rowStatuses,

    AddRow: (value: TableRow) => {
      setFormData(prevItems => [...prevItems, value])
      setRowStatus(prevItems => [...prevItems, 'gray'])
    },
    Clear: () => {
      setFormData([])
      setRowStatus([])
    },

    SetStatus: SetRowStatusFn,

    ToggleStatus: (index: number) => {
      // Поменять цвет нажатой кнопки: gray -> yellow -> green
      if (rowStatuses[index] === 'gray') {
        SetRowStatusFn(index, 'yellow')
      } else if (rowStatuses[index] === 'yellow') {
        SetRowStatusFn(index, 'green')
      } else {
        SetRowStatusFn(index, 'gray')
      }
    }
  }

  return Form
}

interface TableFormProps {
  form: TableController
  disabled: boolean
  OnDownloadExcelClick?: (columns: ExcelColumnKey[]) => void
}

function TableForm({ form, disabled, OnDownloadExcelClick }: TableFormProps) {
  const excelSettingsStorage = React.useMemo(() => new StorageSettings(), [])
  const [excelColumns, setExcelColumns] = useState<ExcelColumnKey[]>(
    () => excelSettingsStorage.ExcelColumns
  )
  const [showExcelSettings, setShowExcelSettings] = useState(false)
  const excelSettingsRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showExcelSettings) {
      return
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        excelSettingsRef.current &&
        !excelSettingsRef.current.contains(event.target as Node)
      ) {
        setShowExcelSettings(false)
      }
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowExcelSettings(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [showExcelSettings])

  const handleButtonClick = (index: number) => {
    form.ToggleStatus(index)
  }

  const handleLinkClick = (index: number) => {
    form.SetStatus(index, 'yellow')
  }

  const handleDownloadExcelLink = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault()

    if (OnDownloadExcelClick) {
      OnDownloadExcelClick(excelColumns)
    }
  }

  const handleExcelColumnChange = (key: ExcelColumnKey, checked: boolean) => {
    const nextColumns = addRequiredExcelColumns(
      checked
        ? [...excelColumns, key]
        : excelColumns.filter(column => column !== key)
    )
    setExcelColumns(nextColumns)
    excelSettingsStorage.ExcelColumns = nextColumns
  }

  return (
    <>
      <div className="row p-1">
        <div className="col-md-5 d-flex flex-column justify-content-end">
          <p className="h5">Таблица для заказа</p>
        </div>
        {!disabled && (
          <div className="col-md-auto ms-auto d-flex align-items-end justify-content-md-end">
            <div className="d-flex align-items-center gap-2">
              <a href="#" onClick={handleDownloadExcelLink}>
                Скачать в Excel
              </a>
              <div className="position-relative" ref={excelSettingsRef}>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center"
                  aria-label="Настроить столбцы Excel"
                  title="Настроить столбцы Excel"
                  aria-expanded={showExcelSettings}
                  onClick={() => setShowExcelSettings(value => !value)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.284-.7-2.686.702-1.986 1.986l.17.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.7 1.284.702 2.686 1.986 1.986l.311-.17a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.284.7 2.686-.702 1.986-1.986l-.17-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.7-1.284-.702-2.686-1.986-1.986l-.311.17a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.858 2.929 2.929 0 0 1 0 5.858z" />
                  </svg>
                </button>
                {showExcelSettings && (
                  <div className="dropdown-menu show end-0 export-settings-menu p-3">
                    <p className="fw-semibold mb-2">Столбцы Excel</p>
                    {EXCEL_COLUMN_OPTIONS.map(option => (
                      <div className="form-check" key={option.key}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`excel-column-${option.key}`}
                          checked={excelColumns.includes(option.key)}
                          disabled={option.required}
                          onChange={event =>
                            handleExcelColumnChange(
                              option.key,
                              event.target.checked
                            )
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`excel-column-${option.key}`}
                        >
                          {option.label}
                          {option.required && (
                            <span className="text-body-secondary small">
                              {' '}
                              (обязательно)
                            </span>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="bd-example-snippet bd-code-snippet">
        <div className="bd-example m-0 border-0 table-responsive-lg">
          <table id="res_table" className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Поз. обозначение</th>
                <th scope="col">Наименование</th>
                <th scope="col">Тип</th>
                <th scope="col">Параметры</th>
                <th scope="col">Количество</th>
                <th scope="col">Ссылки</th>
                <th scope="col" className="text-center">
                  Статус
                </th>
              </tr>
            </thead>
            <tbody id="res_table_body">
              {!disabled && (
                <>
                  {form.RowArray.map((item, index) => (
                    <tr
                      key={index.toString()}
                      style={{ verticalAlign: 'middle' }}
                    >
                      <th scope="row">{(index + 1).toString()}</th>
                      <td>{item.Designator || '—'}</td>
                      <td>{item.Name}</td>
                      <td>{item.Type}</td>
                      <td style={{ fontSize: '12px' }}>
                        {item.Parameters.map((parameter, index) => (
                          <span key={index}>
                            {parameter}
                            <br />
                          </span>
                        ))}
                      </td>
                      <td>{item.Quantity.toString()}</td>
                      <td>
                        <LinkArray
                          Links={item.Links}
                          HandleClick={() => handleLinkClick(index)}
                        />
                      </td>
                      <td className="text-center">
                        <button
                          className={`circle-button ${form.RowStatusArray[index]}`}
                          onClick={() => handleButtonClick(index)}
                        />
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default TableForm
