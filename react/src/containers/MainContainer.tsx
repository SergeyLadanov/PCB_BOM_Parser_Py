import React, { useEffect, useState } from 'react'
import SourceDataForm, { useSourceDataForm } from '../forms/SourceDataForm'
import $ from 'jquery'
import ModalForm, { useModalForm } from '../forms/ModalForm'
import TableForm, { useTableForm, TableRow } from '../forms/TableForm'
import { usePosting } from '../hooks/usePosting'

interface ResFilter {
  skip_tol: boolean
  skip_power: boolean
}

interface CapFilter {
  skip_tol: boolean
  skip_dielectric: boolean
  skip_voltage: boolean
}

interface BomRequest {
  bom: string
  count: number
  tech_res: number
  res_filter: ResFilter
  cap_filter: CapFilter
}

interface ResultLink {
  order_link: string
  order_name: string
  store_name: string
}

interface ParseResult {
  type: string
  count: number
  en: string
  ru: string
  elitan: string
  params: string[]
  name: string
  ordering: ResultLink[]
}

function MainContainer() {
  const API_URL = './bom_data'

  const srcDataForm = useSourceDataForm()
  const modalListForm = useModalForm()
  const tableForm = useTableForm()
  const [SendData, post_err] = usePosting()

  useEffect(() => {
    return () => {}
  })

  const replaceAll = (str: string, find: string, replace: string) => {
    return str.replace(new RegExp(find, 'g'), replace)
  }

  const GetRequest = (): BomRequest => {
    var data: BomRequest = {
      bom: replaceAll(srcDataForm.BomList, ';', '\t'),
      cap_filter: {
        skip_tol: srcDataForm.SkipCapTol,
        skip_dielectric: srcDataForm.SkipCapDiel,
        skip_voltage: srcDataForm.SkipCapDiel
      },
      res_filter: {
        skip_power: srcDataForm.SkipResPower,
        skip_tol: srcDataForm.SkipResTol
      },
      count: srcDataForm.Quantity,
      tech_res: srcDataForm.TechReserve * 0.01 + 1.0
    }

    return data
  }

  const OnSubmitButtonClick = () => {
    const data: BomRequest = GetRequest()

    SendData(API_URL, data)
      .then((value: ParseResult[]) => {
        tableForm.Clear()
        //alert('Настройки успешно применены')
        console.log(value)
        value.forEach(item => {
          const Row: TableRow = {
            Links: item.ordering.map((link: ResultLink) => ({
              OrderLink: link.order_link,
              StoreName: link.store_name
            })),
            Name: item.name,
            Parameters: item.params,
            Quantity: item.count,
            Type: item.type
          }

          tableForm.AddRow(Row)
        })
      })
      .catch(() => {
        alert('Потеряна связь с сервером')
      })
  }

  const OnEnButtonClick = () => {
    const data: BomRequest = GetRequest()

    SendData(API_URL, data)
      .then((value: ParseResult[]) => {
        value.forEach(item => {
          modalListForm.AddModalTextRow(`${item.en}\t${item.count}`)
        })
      })
      .catch(() => {
        alert('Потеряна связь с сервером')
      })
  }

  const OnRuButtonClick = () => {
    const data: BomRequest = GetRequest()

    SendData(API_URL, data)
      .then((value: ParseResult[]) => {
        value.forEach(item => {
          modalListForm.AddModalTextRow(`${item.ru}\t${item.count}`)
        })
      })
      .catch(() => {
        alert('Потеряна связь с сервером')
      })
  }

  const OnElitanButtonClick = () => {
    const data: BomRequest = GetRequest()

    SendData(API_URL, data)
      .then((value: ParseResult[]) => {
        value.forEach(item => {
          modalListForm.AddModalTextRow(`${item.elitan}\t${item.count}`)
        })
      })
      .catch(() => {
        alert('Потеряна связь с сервером')
      })
  }

  return (
    <>
      <SourceDataForm
        form={srcDataForm}
        OnHandleButtonClick={OnSubmitButtonClick}
      />
      <div className="my-3 p-3 bg-body rounded shadow-sm">
        <ModalForm
          form={modalListForm}
          OnEnButtonClick={OnEnButtonClick}
          OnRuButtonClick={OnRuButtonClick}
          OnElitanButtonClick={OnElitanButtonClick}
        />
        <TableForm form={tableForm} />
      </div>
    </>
  )
}

export default MainContainer
