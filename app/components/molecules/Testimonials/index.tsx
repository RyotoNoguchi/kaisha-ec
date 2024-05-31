import { TestimonialCard } from '~/components/molecules/TestimonialCard'

const testimonials = [
  {
    title: '上質な和の体験',
    text: '「肉割烹 膾炙での食事は、単なる外食を超えた体験でした。選び抜かれた佐賀牛のステーキは、その一口一口に感動。和の伝統を重んじたお店の雰囲気と、丁寧なサービスが素晴らしく、特別な日をさらに格別なものにしてくれました。」',
    sex: '女性',
    customerAge: 40
  },
  {
    title: '素材と技の極致',
    text: '「素材の味を生かした調理法には毎回感動します。特に赤身のランプステーキは絶品で、肉本来の味わいが口いっぱいに広がります。細部にわたる料理人のこだわりが、見事に一皿に表現されていると感じました。」',
    sex: '男性',
    customerAge: 30
  },
  {
    title: '安らぎの空間で味わう至福の時',
    text: '「肉割烹 膾炙での食事は、単なる外食を超えた体験でした。選び抜かれた佐賀牛のステーキは、その一口一口に感動。和の伝統を重んじたお店の雰囲気と、丁寧なサービスが素晴らしく、特別な日をさらに格別なものにしてくれました。」',
    sex: '女性',
    customerAge: 50
  }
]

export const Testimonials: React.FC = () => (
  <div className='flex gap-5 overflow-x-scroll'>
    {testimonials.map((testimonial, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <TestimonialCard key={index} title={testimonial.title} text={testimonial.text} sex={testimonial.sex} customerAge={testimonial.customerAge} />
    ))}
  </div>
)
