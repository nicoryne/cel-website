import Image from 'next/image';
export default function GroundhogPage() {
  return (
    <>
      <Image
        src="/images/dancing-groundhog.gif"
        alt="A GIF of a dancing groundhog"
        width={1440}
        height={1080}
        className="h-screen w-screen"
      />
    </>
  );
}
