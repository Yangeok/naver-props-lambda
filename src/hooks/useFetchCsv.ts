import Papa from 'papaparse'
import { useEffect, useState } from 'react'

export const useFetchCsv = (url: string) => {
  const [header, setHeader] = useState<string[]>()
  const [rows, setRows] = useState<string[][]>([])
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const timestamp = new Date().getTime()
    fetch(`${url}?t=${timestamp}`, {
      method: 'get',
      headers: {
        pragma: 'no-cache',
        'cache-control': 'no-cache',
      },
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
