import type { GetTestimonialsQuery } from 'src/gql/graphql'
import { Testimonials } from '~/components/molecules/Testimonials'

type Props = {
  testimonials: Promise<GetTestimonialsQuery>
}

export const TestimonialSection: React.FC<Props> = ({ testimonials }) => {
  return (
    <div className='md:p-16'>
      <div className='flex flex-col gap-6 p-9 bg-beige'>
        <h2 className='font-extrabold font-yumincho text-3xl'>お客様の声</h2>
        <Testimonials testimonials={testimonials} />
      </div>
    </div>
  )
}
