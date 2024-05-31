import React, { useEffect, useState } from 'react'

type Props = {
  apiKey: string
}

export const GoogleMapSection: React.FC<Props> = ({ apiKey }) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }
  const MapComponent = React.lazy(() => import('../../molecules/MapComponent').then((module) => ({ default: module.MapComponent })))

  return (
    <React.Suspense fallback={<div>Loading map...</div>}>
      <div className='p-6'>
        <MapComponent apiKey={apiKey} />
      </div>
    </React.Suspense>
  )
}
