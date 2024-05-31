import { Testimonials } from '~/components/molecules/Testimonials'

export const TestimonialSection = () => {
  return (
    <div className='md:p-16'>
      <div className='flex flex-col gap-6 p-9 bg-beige'>
        <h2 className='font-extrabold font-yumincho text-3xl'>お客様の声</h2>
        <Testimonials />
      </div>
    </div>
  )
}
