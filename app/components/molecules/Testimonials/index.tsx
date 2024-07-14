import { Await } from '@remix-run/react'
import { Suspense } from 'react'
import type { GetTestimonialsQuery } from 'src/gql/graphql'
import { TestimonialCard } from '../TestimonialCard'

type Props = {
  testimonials: Promise<GetTestimonialsQuery>
}

export const Testimonials: React.FC<Props> = ({ testimonials }) => (
  <div className='flex gap-5 overflow-x-scroll'>
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={testimonials}>
        {(response) => {
          const testimonials = response.metaobjects.nodes.map((node) =>
            node.fields.reduce((acc: { [key: string]: string | number }, field) => {
              acc['id'] = node.id
              if (field.value) {
                acc[field.key] = field.value
              }
              return acc
            }, {})
          )
          return testimonials.map((testimonial) => {
            return (
              <TestimonialCard
                key={testimonial.id}
                title={testimonial.title as string}
                text={testimonial.comment as string}
                sex={testimonial.sex as 'man' | 'woman'}
                customerAge={testimonial.age as number}
              />
            )
          })
        }}
      </Await>
    </Suspense>
  </div>
)
