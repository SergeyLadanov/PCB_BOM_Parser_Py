import React, { useEffect, useState } from 'react'
import '../scss/styles.scss'
import '../css/circle_status.css'
import LinkArray, { OrderLink } from '../components/LinkArray'

export interface TableRow {
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
      formState.push(value)
      setFormData(formState)
      rowStatuses.push('gray')
      setRowStatus(rowStatuses)
    },
    Clear: () => {
      setFormData([])
      setRowStatus([])
    },

    SetStatus: SetRowStatusFn,

    ToggleStatus: (index: number) => {
      const newRowStates = [...rowStatuses]

      // Поменять цвет нажатой кнопки: gray -> yellow -> green
      if (newRowStates[index] === 'gray') {
        SetRowStatusFn(index, 'yellow')
      } else if (newRowStates[index] === 'yellow') {
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
}

function TableForm({ form }: TableFormProps) {
  const handleButtonClick = (index: number) => {
    form.ToggleStatus(index)
  }

  const handleLinkClick = (index: number) => {
    form.SetStatus(index, 'yellow')
  }

  return (
    <>
      <p className="h3">Таблица для заказа</p>
      <div className="bd-example-snippet bd-code-snippet">
        <div className="bd-example m-0 border-0 table-responsive-md">
          <table id="res_table" className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
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
              {form.RowArray.map((item, index) => (
                <tr key={index.toString()} style={{ verticalAlign: 'middle' }}>
                  <th scope="row">{(index + 1).toString()}</th>
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
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default TableForm