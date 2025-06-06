export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
        <img
          src="/hero1.png"
          alt="Logo"
          className="h-36 shadow-lg object-cover"
        />
      </div>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        Sher ne Dahaada h, Girnar ne faada h!
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
