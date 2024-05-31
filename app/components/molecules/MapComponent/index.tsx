import { APIProvider, Map } from '@vis.gl/react-google-maps'

type Props = {
  apiKey: string
}

export const MapComponent: React.FC<Props> = ({ apiKey }) => {
  return (
    <APIProvider apiKey={apiKey}>
      <Map style={{ width: '100%', height: '400px' }} defaultCenter={{ lat: 33.58162963851229, lng: 130.40660357748382 }} defaultZoom={10} gestureHandling='greedy' disableDefaultUI={true} />
    </APIProvider>
  )
}
