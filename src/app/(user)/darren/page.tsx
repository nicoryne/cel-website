import Image from 'next/image';
export default function DarrenPage() {
  return (
    <>
      <Image
        src="/images/darren.jpg"
        alt="Darren"
        width={1440}
        height={1080}
        className="h-screen w-screen"
      />
    </>
  );
}
