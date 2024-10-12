import { useState } from 'react'
import $ from 'jquery'

export function usePosting(
  initial_value: boolean = true
): [(url_val: string, data: any) => Promise<any>, string, boolean] {
  const [loading, setLoading] = useState(initial_value)
  const [err, setError] = useState('')

  const Posting = async (url_val: string, data: any) => {
    return new Promise((resolve, reject) => {
      setLoading(true)
      $.post(url_val, data, function (data) {
        resolve(data)
        setLoading(false)
      })
        // Обработчик неуспешной отправки данных
        .fail(function (error) {
          setError(err)
          reject(new Error(`${err}`))
          setLoading(false)
        })
    })
  }

  return [Posting, err, loading]
}
