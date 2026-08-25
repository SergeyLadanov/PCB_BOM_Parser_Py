import { useState } from 'react'
import $ from 'jquery'

interface ApiErrorResponse {
  error?: {
    message?: string
    line?: number
  }
}

export class PostingError extends Error {
  readonly line: number | null

  constructor(message: string, line: number | null = null) {
    super(message)
    this.name = 'PostingError'
    this.line = line
  }
}

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
        .fail(function (request: JQuery.jqXHR<ApiErrorResponse>) {
          const response = request.responseJSON
          const message =
            response?.error?.message ?? 'Потеряна связь с сервером'
          const line = Number.isInteger(response?.error?.line)
            ? response.error.line
            : null

          setError(message)
          reject(new PostingError(message, line))
          setLoading(false)
        })
    })
  }

  return [Posting, err, loading]
}
