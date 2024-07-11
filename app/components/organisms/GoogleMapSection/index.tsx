import { AccessInfo } from '~/components/molecules/AccessInfo'

type Props = {
  apiKey: string
}

export const GoogleMapSection: React.FC<Props> = ({ apiKey }) => {
  return (
    <section className='p-6 flex flex-col md:flex-row-reverse gap-4 md:gap-8'>
      <AccessInfo />
      <iframe
        src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.9193974062746!2d130.4035565757939!3d33.58144197333793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3541919959f5a96d%3A0x9a0ef819adf28ccf!2z6Ia-54KZKOOBi-OBhOOBl-OCgyk!5e0!3m2!1sen!2sjp!4v1720701523891!5m2!1sen!2sjp'
        width='100%'
        height='320'
        style={{ border: 0 }}
        allowFullScreen={false}
        loading='lazy'
        referrerPolicy='no-referrer-when-downgrade'
        title='map'
      ></iframe>
    </section>
  )

  // TODO Google Cloud PlatformからAPIを取得してAPIを使うなら👇の実装

  // const [isClient, setIsClient] = useState(false)

  // useEffect(() => {
  //   setIsClient(true)
  // }, [])

  // if (!isClient) {
  //   return null
  // }
  // const MapComponent = React.lazy(() => import('../../molecules/MapComponent').then((module) => ({ default: module.MapComponent })))

  // return (
  //   <React.Suspense fallback={<div>Loading map...</div>}>
  //     <div className='p-6 flex flex-col md:flex-row-reverse gap-4 md:gap-8'>
  //       <AccessInfo />
  //       <MapComponent apiKey={apiKey} />
  //     </div>
  //   </React.Suspense>
  // )

  /**
   * iframeを使う方法
   * メリット
   * 簡単に実装できる: iframeタグを使うだけで、Google Mapsを簡単に埋め込むことができる。
   * 外部リソースの管理が不要: Google Mapsの更新やバグ修正はGoogle側で行われるので、自分で管理する必要がない。
   * デメリット
   * カスタマイズが難しい: iframe内のコンテンツは外部サイトのものであり、スタイルや機能を細かくカスタマイズするのが難しい。
   * パフォーマンスの問題: iframeは別のブラウザコンテキストを作成するため、ページのパフォーマンスに影響を与えることがある。
   * Reactコンポーネントを使う方法
   * メリット
   * 高いカスタマイズ性: Reactコンポーネントを使うことで、地図のスタイルや機能を細かくカスタマイズできる。
   * 統合が容易: 他のReactコンポーネントと簡単に統合でき、アプリ全体の一貫性を保つことができる。
   * 3. パフォーマンスの向上: 必要な部分だけをレンダリングすることで、パフォーマンスを最適化できる。
   * デメリット
   * 1. 実装が複雑: iframeに比べて実装が複雑で、APIキーの管理やロード状態の管理が必要。
   * メンテナンスが必要: Google Maps APIの変更に対応するために、コードのメンテナンスが必要。
   */
}
