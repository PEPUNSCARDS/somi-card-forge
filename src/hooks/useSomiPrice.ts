import { useState, useEffect } from 'react'

export const useSomiPrice = () => {
  const [price, setPrice] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Try CoinGecko API first
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=somnia-network&vs_currencies=usd'
        )
        
        if (response.ok) {
          const data = await response.json()
          const somiPrice = data['somnia-network']?.usd
          if (somiPrice) {
            setPrice(somiPrice)
            return
          }
        }
        
        // Fallback to mock price if API fails
        console.warn('CoinGecko API failed, using fallback price')
        setPrice(1.25) // Fallback price
        
      } catch (err) {
        console.error('Failed to fetch SOMI price:', err)
        setError('Failed to fetch price')
        setPrice(1.25) // Fallback price
      } finally {
        setLoading(false)
      }
    }

    fetchPrice()
    
    // Refresh price every 30 seconds
    const interval = setInterval(fetchPrice, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return { price, loading, error }
}