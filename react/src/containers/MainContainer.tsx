import React, { useEffect, useState } from 'react'
import SourceDataForm, { useSourceDataForm } from '../forms/SourceDataForm'
import $ from 'jquery'
import ModalForm, { useModalForm } from '../forms/ModalForm'
import TableForm, { useTableForm, TableRow } from '../forms/TableForm'
import { usePosting } from '../hooks/usePosting'
import BomVariationsForm from '../forms/BomVariationsForm'
import LoadingIndicator from '../components/LoadingIndicator'
import { StorageSettings } from '../ts/StorageSettings'
import { BomRequest, ParseResult, ResultLink, ApiUrls } from '../ts/api'

function MainContainer() {
  const API_URL = ApiUrls.API_URL
  const API_EXCEL = ApiUrls.DOWNLOAD_EXCEL_URL

  const srcDataForm = useSourceDataForm()
  const modalListForm = useModalForm()
  const tableForm = useTableForm()
  const [SendRequest, post_err_bomvariant, isLoadingPost] = usePosting(false)
  const [isLoadingExcel, SetIsLoadingExcel] = useState(false)
  const [NeedToLoad, setNeedToLoad] = useState(true)
  const Storage: StorageSettings = new StorageSettings()

  useEffect(() => {
    if (NeedToLoad) {
      Storage.LoadConfig()
      srcDataForm.SetSaveBom(Storage.SaveBom)
      srcDataForm.SetSaveFilters(Storage.SaveFilter)

      if (Storage.SaveBom) {
        srcDataForm.SetBomList(Storage.Bom)
      }

      if (Storage.SaveFilter) {
        srcDataForm.SetSkipResTol(Storage.SkipResTol)

        srcDataForm.SetSkipResPower(Storage.SkipResPwr)

        srcDataForm.SetSkipCapTol(Storage.SkipCapTol)

        srcDataForm.SetSkipCapVoltage(Storage.SkipCapVolt)

        srcDataForm.SetSkipCapDiel(Storage.SkipCapDiel)
      }
      setNeedToLoad(false)
    }
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
        skip_voltage: srcDataForm.SkipCapVoltage
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

  const OnBomListTextInput = (val: string) => {
    Storage.Bom = val
  }

  const OnSaveBomCheckedChanged = (val: boolean) => {
    Storage.SaveBom = val
    Storage.Bom = srcDataForm.BomList
  }
  const OnSaveFiltersCheckedChanged = (val: boolean) => {
    Storage.SaveFilter = val

    Storage.SkipResPwr = srcDataForm.SkipResPower
    Storage.SkipResTol = srcDataForm.SkipResTol

    Storage.SkipCapTol = srcDataForm.SkipCapTol
    Storage.SkipCapDiel = srcDataForm.SkipCapDiel
    Storage.SkipCapVolt = srcDataForm.SkipCapVoltage
  }
  const OnSkipResTolCheckedChanged = (val: boolean) => {
    Storage.SkipResTol = val
  }
  const OnSkipResPwrCheckedChanged = (val: boolean) => {
    Storage.SkipResPwr = val
  }
  const OnSkipCapTolCheckedChanged = (val: boolean) => {
    Storage.SkipCapTol = val
  }
  const OnSkipCapVoltCheckedChanged = (val: boolean) => {
    Storage.SkipCapVolt = val
  }
  const OnSkipCapDielCheckedChanged = (val: boolean) => {
    Storage.SkipCapDiel = val
  }

  const OnSubmitButtonClick = () => {
    const data: BomRequest = GetRequest()
    SendRequest(API_URL, data)
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

    SendRequest(API_URL, data)
      .then((value: ParseResult[]) => {
        modalListForm.Clear()
        modalListForm.SetTitleText('Список для заказа (ед. измер. на англ.)')
        value.forEach(item => {
          modalListForm.AddModalTextRow(`${item.en}\t${item.count}`)
        })
        modalListForm.Show()
      })
      .catch(() => {
        alert('Потеряна связь с сервером')
      })
  }

  const OnRuButtonClick = () => {
    const data: BomRequest = GetRequest()

    SendRequest(API_URL, data)
      .then((value: ParseResult[]) => {
        modalListForm.Clear()
        modalListForm.SetTitleText('Список для заказа (ед. измер. на рус.)')
        value.forEach(item => {
          modalListForm.AddModalTextRow(`${item.ru}\t${item.count}`)
        })
        modalListForm.Show()
      })
      .catch(() => {
        alert('Потеряна связь с сервером')
      })
  }

  const OnElitanButtonClick = () => {
    const data: BomRequest = GetRequest()

    SendRequest(API_URL, data)
      .then((value: ParseResult[]) => {
        modalListForm.Clear()
        modalListForm.SetTitleText('Список для заказа (магазин Элитан)')
        value.forEach(item => {
          modalListForm.AddModalTextRow(`${item.elitan}\t${item.count}`)
        })
        modalListForm.Show()
      })
      .catch(() => {
        alert('Потеряна связь с сервером')
      })
  }

  const OnManufacturersNamesButtonClick = () => {
    const data: BomRequest = GetRequest()

    SendRequest(API_URL, data)
      .then((value: ParseResult[]) => {
        modalListForm.Clear()
        modalListForm.SetTitleText('Список для заказа (наим. произв.)')
        value.forEach(item => {
          modalListForm.AddModalTextRow(
            `${item.manufacturer_info.component_name}\t${item.count}\t${item.manufacturer_info.manufacturer_name}`
          )
        })
        modalListForm.Show()
      })
      .catch(() => {
        alert('Потеряна связь с сервером')
      })
  }

  const OnDownloadExcelClick = () => {
    const data: BomRequest = GetRequest()
    SetIsLoadingExcel(true)
    // Отправляем POST-запрос
    $.ajax({
      url: API_EXCEL,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      xhrFields: {
        responseType: 'blob' // Важный момент, чтобы получить файл
      },
      success: function (blob) {
        // Создаем URL для скачивания файла
        // Создаем ссылку на скачивание файла
        const url = window.URL.createObjectURL(new Blob([blob]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'ResultTable.xlsx') // Имя файла
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
        SetIsLoadingExcel(false)
      },
      error: function (xhr, status, error) {
        SetIsLoadingExcel(false)
        alert('Потеряна связь с сервером')
      }
    })
  }

  return (
    <>
      <SourceDataForm
        form={srcDataForm}
        OnHandleButtonClick={OnSubmitButtonClick}
        OnBomListTextInput={OnBomListTextInput}
        OnSaveBomCheckedChanged={OnSaveBomCheckedChanged}
        OnSaveFiltersCheckedChanged={OnSaveFiltersCheckedChanged}
        OnSkipCapDielCheckedChanged={OnSkipCapDielCheckedChanged}
        OnSkipCapTolCheckedChanged={OnSkipCapTolCheckedChanged}
        OnSkipCapVoltCheckedChanged={OnSkipCapVoltCheckedChanged}
        OnSkipResPwrCheckedChanged={OnSkipResPwrCheckedChanged}
        OnSkipResTolCheckedChanged={OnSkipResTolCheckedChanged}
      />
      <div className="my-3 p-3 bg-body rounded shadow-sm">
        <BomVariationsForm
          OnEnButtonClick={OnEnButtonClick}
          OnRuButtonClick={OnRuButtonClick}
          OnElitanButtonClick={OnElitanButtonClick}
          OnManufacturersNamesButtonClick={OnManufacturersNamesButtonClick}
          disabled={srcDataForm.BomListErr != ''}
        />
        <ModalForm form={modalListForm} csv_link={ApiUrls.DOWNLOAD_CSV_URL} />
        <TableForm
          form={tableForm}
          OnDownloadExcelClick={OnDownloadExcelClick}
        />
      </div>
      {isLoadingPost || isLoadingExcel && (
        <div className="loading-overlay">
          <LoadingIndicator />
        </div>
      )}
    </>
  )
}

export default MainContainer
