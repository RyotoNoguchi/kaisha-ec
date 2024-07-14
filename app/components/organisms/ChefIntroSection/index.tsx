import { Await } from '@remix-run/react'
import { Suspense } from 'react'
import type { GetAboutChefQuery } from 'src/gql/graphql'
import { ChefIntro } from '~/components/molecules/ChefIntro'

type Props = {
  aboutChef: Promise<GetAboutChefQuery>
}

export const ChefIntroSection: React.FC<Props> = ({ aboutChef }) => {
  return (
    <div className='flex flex-col bg-secondary md:px-16 gap-12'>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={aboutChef}>
          {(response) => {
            const props = response?.metaobject?.fields.reduce((acc: { [key: string]: string }, item) => {
              acc[item.key] = item.reference?.__typename === 'MediaImage' ? item.reference.image?.url : item.value
              return acc
            }, {})
            return props && <ChefIntro title={props.title} text={props?.text ?? ''} imageUrl={props.image} />
          }}
        </Await>
      </Suspense>
    </div>
  )
}
