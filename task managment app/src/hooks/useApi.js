import { useCallback, useState } from 'react'

export default function useApi() {
  // Yahan useState isliye use kiya hai kyunki har request ke dauran loading aur error state us component ki UI feedback ko control karti hai.
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Yahan useCallback isliye use kiya hai kyunki API executor effects aur child handlers mein reuse hota hai aur dependency identity stable rehni chahiye.
  const run = useCallback(async (request) => {
    setLoading(true)
    setError('')
    try {
      return await request()
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Could not reach the API. Demo mode is active.'
      setError(message)
      throw requestError
    } finally {
      setLoading(false)
    }
  }, [])

  return { run, loading, error, setError }
}

// Yahan custom Hook isliye banaya hai kyunki auth aur task screens ko request loading/error lifecycle ka same reusable behavior chahiye.