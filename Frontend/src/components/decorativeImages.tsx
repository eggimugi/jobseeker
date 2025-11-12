import Image from "next/image";

const DecorativeImages = () => (
  <div className="hidden lg:flex flex-1 justify-center items-center relative min-h-[400px]">
    <Image
      src="/images/Images1.svg"
      alt="Decorative illustration"
      className="h-[80%] max-h-[600px] object-contain"
      width={400}
      height={400}
    />
    <Image
      src="/images/Images1.svg"
      alt="Decorative element"
      className="absolute w-44 h-28 object-cover top-0 right-0"
      width={224}
      height={144}
    />
    <Image
      src="/images/Images1.svg"
      alt="Decorative element"
      className="absolute w-44 h-28 object-cover bottom-0 left-0"
      width={224}
      height={144}
    />
  </div>
);

export default DecorativeImages;