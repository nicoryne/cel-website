import Image from 'next/image';
import contact_us from '@/../public/images/contact_us.webp';
import MotionComponent from '@/components/ui/motion-component';
import ContactForm from '@/components/form-contact';

export default function ContactSection() {
  return (
    <section aria-labelledby="contact-heading" id="contact" className="mx-auto px-8 lg:py-16">
      <MotionComponent
        type="div"
        className="mx-auto grid w-full lg:w-[80vw] lg:grid-cols-2 lg:py-8"
        variants={{
          hidden: { opacity: 0.6, scale: 0.97 },
          visible: { opacity: 1, scale: 1 }
        }}
        initial="hidden"
        transition={{ type: 'spring', duration: 0.6, bounce: 0.2 }}
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Image */}
        <div className="relative lg:order-2">
          <Image
            src={contact_us}
            alt="CEL Staff Media"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={95}
            className="h-full w-full rounded-r-lg object-cover shadow-lg lg:rounded-r-lg"
          />
        </div>

        <div className="lg:order-1">
          <ContactForm />
        </div>
      </MotionComponent>
    </section>
  );
}
