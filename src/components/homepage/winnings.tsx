import Carousel from "@/components/ui/carousel";

export default function Winnings() {
  const slideData = [
    {
      title: "Music Trophy Winners",
      src: "/images/carousel/music_2024.jpg",
    },
    {
      title: "Winners of PFC Trophy",
      src: "/images/carousel/photostory_2024.jpg",
    },
    {
      title: "Winners of CAIC GC 2024",
      src: "/images/carousel/tech_gc_2024.jpg",
    },
    {
      title: "Winners of Wall Painting",
      src: "/images/draggable/5.jpg",
    },
    {
      title: "2nd runner-up in Street Play",
      src: "/images/carousel/streetplay_2024.jpg",
    },
    {
      title: "4th in Mime monoact",
      src: "/images/carousel/mime_2024.jpg",
    },
  ];
  
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen h-screen snap-start">
      <h1 className="text-4xl font-bold my-8 text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
        We Rule
      </h1>
      <div className="relative content-center overflow-hidden pb-32 w-full h-full">
        <Carousel slides={slideData} />
      </div>
    </div>
  );
}
