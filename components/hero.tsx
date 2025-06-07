import Image from 'next/image';

export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
        <Image
          src="/hero1.png"
          alt="Logo"
          width={407.25}
          height={179}
        />
      </div>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        Sher ne Dahaada h, Girnar ne faada h!
      </p>
    </div>
  );
}
