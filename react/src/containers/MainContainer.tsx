import React, { useEffect, useState } from 'react'
import SourceDataForm, { useSourceDataForm } from '../forms/SourceDataForm'
import $ from 'jquery'
import ModalForm, { useModalForm } from '../forms/ModalForm'
import TableForm, { useTableForm, TableRow } from '../forms/TableForm'
import { usePosting } from '../hooks/usePosting'
import BomVariationsForm from '../forms/BomVariationsForm'
import LoadingIndicator from '../components/LoadingIndicator'
import { StorageSettings } from '../ts/StorageSettings'
import {
  BomRequest,
  ParseResult,
  ResultLink,
  ApiUrls,
  ManufacturersList
} from '../ts/api'
import ManufacturerSettingsForm, {
  useManufacturerSettingsForm
} from '../forms/ManufacturerSettingsForm'
import { useFetching } from '../hooks/useFetching'

function MainContainer() {
  const API_URL = ApiUrls.API_URL
  const API_EXCEL = ApiUrls.DOWNLOAD_EXCEL_URL
  const API_MANUFACTURERS = ApiUrls.MANUFACTURERS_LIST_URL

  const srcDataForm = useSourceDataForm()
  const modalListForm = useModalForm()
  const tableForm = useTableForm()
  const ManSettingsForm = useManufacturerSettingsForm()
  const [SendRequest, post_err_bomvariant, isLoadingPost] = usePosting(false)
  const [GetData, get_err] = useFetching(false)
  const [isLoadingExcel, SetIsLoadingExcel] = useState(false)
  const [NeedToLoad, setNeedToLoad] = useState(true)
  const Storage: StorageSettings = new StorageSettings()
  const [BomParseResult, SetBomParseResult] = useState<ParseResult[]>([])
  const [LastBomRequest, SetLastBomRequest] = useState<BomRequest>()
  const [ShowWarning, SetShowWarning] = useState(false)

  const HandleShowWarning = () => {
    if (BomParseResult.length > 0) {
      SetShowWarning(true)
    }
  }

  useEffect(() => {
    if (NeedToLoad) {
      ManSettingsForm.SetSmdResManIndex(0)
      ManSettingsForm.SetSmdCerCapManIndex(0)
      ManSettingsForm.SetSmdTantCapManIndex(0)
      Storage.LoadConfig()

      GetData(API_MANUFACTURERS)
        .then((value: ManufacturersList) => {
          ManSettingsForm.SetSmdResMan(value.res_smd)
          ManSettingsForm.SetSmdCerCapMan(value.cer_cap_smd)
          ManSettingsForm.SetSmdTantCapMan(value.tant_cap_smd)

          if (Storage.ManSmdResIndex < value.res_smd.length) {
            ManSettingsForm.SetSmdResManIndex(Storage.ManSmdResIndex)
          }

          if (Storage.ManSmdCerCapIndex < value.cer_cap_smd.length) {
            ManSettingsForm.SetSmdCerCapManIndex(Storage.ManSmdCerCapIndex)
          }

          if (Storage.ManSmdTantCapIndex < value.tant_cap_smd.length) {
            ManSettingsForm.SetSmdTantCapManIndex(Storage.ManSmdTantCapIndex)
          }
        })
        .catch((err: any) => {
          alert('Не удалось загрузить список производителей')
        })

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
      tech_res: srcDataForm.TechReserve * 0.01 + 1.0,
      man_settings: {
        smd_cer_cap:
          ManSettingsForm.SmdCerCapMan[ManSettingsForm.SmdCerCapManIndex],
        smd_res: ManSettingsForm.SmdResMan[ManSettingsForm.SmdResManIndex],
        smd_tant_cap:
          ManSettingsForm.SmdTantCapMan[ManSettingsForm.SmdTantCapManIndex]
      }
    }

    return data
  }

  const OnBomListTextInput = (val: string) => {
    Storage.Bom = val
    HandleShowWarning()
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
    HandleShowWarning()
  }
  const OnSkipResPwrCheckedChanged = (val: boolean) => {
    Storage.SkipResPwr = val
    HandleShowWarning()
  }
  const OnSkipCapTolCheckedChanged = (val: boolean) => {
    Storage.SkipCapTol = val
    HandleShowWarning()
  }
  const OnSkipCapVoltCheckedChanged = (val: boolean) => {
    Storage.SkipCapVolt = val
    HandleShowWarning()
  }
  const OnSkipCapDielCheckedChanged = (val: boolean) => {
    Storage.SkipCapDiel = val
    HandleShowWarning()
  }

  const OnSubmitButtonClick = () => {
    const data: BomRequest = GetRequest()
    SendRequest(API_URL, data)
      .then((value: ParseResult[]) => {
        SetLastBomRequest(data)
        SetBomParseResult(value)
        SetShowWarning(false)
        tableForm.Clear()
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
    modalListForm.Clear()
    modalListForm.SetTitleText('Список для заказа (ед. измер. на англ.)')
    BomParseResult.forEach(item => {
      modalListForm.AddModalTextRow(`${item.en}\t${item.count}`)
    })
    modalListForm.Show()
  }

  const OnRuButtonClick = () => {
    modalListForm.Clear()
    modalListForm.SetTitleText('Список для заказа (ед. измер. на рус.)')
    BomParseResult.forEach(item => {
      modalListForm.AddModalTextRow(`${item.ru}\t${item.count}`)
    })
    modalListForm.Show()
  }

  const OnElitanButtonClick = () => {
    modalListForm.Clear()
    modalListForm.SetTitleText('Список для заказа (магазин Элитан)')
    BomParseResult.forEach(item => {
      modalListForm.AddModalTextRow(`${item.elitan}\t${item.count}`)
    })
    modalListForm.Show()
  }

  const OnManufacturersNamesButtonClick = () => {
    modalListForm.Clear()
    modalListForm.SetTitleText('Список для заказа (наим. произв.)')
    BomParseResult.forEach(item => {
      modalListForm.AddModalTextRow(
        `${item.manufacturer_info.component_name}\t${item.count}\t${item.manufacturer_info.manufacturer_name}`
      )
    })
    modalListForm.Show()
  }

  const OnDownloadExcelClick = () => {
    const data: BomRequest = LastBomRequest
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

  const OnManufacturerSettingsClick = () => {
    ManSettingsForm.Show()
  }

  const OnSmdResManChanged = (index: number) => {
    Storage.ManSmdResIndex = index
    HandleShowWarning()
  }

  const OnSmdCerCapManChanged = (index: number) => {
    Storage.ManSmdCerCapIndex = index
    HandleShowWarning()
  }

  const OnSmdTantCapManChanged = (index: number) => {
    Storage.ManSmdTantCapIndex = index
    HandleShowWarning()
  }

  const OnQuantitySpinBoxChanged = (value: number) => {
    HandleShowWarning()
  }

  const OnTechReserveSpinBoxChanged = (value: number) => {
    HandleShowWarning()
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
        OnManufacturerSettingsClick={OnManufacturerSettingsClick}
        OnQuantitySpinBoxChanged={OnQuantitySpinBoxChanged}
        OnTechReserveSpinBoxChanged={OnTechReserveSpinBoxChanged}
      />
      <div className="my-3 p-3 bg-body rounded shadow-sm">
        <p className="h4 mb-2">Результаты</p>
        {ShowWarning && (
          <div className="alert alert-warning text-center" role="alert">
            Внимание! Исходные данные были изменены, для обновления результатов
            нажмите кнопку "Обработать"
          </div>
        )}
        <BomVariationsForm
          OnEnButtonClick={OnEnButtonClick}
          OnRuButtonClick={OnRuButtonClick}
          OnElitanButtonClick={OnElitanButtonClick}
          OnManufacturersNamesButtonClick={OnManufacturersNamesButtonClick}
          disabled={BomParseResult.length === 0}
        />
        <ModalForm form={modalListForm} csv_link={ApiUrls.DOWNLOAD_CSV_URL} />
        <ManufacturerSettingsForm
          form={ManSettingsForm}
          OnSmdCerCapManChanged={OnSmdCerCapManChanged}
          OnSmdResManChanged={OnSmdResManChanged}
          OnSmdTantCapManChanged={OnSmdTantCapManChanged}
        />
        <TableForm
          form={tableForm}
          disabled={BomParseResult.length === 0}
          OnDownloadExcelClick={OnDownloadExcelClick}
        />
      </div>
      {(isLoadingPost || isLoadingExcel) && (
        <div className="loading-overlay">
          <LoadingIndicator />
        </div>
      )}
    </>
  )
}

export default MainContainer
