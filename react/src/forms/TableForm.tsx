import React, { useEffect, useState } from 'react'
import '../scss/styles.scss'
import '../css/circle_status.css'


interface TableRow {
  Id: Number
  Name: string
  Type: string
  Parameters: string[]
  Quantity: Number
  Links: OrderLink[]
  Status: Number
}

interface OrderLink {
  OrderLink: string
  StoreName: string
}

interface LinkArrayProps
{
  Links:OrderLink[];
}


const LinkArray = ({Links}: LinkArrayProps) => {
  const [selectedLinkIndex, setSelectedLinkIndex] = useState(null);

  // Обработчик клика по кнопке
  const handleLinkClick = (index:any) => {
    setSelectedLinkIndex(index);
  };

  return (
    <>
    {Links.map((link, index) => (
        <tr key={index}>
          <a
            id="store_link"
            href={link.OrderLink}
            target="_blank"
            onClick={() => handleLinkClick(index)}
          >
            {link.StoreName}
          </a>
          {selectedLinkIndex === index && (
            <span style={{ color: 'green', marginLeft: '8px' }}>&#10004;</span>
          )}
        </tr>
    ))}
    </>
  )
}


const CircleButton = () => {
  const [color, setColor] = useState('gray')

  // Обработчик клика по кнопке
  const handleClick = () => {
    setColor(prevColor => {
      if (prevColor === 'gray') return 'yellow'
      if (prevColor === 'yellow') return 'green'
      return 'gray'
    })
  }

  return <button className={`circle-button ${color}`} onClick={handleClick} />
}

function TableForm() {
  const [TableData, SetTableData] = useState<TableRow[]>([
    {
      Id: 1,
      Links: [
        { OrderLink: '#', StoreName: 'store1' },
        { OrderLink: '#', StoreName: 'store2' },
        { OrderLink: '#', StoreName: 'store3' }
      ],
      Name: 'sdfsdf',
      Parameters: ['param1', 'param2', 'param3', 'param4'],
      Quantity: 5,
      Status: 0,
      Type: 'Res'
    },
    {
      Id: 2,
      Links: [
        { OrderLink: '#', StoreName: 'store1' },
        { OrderLink: '#', StoreName: 'store2' },
        { OrderLink: '#', StoreName: 'store3' }
      ],
      Name: 'sdfsdf',
      Parameters: ['param1', 'param2', 'param3', 'param4'],
      Quantity: 5,
      Status: 0,
      Type: 'Res'
    },
    {
      Id: 3,
      Links: [
        { OrderLink: '#', StoreName: 'store1' },
        { OrderLink: '#', StoreName: 'store2' },
        { OrderLink: '#', StoreName: 'store3' }
      ],
      Name: 'sdfsdf',
      Parameters: ['param1', 'param2', 'param3', 'param4'],
      Quantity: 5,
      Status: 0,
      Type: 'Res'
    }
  ])

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
              {TableData.map(item => (
                <tr
                  key={item.Id.toString()}
                  style={{ verticalAlign: 'middle' }}
                >
                  <th scope="row">{item.Id.toString()}</th>
                  <td>{item.Name}</td>
                  <td>{item.Type}</td>
                  <td style={{ fontSize: '12px' }}>
                    {item.Parameters.map(parameter => (
                      <tr>{parameter}</tr>
                    ))}
                  </td>
                  <td>{item.Quantity.toString()}</td>
                  <td>
                    <LinkArray Links={item.Links} />
                  </td>
                  <td className="text-center">
                    <CircleButton />
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
