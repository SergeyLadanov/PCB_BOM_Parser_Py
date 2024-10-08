import React, { useEffect, useState } from 'react'
import SourceDataForm, { useSourceDataForm } from '../forms/SourceDataForm'
import $ from 'jquery'
import ModalForm, { useModalForm } from '../forms/ModalForm'
import TableForm, { useTableForm, TableRow } from '../forms/TableForm'

function MainContainer() {
  const srcDataForm = useSourceDataForm()
  const modalListForm = useModalForm()
  const tableForm = useTableForm()

  const [firstLoading, SetFirstLoading] = useState(true)

  useEffect(() => {
    const TableData: TableRow[] = [
      {
        Links: [
          { OrderLink: '#', StoreName: 'store1' },
          { OrderLink: '#', StoreName: 'store2' },
          { OrderLink: '#', StoreName: 'store3' }
        ],
        Name: 'sdfsdf',
        Parameters: ['param1', 'param2', 'param3', 'param4'],
        Quantity: 5,
        Type: 'Res'
      },
      {
        Links: [
          { OrderLink: '#', StoreName: 'store1' },
          { OrderLink: '#', StoreName: 'store2' },
          { OrderLink: '#', StoreName: 'store3' }
        ],
        Name: 'sdfsdf',
        Parameters: ['param1', 'param2', 'param3', 'param4'],
        Quantity: 5,
        Type: 'Res'
      },
      {
        Links: [
          { OrderLink: '#', StoreName: 'store1' },
          { OrderLink: '#', StoreName: 'store2' },
          { OrderLink: '#', StoreName: 'store3' }
        ],
        Name: 'sdfsdf',
        Parameters: ['param1', 'param2', 'param3', 'param4'],
        Quantity: 5,
        Type: 'Res'
      }
    ]

    if (firstLoading) {
      TableData.forEach(row => {
        console.log(row)
        tableForm.AddRow(row)
      })

      SetFirstLoading(false)
    }

    return () => {
      // tableForm.Clear();
    }
  })


  const OnSubmitButtonClick = () =>
  {
    console.log("Button clicked");
  }

  return (
    <>
      <SourceDataForm form={srcDataForm} OnHandleButtonClick={OnSubmitButtonClick}/>
      <div className="my-3 p-3 bg-body rounded shadow-sm">
        <ModalForm form={modalListForm} />
        <TableForm form={tableForm} />
      </div>
    </>
  )
}

export default MainContainer
