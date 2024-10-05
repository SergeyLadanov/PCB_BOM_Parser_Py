import { useState } from 'react'
import $ from 'jquery'

export function useFetching(
  callback: (response: any) => void
): [(url_val: string) => Promise<void>, boolean, string] {
  const [loading, setLoading] = useState(true)
  const [err, setError] = useState('')

  const Fetching = async (url_val: string) => {
    $.ajax({
      url: url_val,
      method: 'GET',
      dataType: 'json',
      success: response => {
        callback(response)
      },
      error: (jqXHR, textStatus, errorThrown) => {
        setError(`Ошибка: ${textStatus}, ${errorThrown}`)
      },
      complete: () => {
        setLoading(false)
      }
    })
  }

  return [Fetching, loading, err]
}
