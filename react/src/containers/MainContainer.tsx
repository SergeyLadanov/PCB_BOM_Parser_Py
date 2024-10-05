import React, { useEffect, useState } from 'react'
import Main, { useMainForm } from '../pages/Main'
import $ from 'jquery'

interface ITestPost {
  value1: string
}

interface ITestGet {
  param1: string
  param2: string
}

function MainContainer() {
  const API_ROUTING: string = './alarm_settings'

  const Form = useMainForm()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const refreshIntervalId = setInterval(() => {
      console.log('Main...')
    }, 1000)

    // Выполняем запрос на сервер при монтировании компонента
    const fetchData = async () => {
      try {
        const response = await fetch('./get_data')
        if (!response.ok) {
          throw new Error('Ошибка при выполнении запроса')
        }
        const result: ITestGet = await response.json()
        Form.SetVal1(result.param1)
        Form.SetVal2(result.param2)
      } catch (error) {
        //setError(error.message);
      } finally {
        setLoading(false)
      }
    }

    if (loading) {
      fetchData()
    }

    return () => {
      // код выполняется при размонтировании компонента (закрытии)
      console.log('Component unmounted')
      clearInterval(refreshIntervalId)
    }
  })

  // Получение маски будильника
  const OnButtonclick = (): void => {
    let request: ITestPost = {
      value1: 'Test'
    }

    $.post('./post_data', request, function (data) {
      // alert("Данные успешно получены");
      var index
    })
      // Обработчик неуспешной отправки данных
      .fail(function () {
        alert('Потеря связи с сервером')
      })
  }

  if (loading) {
    return <>Загрузка данных</>
  } else {
    return <Main form={Form} OnButtonClick={OnButtonclick} />
  }
}

export default MainContainer
