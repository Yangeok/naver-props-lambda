import { useState, useEffect } from 'react'
import Papa from 'papaparse'

export const useFetchCsv = (url: string) => {
  const [header, setHeader] = useState<string[]>()
  const [rows, setRows] = useState<string[][]>([])
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetch(url, {
      method: 'get',
      headers: {
        pragma: 'no-cache',
        'cache-control': 'no-cache',
      }
    })
      .then((response) => response.text())
      .then((text) => {
        const parsedData = Papa.parse<string[]>(text)
        setHeader(parsedData.data[0])
        setRows(parsedData.data.slice(1))
      })
      .catch((error) => setError(error))
  }, [url])

  return { header, rows, error }
}
