import { useState } from 'react'
import $ from 'jquery'

export function useFetching(): [
  (url_val: string) => Promise<any>,
  boolean,
  string
] {
  const [loading, setLoading] = useState(true)
  const [err, setError] = useState('')

  const Fetching = async (url_val: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: url_val,
        method: 'GET',
        dataType: 'json',
        success: response => {
          resolve(response)
        },
        error: (jqXHR, textStatus, errorThrown) => {
          setError(`Ошибка: ${textStatus}, ${errorThrown}`)
          reject(new Error(`${errorThrown}`))
        },
        complete: () => {
          setLoading(false)
        }
      })
    })
  }

  return [Fetching, loading, err]
}
