import { useState } from 'react'
import $ from 'jquery'

export function usePosting(): [
  (url_val: string, data: any) => Promise<any>,
  string
] {
  const [err, setError] = useState('')

  const Posting = async (url_val: string, data: any) => {
    return new Promise((resolve, reject) => {
      $.post(url_val, data, function (data) {
        resolve(data)
      })
        // Обработчик неуспешной отправки данных
        .fail(function (error) {
          setError(err)
          reject(new Error(`${err}`))
        })
    })
  }

  return [Posting, err]
}
