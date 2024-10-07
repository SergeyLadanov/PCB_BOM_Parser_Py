import React, { useEffect, useState } from 'react'
import '../scss/styles.scss'

interface TableRow {
  Id: Number
  Name: String
  Type: String
  Parameters: String[]
  Quantity: Number
  Links: string[]
  Status: Number
}

// interface FormData {
//   BomList: String
//   Quantity: Number
//   TechReserve: Number
//   SkipResTol: Boolean
//   SkipResPower: Boolean
//   SkipCapTol: Boolean
//   SkipCapDiel: Boolean
//   SkipCapVoltage: Boolean
// }

// interface FormController extends FormData {
//   SetBomList: (value: string) => void
//   SetQuantity: (value: Number) => void
//   SetTechReserve: (value: Number) => void
//   SetSkipResTol: (value: Boolean) => void
//   SetSkipResPower: (value: Boolean) => void
//   SetSkipCapTol: (value: Boolean) => void
//   SetSkipCapDiel: (value: Boolean) => void
//   SetSkipCapVoltage: (value: Boolean) => void
// }

// interface FormProps {
//   form: FormController
//   // OnButtonClick: () => void
// }

// export function useTableForm(): FormController {
//   const [formState, setFormData] = useState<FormData>({
//     BomList: '',
//     Quantity: 1,
//     TechReserve: 0,
//     SkipResTol: false,
//     SkipResPower: false,
//     SkipCapTol: false,
//     SkipCapDiel: false,
//     SkipCapVoltage: false
//   })

//   const Form: FormController = {
//     ...formState,
//     SetBomList: (value: string) =>
//       setFormData(prev => ({ ...prev, BomList: value })),
//     SetQuantity: (value: Number) =>
//       setFormData(prev => ({ ...prev, Quantity: value })),
//     SetTechReserve: (value: Number) =>
//       setFormData(prev => ({ ...prev, TechReserve: value })),
//     SetSkipResTol: (value: Boolean) =>
//       setFormData(prev => ({ ...prev, SkipResTol: value })),
//     SetSkipResPower: (value: Boolean) =>
//       setFormData(prev => ({ ...prev, SkipResPower: value })),
//     SetSkipCapTol: (value: Boolean) =>
//       setFormData(prev => ({ ...prev, SkipCapTol: value })),
//     SetSkipCapDiel: (value: Boolean) =>
//       setFormData(prev => ({ ...prev, SkipCapDiel: value })),
//     SetSkipCapVoltage: (value: Boolean) =>
//       setFormData(prev => ({ ...prev, SkipCapVoltage: value }))
//   }

//   return Form
// }

function TableForm() {

  const [TableData, SetTableData] = useState<TableRow[]>([
    {Id: 1, Links: ["sdfsd", "sdfsdf"], Name: "sdfsdf", Parameters: ["sdfsdf"], Quantity: 5, Status: 0, Type: "Res"},
    {Id: 2, Links: ["sdfsd", "sdfsdf"], Name: "sdfsdf", Parameters: ["sdfsdf"], Quantity: 5, Status: 0, Type: "Res"},
    {Id: 3, Links: ["sdfsd", "sdfsdf"], Name: "sdfsdf", Parameters: ["sdfsdf"], Quantity: 5, Status: 0, Type: "Res"}
  ]);


  return (
    <>
      <p className="h3">Таблица для заказа</p>
      <div className="bd-example-snippet bd-code-snippet">
        <div className="bd-example m-0 border-0 table-responsive-md">
          <table id="res_table" className="table table-striped">
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
            {TableData.map((item) => (
              <tr key={item.Id.toString()}>
                <th scope="row">{item.Id.toString()}</th>
                <td>{item.Name}</td>
                <td>{item.Type}</td>
                <td style={{fontSize: "12px"}}>            
                  {item.Parameters.map((parameter) => (
                    <>
                      {parameter} <br />
                    </>
                  ))}
                </td>
                <td>
                  {item.Quantity.toString()}
                </td>
                <td>
                  {item.Links.map((link) => (
                      <>
                        <p><a id="store_link" href={link} target="_blank">{link}</a></p>
                      </>
                    ))}
                </td>
                <td>
                    
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
